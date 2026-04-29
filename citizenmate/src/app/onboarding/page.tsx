"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Loader2, Sparkles, Target, BookOpen, Brain, CheckCircle2 } from "lucide-react";
import { useTestDate } from "@/lib/test-date-context";
import { toast } from "@/lib/toast";
import Image from "next/image";

export default function OnboardingPage() {
  const router = useRouter();
  const { setTestDate } = useTestDate();
  const [step, setStep] = useState(1);
  const [inputDate, setInputDate] = useState("");
  const [knowledgeLevel, setKnowledgeLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDateNext = () => {
    if (inputDate) {
      const selected = new Date(inputDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        setError("Please choose a future date.");
        return;
      }
    }
    setError("");
    setStep(2);
  };

  const handleComplete = async () => {
    if (!knowledgeLevel) return;
    
    setLoading(true);
    // Simulated personalization delay for premium feel
    await new Promise(r => setTimeout(r, 1500));
    
    if (inputDate) {
      setTestDate(inputDate);
      toast.success("Plan personalized! 🎯", "We've adapted your study timeline.");
    } else {
      toast.success("Welcome aboard! 🇦🇺", "Let's start your citizenship journey.");
    }
    
    localStorage.setItem("citizenmate-onboarding-completed", "true");
    router.push("/practice");
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-cm-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cm-teal/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cm-teal-light/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cm-gold-light/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Progress Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2">
            <div className={`w-12 h-1.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-cm-teal' : 'bg-cm-slate-200'}`} />
            <div className={`w-12 h-1.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-cm-teal' : 'bg-cm-slate-200'}`} />
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-xl border border-cm-slate-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cm-teal-light/20 text-cm-teal mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-cm-slate-900 mb-3">
                  When is your test?
                </h1>
                <p className="text-cm-slate-500 mb-8 text-lg">
                  We'll build a personalized study schedule anchored to your test date.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-cm-slate-700 mb-2">
                      Select your test date
                    </label>
                    <input
                      type="date"
                      value={inputDate}
                      onChange={(e) => {
                        setInputDate(e.target.value);
                        setError("");
                      }}
                      min={todayStr}
                      className="w-full px-5 py-4 rounded-xl border-2 border-cm-slate-200 focus:border-cm-teal focus:ring-4 focus:ring-cm-teal/10 focus:outline-none transition-all text-cm-slate-900 font-medium text-lg"
                    />
                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-cm-red mt-2 font-medium">
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={handleDateNext}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        inputDate 
                          ? "bg-cm-teal text-white hover:bg-cm-teal-light shadow-md" 
                          : "bg-cm-slate-100 text-cm-slate-400 hover:bg-cm-slate-200"
                      }`}
                    >
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setInputDate("");
                        setStep(2);
                      }}
                      className="w-full py-3 text-cm-slate-500 font-medium hover:text-cm-slate-800 transition-colors cursor-pointer"
                    >
                      I haven't booked it yet
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cm-gold-light/30 text-cm-gold-dark mb-6">
                  <Brain className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-cm-slate-900 mb-3">
                  Where are you starting?
                </h1>
                <p className="text-cm-slate-500 mb-8 text-lg">
                  This helps us calibrate the AI Tutor and your initial question difficulty.
                </p>

                <div className="space-y-4 mb-8">
                  <KnowledgeOption 
                    selected={knowledgeLevel === "beginner"} 
                    onClick={() => setKnowledgeLevel("beginner")}
                    title="Just starting out"
                    description="I haven't read the 'Our Common Bond' booklet yet."
                    icon={<BookOpen className="w-5 h-5" />}
                  />
                  <KnowledgeOption 
                    selected={knowledgeLevel === "intermediate"} 
                    onClick={() => setKnowledgeLevel("intermediate")}
                    title="I've studied a bit"
                    description="I know the basics but need to practice."
                    icon={<Target className="w-5 h-5" />}
                  />
                  <KnowledgeOption 
                    selected={knowledgeLevel === "advanced"} 
                    onClick={() => setKnowledgeLevel("advanced")}
                    title="Feeling confident"
                    description="I'm ready to crush the practice tests."
                    icon={<CheckCircle2 className="w-5 h-5" />}
                  />
                </div>

                <button
                  onClick={handleComplete}
                  disabled={!knowledgeLevel || loading}
                  className="w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-cm-teal text-white hover:bg-cm-teal-light shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Personalizing...
                    </>
                  ) : (
                    <>
                      Complete Setup <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function KnowledgeOption({ 
  selected, 
  onClick, 
  title, 
  description, 
  icon 
}: { 
  selected: boolean; 
  onClick: () => void; 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
}) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
        selected 
          ? "border-cm-teal bg-cm-teal-light/5" 
          : "border-cm-slate-100 hover:border-cm-slate-200 bg-white"
      }`}
    >
      <div className={`p-2 rounded-lg ${selected ? 'bg-cm-teal text-white' : 'bg-cm-slate-100 text-cm-slate-500'}`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-semibold ${selected ? 'text-cm-slate-900' : 'text-cm-slate-700'}`}>
          {title}
        </h3>
        <p className="text-sm text-cm-slate-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
