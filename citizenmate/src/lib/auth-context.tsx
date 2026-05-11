"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { User, AuthError } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { syncAllToSupabase, pullFromSupabase } from "@/lib/sync";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { toast } from "@/lib/toast";
import { posthog } from "@/components/providers/posthog-provider";
import * as Sentry from "@sentry/nextjs";

// ===== Types =====

interface ProfileData {
  tier: 'free' | 'pro' | 'premium' | 'sprint_pass';
  isPremium: boolean;
  isAdmin: boolean;
  expiresAt: Date | null;
  testDate: string | null;
  loading: boolean;
  needsOnboarding: boolean;
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
  startCheckout: (tier?: string, interval?: string) => Promise<void>;
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
    tier: 'free',
    isPremium: false,
    isAdmin: false,
    expiresAt: null,
    testDate: null,
    loading: true,
    needsOnboarding: false,
  });

  // Fetch profile data from Supabase profile
  const fetchProfileData = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      setProfile({ tier: 'free', isPremium: false, isAdmin: false, expiresAt: null, testDate: null, loading: false, needsOnboarding: false });
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("tier, is_premium, premium_expires_at, test_date, is_admin")
        .eq("id", userId)
        .single();

      if (error || !data) {
        setProfile({ tier: 'free', isPremium: false, isAdmin: false, expiresAt: null, testDate: null, loading: false, needsOnboarding: false });
        return;
      }

      // Check if premium is still active (not expired)
      const expiresAt = data.premium_expires_at
        ? new Date(data.premium_expires_at)
        : null;
      const isActive =
        data.is_premium === true &&
        (expiresAt === null || expiresAt > new Date());

      // Signal that the user needs onboarding — let the page component handle navigation.
      // Using router.push avoids a full-page reload that drops all client state.
      const needsOnboarding = !data.test_date;

      setProfile({
        tier: (data.tier as 'free' | 'pro' | 'premium') || 'free',
        isPremium: isActive,
        isAdmin: data.is_admin === true,
        expiresAt,
        testDate: data.test_date,
        loading: false,
        needsOnboarding,
      });
    } catch {
      setProfile({ tier: 'free', isPremium: false, isAdmin: false, expiresAt: null, testDate: null, loading: false, needsOnboarding: false });
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

    let isMounted = true;
    
    // Safety fallback: Never stay in loading state longer than 3 seconds
    const loadingTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
        setProfile(p => p.loading ? { ...p, loading: false } : p);
      }
    }, 3000);

    const supabase = getSupabaseBrowserClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        fetchProfileData(currentUser.id);
      } else {
        setProfile({ tier: 'free', isPremium: false, isAdmin: false, expiresAt: null, testDate: null, loading: false, needsOnboarding: false });
      }
    }).catch((err) => {
      console.error("[AuthProvider] getSession error:", err);
      if (isMounted) {
        setLoading(false);
        setProfile({ tier: 'free', isPremium: false, isAdmin: false, expiresAt: null, testDate: null, loading: false, needsOnboarding: false });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      // Always clear loading state when we receive an auth event
      setLoading(false);

      if (newUser) {
        const identifiedProps = {
          email: newUser.email,
          provider: newUser.app_metadata?.provider ?? 'email',
        };

        if (typeof window !== 'undefined') {
          posthog.identify(newUser.id, identifiedProps);
        }

        Sentry.setUser({
          id: newUser.id,
          email: newUser.email,
          username: newUser.user_metadata?.full_name,
        });

        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          try {
            if (event === "SIGNED_IN") {
              await syncAllToSupabase(newUser.id);
              await pullFromSupabase(newUser.id);
              if (typeof window !== 'undefined') {
                const isNewUser = newUser.created_at === newUser.last_sign_in_at;
                posthog.capture(isNewUser ? 'user_signed_up' : 'user_signed_in', {
                  provider: newUser.app_metadata?.provider ?? 'email',
                });
              }
            }
            await fetchProfileData(newUser.id);
          } catch (err) {
            console.error(`[AuthProvider] error during ${event}:`, err);
            Sentry.captureException(err, {
              extra: { eventType: event, userId: newUser.id },
            });
            if (typeof window !== 'undefined') {
              posthog.capture('auth_error', { event_type: event, error: String(err) });
            }
            setProfile(p => ({ ...p, loading: false }));
          }
        }
      } else {
        if (event === "SIGNED_OUT") {
          if (typeof window !== 'undefined') {
            posthog.capture('user_signed_out');
            posthog.reset();
          }
          Sentry.setUser(null);
        }
        if (event === "SIGNED_OUT" || event === "INITIAL_SESSION") {
          setProfile({ tier: 'free', isPremium: false, isAdmin: false, expiresAt: null, testDate: null, loading: false, needsOnboarding: false });
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
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
    
    // Redirect to the API route to exchange the code for a session on the server
    const finalRedirect = new URL(`${window.location.origin}/api/auth/callback`);
    finalRedirect.searchParams.set("next", redirectTo || "/dashboard");
      
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: finalRedirect.toString() },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    // Clear local state first
    setUser(null);
    setProfile({ tier: 'free', isPremium: false, isAdmin: false, expiresAt: null, testDate: null, loading: false, needsOnboarding: false });

    // Server-side signout to clear HttpOnly cookies
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (e) {
      console.error("Failed to sign out on server:", e);
    }

    // Attempt to sign out of Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Failed to sign out of Supabase:", e);
        Sentry.captureException(e);
      }
    }
    
    // Clear analytics identity
    if (typeof window !== "undefined") {
      posthog.capture('user_signed_out');
      posthog.reset();
    }
    Sentry.setUser(null);
    
    // Force a hard redirect to home to clear server-side middleware state
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  // Initiate Stripe checkout
  const startCheckout = useCallback(async (tier: string = 'premium', interval: string = 'month') => {
    if (!user) {
      openAuthModal();
      throw new Error("You must be signed in to upgrade.");
    }

    if (typeof window !== 'undefined') {
      posthog.capture('checkout_started', { tier, interval });
    }

    // Check for referral promo code from cookie
    let promoCode: string | undefined;
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(^| )citizenmate_promo=([^;]+)/);
      if (match) promoCode = match[2];
    }

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promoCode, tier, interval }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        console.warn("[Checkout] Session expired or unauthenticated. Opening auth modal.");
        openAuthModal();
        throw new Error("Session expired. Please sign in again.");
      }

      console.error("[Checkout] Server error:", errorData.error || response.statusText);
      
      // Show specific error messages for missing Stripe configuration
      if (errorData.error === "Stripe not configured" || (typeof errorData.error === 'string' && errorData.error.includes("Price ID not configured"))) {
        const msg = errorData.error === "Stripe not configured"
          ? "Stripe is not configured in this environment."
          : errorData.error;
        toast.error("Checkout Unavailable", msg);
        throw new Error(msg);
      }

      const fallbackMsg = "Something went wrong starting checkout. Please try again.";
      toast.error("Checkout Error", fallbackMsg);
      throw new Error(fallbackMsg);
    }

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      const msg = "No checkout URL returned. Please try again.";
      console.error("[Checkout] No URL returned:", data.error);
      throw new Error(msg);
    }
  }, [user, openAuthModal]);

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <AuthContext.Provider value={value}>
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
    tier: profile.tier,
    isPremium: profile.isPremium,
    premiumLoading: profile.loading,
    expiresAt: profile.expiresAt,
    isSignedIn: !!user,
    upgrade: () => openModal("premium_gate"),
  };
}
