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

// ===== Types =====

interface PremiumStatus {
  isPremium: boolean;
  expiresAt: Date | null;
  loading: boolean;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  premium: PremiumStatus;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
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
  const [premium, setPremium] = useState<PremiumStatus>({
    isPremium: false,
    expiresAt: null,
    loading: true,
  });

  // Fetch premium status from Supabase profile
  const fetchPremiumStatus = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      setPremium({ isPremium: false, expiresAt: null, loading: false });
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("is_premium, premium_expires_at")
        .eq("id", userId)
        .single();

      if (error || !data) {
        setPremium({ isPremium: false, expiresAt: null, loading: false });
        return;
      }

      // Check if premium is still active (not expired)
      const expiresAt = data.premium_expires_at
        ? new Date(data.premium_expires_at)
        : null;
      const isActive =
        data.is_premium === true &&
        (expiresAt === null || expiresAt > new Date());

      setPremium({
        isPremium: isActive,
        expiresAt,
        loading: false,
      });
    } catch {
      setPremium({ isPremium: false, expiresAt: null, loading: false });
    }
  }, []);

  const refreshPremiumStatus = useCallback(async () => {
    if (user) {
      await fetchPremiumStatus(user.id);
    }
  }, [user, fetchPremiumStatus]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setPremium((p) => ({ ...p, loading: false }));
      return;
    }

    const supabase = getSupabaseBrowserClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        fetchPremiumStatus(currentUser.id);
      } else {
        setPremium({ isPremium: false, expiresAt: null, loading: false });
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
          await fetchPremiumStatus(newUser.id);
        } catch (err) {
          console.error("[AuthProvider] Sync error on sign-in:", err);
        }
      }

      if (event === "SIGNED_OUT") {
        setPremium({ isPremium: false, expiresAt: null, loading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPremiumStatus]);

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
      const { error } = await supabase.auth.signUp({ email, password });
      if (!error) closeAuthModal();
      return { error };
    },
    [closeAuthModal]
  );

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      return { error: { message: "Supabase not configured" } as AuthError };
    }
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setPremium({ isPremium: false, expiresAt: null, loading: false });
  }, []);

  // Initiate Stripe checkout
  const startCheckout = useCallback(async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        premium,
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
  const { premium, startCheckout, user } = useAuth();
  return {
    isPremium: premium.isPremium,
    premiumLoading: premium.loading,
    expiresAt: premium.expiresAt,
    isSignedIn: !!user,
    upgrade: startCheckout,
  };
}
