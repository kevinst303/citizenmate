"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  LogOut, 
  Settings as SettingsIcon,
  Shield,
  CreditCard,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTestDate } from "@/lib/test-date-context";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { useT } from "@/i18n/i18n-context";
import { useRouter } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { testDate, openModal: openTestDateModal } = useTestDate();
  const { openModal: openUpgradeModal } = useUpgradeModal();
  const { t } = useT();
  const router = useRouter();
  
  const [imageError, setImageError] = useState(false);

  // Prevent hydration mismatch for client-only rendering
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (hasMounted && !authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, hasMounted, router]);

  if (!hasMounted || authLoading || !user) {
    return (
      <div className="min-h-screen bg-cm-ice flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cm-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-cm-ice">
      {/* ===== Hero ===== */}
      <SubpageHero
        title={t("settings.hero_title")}
        breadcrumbs={[
          { label: t("settings.hero_breadcrumb_home"), href: "/" },
          { label: t("settings.hero_breadcrumb_settings") },
        ]}
        description={t("settings.hero_desc")}
        bgImage="/generated/dash-welcome.webp"
        badge={t("settings.hero_badge")}
        curveColorClass="text-cm-ice"
      />

      {/* ===== Main content ===== */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 -mt-8 relative z-10 pb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Account Profile Card */}
          <motion.div variants={item} className="bg-white border border-cm-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cm-navy-50 text-cm-navy">
                <User className="w-5 h-5" />
              </div>
              <h2 className="font-heading font-bold text-xl text-cm-slate-900">
                {t("settings.personal_info")}
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-shrink-0">
                {avatarUrl && !imageError ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white ring-1 ring-cm-slate-200"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cm-teal to-cm-teal-dark flex items-center justify-center text-white text-3xl font-bold shadow-md border-4 border-white ring-1 ring-cm-slate-200">
                    {initials}
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="text-xs font-semibold text-cm-slate-500 uppercase tracking-wider mb-1 block">{t("settings.full_name")}</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-cm-slate-50 rounded-xl border border-cm-slate-100">
                    <User className="w-4 h-4 text-cm-slate-400" />
                    <span className="text-sm font-medium text-cm-slate-800">{displayName}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-cm-slate-500 uppercase tracking-wider mb-1 block">{t("settings.email_address")}</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-cm-slate-50 rounded-xl border border-cm-slate-100">
                    <Mail className="w-4 h-4 text-cm-slate-400" />
                    <span className="text-sm font-medium text-cm-slate-800">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-cm-slate-100 flex items-start gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
              <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">{t("settings.auth_google")}</p>
                <p className="text-xs text-amber-700/80">
                  {t("settings.auth_google_desc")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Test Date Settings */}
          <motion.div variants={item} className="bg-white border border-cm-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cm-eucalyptus-light text-cm-eucalyptus">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-cm-slate-900">
                    {t("settings.test_schedule")}
                  </h2>
                  <p className="text-sm text-cm-slate-500 mt-0.5">{t("settings.manage_test_date")}</p>
                </div>
              </div>
              <button
                onClick={openTestDateModal}
                className="px-4 py-2 bg-cm-slate-100 text-cm-slate-700 font-semibold text-sm rounded-xl hover:bg-cm-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2"
              >
                {t("settings.change_date")}
              </button>
            </div>
            
            <div className="flex items-center gap-4 px-5 py-4 bg-cm-slate-50 rounded-xl border border-cm-slate-100">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-cm-slate-200 shadow-sm text-cm-slate-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-cm-slate-500 uppercase tracking-wider mb-1">{t("settings.current_test_date")}</p>
                {testDate ? (
                  <p className="text-base font-bold text-cm-slate-900">
                    {new Date(testDate).toLocaleDateString("en-AU", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                ) : (
                  <p className="text-base font-medium text-cm-slate-600 italic">
                    {t("settings.not_set")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Subscription Settings */}
          <motion.div variants={item} className="bg-white border border-cm-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cm-gold/5 rounded-bl-[100px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${profile.isPremium ? 'bg-cm-gold/20 text-cm-gold' : 'bg-cm-slate-100 text-cm-slate-500'}`}>
                  {profile.isPremium ? <Crown className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-cm-slate-900">
                    {t("settings.subscription")}
                  </h2>
                  <p className="text-sm text-cm-slate-500 mt-0.5">{t("settings.manage_plan")}</p>
                </div>
              </div>
              
              {!profile.isPremium && (
                <button
                  onClick={() => openUpgradeModal("settings_page")}
                  className="px-5 py-2.5 bg-cm-navy text-white font-bold text-sm rounded-xl hover:bg-cm-navy-light transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2 flex items-center gap-2 justify-center"
                >
                  <Crown className="w-4 h-4" />
                  {t("settings.upgrade_to_premium")}
                </button>
              )}
            </div>
            
            <div className={`px-5 py-5 rounded-xl border ${profile.isPremium ? 'bg-gradient-to-r from-cm-gold/10 to-transparent border-cm-gold/30' : 'bg-cm-slate-50 border-cm-slate-100'} relative z-10`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-cm-slate-500 uppercase tracking-wider">{t("settings.current_plan")}</p>
                    {profile.isPremium && (
                      <span className="px-2 py-0.5 bg-cm-gold text-white text-[10px] font-bold uppercase tracking-wider rounded-md">{t("settings.plan_active")}</span>
                    )}
                  </div>
                  <p className="text-2xl font-heading font-extrabold text-cm-slate-900 capitalize">
                    {profile.tier === 'free' ? t("settings.plan_sprint_pass_free") : profile.tier}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                {profile.isPremium ? (
                  <>
                    <p className="text-sm font-medium text-cm-slate-700">
                      {t("settings.plan_premium_access")}
                    </p>
                    {profile.expiresAt && (
                      <p className="text-xs text-cm-slate-500 mt-2">
                        {t("settings.plan_expires_on")} {new Date(profile.expiresAt).toLocaleDateString("en-AU")}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium text-cm-slate-600">
                    {t("settings.plan_free_tier")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={item} className="bg-white border border-red-100 p-6 sm:p-8 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-cm-red">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="font-heading font-bold text-xl text-cm-slate-900">
                {t("settings.danger_zone")}
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-red-50/50 rounded-xl border border-red-100 gap-4">
              <div>
                <h3 className="font-semibold text-cm-slate-800 mb-1">{t("settings.sign_out_title")}</h3>
                <p className="text-sm text-cm-slate-500">
                  {t("settings.sign_out_desc")}
                </p>
              </div>
              <button
                onClick={signOut}
                className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-cm-red font-bold text-sm rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-red focus-visible:ring-offset-2 w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4" />
                {t("settings.sign_out_button")}
              </button>
            </div>
          </motion.div>
          
        </motion.div>
      </section>
    </div>
  );
}
