"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { posthog } from "@/components/providers/posthog-provider";
import { useT } from "@/i18n/i18n-context";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Monitor, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSettingsStore } from "@/lib/store/useSettingsStore";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [testDate, setTestDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, refreshPremiumStatus } = useAuth();
  const router = useRouter();
  const { t } = useT();
  const { reduceMotion, setReduceMotion } = useSettingsStore();

  const handleNext = () => setStep((s) => s + 1);

  const handleSave = async (selectedDate: string | null) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const finalDate = selectedDate || "1970-01-01";
      const { error } = await supabase
        .from("profiles")
        .update({ test_date: finalDate })
        .eq("id", user.id);

      if (error) {
        console.error("Failed to save onboarding data:", error);
      } else {
        if (typeof window !== "undefined") {
          posthog.capture("onboarding_completed", {
            has_test_date: !!selectedDate,
            reduce_motion: reduceMotion,
            days_until_test: selectedDate
              ? Math.ceil((new Date(selectedDate).getTime() - Date.now()) / 86400000)
              : null,
          });
        }
        await refreshPremiumStatus();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen bg-cm-ice flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cm-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cm-purple/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-cm-teal' : step > i ? 'w-4 bg-cm-teal/40' : 'w-4 bg-cm-slate-200'}`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-cm-slate-200/50 border border-cm-slate-100 min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col flex-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-cm-slate-900 mb-4">
                  {t("onboarding.welcome", "Welcome to CitizenMate!")}
                </h1>
                <p className="text-cm-slate-600 text-lg leading-relaxed flex-1">
                  {t("onboarding.welcome_desc", "We're excited to help you prepare for your Australian citizenship test. Let's set up your study profile in just a few quick steps.")}
                </p>
                <Button onClick={handleNext} className="w-full mt-8 bg-cm-navy hover:bg-cm-navy-light text-white rounded-xl py-6 text-lg font-semibold group">
                  {t("onboarding.continue", "Get Started")}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col flex-1">
                <div className="w-12 h-12 rounded-2xl bg-cm-teal-light text-cm-teal flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-cm-slate-900 mb-4">
                  {t("onboarding.when_test", "When is your test?")}
                </h1>
                <p className="text-cm-slate-600 mb-8">
                  {t("onboarding.description", "Setting a goal date helps us tailor your study plan and keep you on track.")}
                </p>
                
                <div className="flex-1">
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full bg-cm-slate-50 border border-cm-slate-200 rounded-xl px-5 py-4 text-cm-slate-900 focus:outline-none focus:ring-2 focus:ring-cm-teal transition-all text-lg font-medium"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <Button
                    onClick={handleNext}
                    className="w-full bg-cm-navy hover:bg-cm-navy-light text-white rounded-xl py-6 text-lg font-semibold group"
                  >
                    {t("onboarding.continue", "Continue")}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <button
                    onClick={handleNext}
                    className="w-full text-cm-slate-500 hover:text-cm-slate-800 text-sm py-2 font-medium transition-colors"
                  >
                    {t("onboarding.dont_know_date", "I don't know my test date yet")}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col flex-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                  <Monitor className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-cm-slate-900 mb-4">
                  {t("onboarding.preferences", "Study Preferences")}
                </h1>
                <p className="text-cm-slate-600 mb-8">
                  {t("onboarding.preferences_desc", "Customize your interface for a comfortable, distraction-free learning experience.")}
                </p>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between p-5 bg-cm-slate-50 rounded-2xl border border-cm-slate-100">
                    <div>
                      <h3 className="font-semibold text-cm-slate-900 mb-1">
                        {t("settings.reduce_animations", "Reduce Animations")}
                      </h3>
                      <p className="text-sm text-cm-slate-500 leading-relaxed max-w-[200px]">
                        {t("settings.reduce_animations_desc", "Minimize motion for a calmer experience.")}
                      </p>
                    </div>
                    <Switch 
                      checked={reduceMotion} 
                      onCheckedChange={setReduceMotion}
                      className="data-[state=checked]:bg-cm-teal"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleSave(testDate)}
                  disabled={loading}
                  className="w-full mt-8 bg-cm-eucalyptus hover:bg-emerald-700 text-white rounded-xl py-6 text-lg font-bold"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      {t("onboarding.saving", "Saving...")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {t("onboarding.complete_setup", "Complete Setup")}
                    </div>
                  )}
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
