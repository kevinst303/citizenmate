"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, AuthError } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { syncAllToSupabase, pullFromSupabase } from "@/lib/sync";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";

// ===== Types =====

interface ProfileData {
  isPremium: boolean;
  expiresAt: Date | null;
  testDate: string | null;
  loading: boolean;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  profile: ProfileData;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshPremiumStatus: () => Promise<void>;
  startCheckout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ===== Supabase availability check =====

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ===== Provider =====

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    isPremium: false,
    expiresAt: null,
    testDate: null,
    loading: true,
  });

  // Fetch profile data from Supabase profile
  const fetchProfileData = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      setProfile({ isPremium: false, expiresAt: null, testDate: null, loading: false });
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("is_premium, premium_expires_at, test_date")
        .eq("id", userId)
        .single();

      if (error || !data) {
        setProfile({ isPremium: false, expiresAt: null, testDate: null, loading: false });
        return;
      }

      // Check if premium is still active (not expired)
      const expiresAt = data.premium_expires_at
        ? new Date(data.premium_expires_at)
        : null;
      const isActive =
        data.is_premium === true &&
        (expiresAt === null || expiresAt > new Date());

      setProfile({
        isPremium: isActive,
        expiresAt,
        testDate: data.test_date,
        loading: false,
      });
      
      // Redirect to onboarding if they don't have a test date
      if (!data.test_date && typeof window !== "undefined") {
        const path = window.location.pathname;
        if (!path.includes("/onboarding") && !path.includes("/admin")) {
          const match = path.match(/^\/([a-z]{2})\//);
          const langPrefix = match ? `/${match[1]}` : "/en";
          window.location.href = `${langPrefix}/onboarding`;
        }
      }
    } catch {
      setProfile({ isPremium: false, expiresAt: null, testDate: null, loading: false });
    }
  }, []);

  const refreshPremiumStatus = useCallback(async () => {
    if (user) {
      await fetchProfileData(user.id);
    }
  }, [user, fetchProfileData]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setProfile((p) => ({ ...p, loading: false }));
      return;
    }

    const supabase = getSupabaseBrowserClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        fetchProfileData(currentUser.id);
      } else {
        setProfile({ isPremium: false, expiresAt: null, testDate: null, loading: false });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      // On sign-in: sync localStorage data to Supabase, then pull latest
      if (event === "SIGNED_IN" && newUser) {
        try {
          await syncAllToSupabase(newUser.id);
          await pullFromSupabase(newUser.id);
          await fetchProfileData(newUser.id);
        } catch (err) {
          console.error("[AuthProvider] Sync error on sign-in:", err);
        }
      }

      if (event === "SIGNED_OUT") {
        setProfile({ isPremium: false, expiresAt: null, testDate: null, loading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfileData]);

  // Check for checkout success on mount (user returning from Stripe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success" && user) {
      // Delay to let the webhook fire and process
      const timer = setTimeout(() => {
        refreshPremiumStatus();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, refreshPremiumStatus]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured()) {
        return { error: { message: "Supabase not configured" } as AuthError };
      }
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) closeAuthModal();
      return { error };
    },
    [closeAuthModal]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured()) {
        return { error: { message: "Supabase not configured" } as AuthError };
      }
      const supabase = getSupabaseBrowserClient();
      
      let referred_by = undefined;
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/(^| )citizenmate_ref=([^;]+)/);
        if (match) referred_by = match[2];
      }

      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            referred_by,
          }
        }
      });
      if (!error) closeAuthModal();
      return { error };
    },
    [closeAuthModal]
  );

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    if (!isSupabaseConfigured()) {
      return { error: { message: "Supabase not configured" } as AuthError };
    }
    const supabase = getSupabaseBrowserClient();
    const finalRedirect = redirectTo
      ? `${window.location.origin}${redirectTo}`
      : `${window.location.origin}/dashboard`;
      
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: finalRedirect },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile({ isPremium: false, expiresAt: null, testDate: null, loading: false });
  }, []);

  // Initiate Stripe checkout
  const startCheckout = useCallback(async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      // Check for referral promo code from cookie
      let promoCode: string | undefined;
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/(^| )citizenmate_promo=([^;]+)/);
        if (match) promoCode = match[2];
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Checkout] Server error:", errorData.error || response.statusText);
        return;
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("[Checkout] No URL returned:", data.error);
      }
    } catch (err) {
      console.error("[Checkout] Error:", err);
    }
  }, [user, openAuthModal]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshPremiumStatus,
        startCheckout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ===== Hook =====

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// ===== Premium Gate Hook =====
// Use this in any component to check if user has premium access

export function usePremium() {
  const { profile, user } = useAuth();
  const { openModal } = useUpgradeModal();
  
  return {
    isPremium: profile.isPremium,
    premiumLoading: profile.loading,
    expiresAt: profile.expiresAt,
    isSignedIn: !!user,
    upgrade: () => openModal("premium_gate"),
  };
}
