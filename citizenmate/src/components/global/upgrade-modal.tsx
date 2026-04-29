"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Star, Zap, Loader2 } from "lucide-react";
import { useUpgradeModal } from "@/lib/store/useUpgradeModal";
import { toast } from "@/lib/toast";

export function UpgradeModal() {
  const { isOpen, closeUpgradeModal, triggerSource } = useUpgradeModal();
  const [loadingTier, setLoadingTier] = useState<"pro" | "premium" | null>(null);
  const [interval, setInterval] = useState<"month" | "year">("month");

  const handleCheckout = async (tier: "pro" | "premium") => {
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval, source: triggerSource }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      toast.error("Checkout failed", error.message || "Please try again.");
      setLoadingTier(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={closeUpgradeModal}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden border border-[#E9ECEF] my-8"
              style={{ boxShadow: 'rgba(0,0,0,0.1) 0px 10px 40px -10px, rgba(0,0,0,0.05) 0px 4px 6px -2px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-cm-slate-900 via-cm-slate-800 to-cm-slate-900 px-8 pt-10 pb-16 text-white text-center">
                <button
                  onClick={closeUpgradeModal}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cm-teal to-blue-500 mb-4 shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-3">
                  Supercharge Your Preparation
                </h2>
                <p className="text-lg text-white/80 max-w-xl mx-auto">
                  {triggerSource === "mock_test_limit" && "You've reached your free mock test limit. Upgrade to unlock unlimited practice."}
                  {triggerSource === "ai_tutor_limit" && "You've reached your AI Tutor daily limit. Upgrade to keep learning."}
                  {triggerSource === "srs_limit" && "You've reached your daily review limit. Upgrade to unlock unlimited reviews."}
                  {!["mock_test_limit", "ai_tutor_limit", "srs_limit"].includes(triggerSource || "") && "Unlock advanced features, unlimited practice, and pass the test with confidence."}
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center mt-8">
                  <div className="bg-white/10 p-1 rounded-full flex items-center backdrop-blur-md">
                    <button
                      onClick={() => setInterval("month")}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                        interval === "month" ? "bg-white text-cm-slate-900 shadow-sm" : "text-white/70 hover:text-white"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setInterval("year")}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                        interval === "year" ? "bg-white text-cm-slate-900 shadow-sm" : "text-white/70 hover:text-white"
                      }`}
                    >
                      Yearly <span className="px-2 py-0.5 rounded-full bg-cm-eucalyptus-light text-cm-eucalyptus text-[10px] uppercase font-bold tracking-wider">Save 20%</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="px-8 pb-10 -mt-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  
                  {/* Pro Tier */}
                  <div className="bg-white rounded-2xl border-2 border-cm-slate-100 p-6 flex flex-col hover:border-cm-slate-200 transition-colors shadow-sm">
                    <div className="mb-4">
                      <h3 className="text-xl font-heading font-bold text-cm-slate-800">Pro</h3>
                      <p className="text-sm text-cm-slate-500 mt-1">Perfect for consistent self-study.</p>
                    </div>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-cm-slate-900">${interval === "month" ? "9.99" : "7.99"}</span>
                        <span className="text-cm-slate-500 font-medium">/mo</span>
                      </div>
                      {interval === "year" && <p className="text-xs text-cm-slate-400 mt-1">Billed $95.88 yearly</p>}
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      <FeatureItem text="Unlimited Mock Tests" />
                      <FeatureItem text="Advanced Readiness Analytics" />
                      <FeatureItem text="Complete Study Guides" />
                      <FeatureItem text="Standard SRS Reviews" />
                    </ul>
                    <button
                      onClick={() => handleCheckout("pro")}
                      disabled={loadingTier !== null}
                      className="w-full py-3 px-4 rounded-xl font-semibold text-cm-slate-700 bg-cm-slate-100 hover:bg-cm-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loadingTier === "pro" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Pro"}
                    </button>
                  </div>

                  {/* Premium Tier */}
                  <div className="bg-white rounded-2xl border-2 border-cm-teal p-6 flex flex-col relative shadow-xl transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-cm-teal text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Zap className="w-3 h-3 fill-current" /> Most Popular
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-xl font-heading font-bold text-cm-slate-900">Premium</h3>
                      <p className="text-sm text-cm-slate-500 mt-1">Maximum preparation with AI assistance.</p>
                    </div>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-cm-slate-900">${interval === "month" ? "19.99" : "15.99"}</span>
                        <span className="text-cm-slate-500 font-medium">/mo</span>
                      </div>
                      {interval === "year" && <p className="text-xs text-cm-slate-400 mt-1">Billed $191.88 yearly</p>}
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      <FeatureItem text="Everything in Pro" />
                      <FeatureItem text="Unlimited AI Tutor Chat" highlighted />
                      <FeatureItem text="Unlimited SRS Reviews" highlighted />
                      <FeatureItem text="Priority Support" />
                    </ul>
                    <button
                      onClick={() => handleCheckout("premium")}
                      disabled={loadingTier !== null}
                      className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-cm-teal hover:bg-cm-teal-light transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {loadingTier === "premium" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Premium"}
                    </button>
                  </div>

                </div>
                
                <p className="text-center text-sm text-cm-slate-400 mt-8">
                  Cancel anytime. Secured by Stripe.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FeatureItem({ text, highlighted = false }: { text: string; highlighted?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${highlighted ? 'bg-cm-teal-light/20 text-cm-teal' : 'bg-cm-eucalyptus-light text-cm-eucalyptus'}`}>
        <Check className="w-3.5 h-3.5" />
      </div>
      <span className={`text-sm ${highlighted ? 'font-medium text-cm-slate-800' : 'text-cm-slate-600'}`}>
        {text}
      </span>
    </li>
  );
}
