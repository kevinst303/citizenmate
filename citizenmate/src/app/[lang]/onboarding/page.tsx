"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { posthog } from "@/components/providers/posthog-provider";
import { useT } from "@/i18n/i18n-context";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [testDate, setTestDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, refreshPremiumStatus } = useAuth();
  const router = useRouter();
  const { t } = useT();

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

  const slideVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.25, ease: "easeIn" } }
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
                <div className="w-12 h-12 rounded-2xl bg-cm-eucalyptus-light text-cm-eucalyptus flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-cm-slate-900 mb-4">
                  {t("onboarding.all_set", "You're all set!")}
                </h1>
                <p className="text-cm-slate-600 mb-6">
                  {t("onboarding.all_set_desc", "Your study profile is ready. We'll personalize your dashboard and study plan based on your test date. You can fine-tune preferences anytime in Settings.")}
                </p>
                
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-cm-teal-light to-purple-50 rounded-2xl border border-cm-teal/10 p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Sparkles className="w-5 h-5 text-cm-teal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-cm-slate-900 mb-1">
                          {t("onboarding.what_next", "What happens next?")}
                        </h3>
                        <p className="text-sm text-cm-slate-500 leading-relaxed">
                          {t("onboarding.what_next_desc", "We'll create a tailored study plan, track your progress, and help you feel confident for test day. Take it one step at a time — we're here with you.")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSave(testDate)}
                  disabled={loading}
                  className="w-full mt-8 bg-cm-eucalyptus hover:bg-emerald-700 text-white rounded-xl py-6 text-lg font-bold shadow-lg shadow-cm-eucalyptus/20 hover:shadow-xl hover:shadow-cm-eucalyptus/25 transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      {t("onboarding.saving", "Saving...")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {t("onboarding.start_learning", "Start Learning")}
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
