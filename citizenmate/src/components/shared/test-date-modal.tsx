"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, Sparkles } from "lucide-react";
import { useTestDate } from "@/lib/test-date-context";
import { toast } from "@/lib/toast";

export function TestDateModal() {
  const { testDate, setTestDate, clearTestDate, isModalOpen, closeModal } =
    useTestDate();
  const [inputDate, setInputDate] = useState(testDate ?? "");
  const [error, setError] = useState("");

  // Reset input when modal opens
  const handleOpen = () => {
    setInputDate(testDate ?? "");
    setError("");
  };

  const handleSave = () => {
    if (!inputDate) {
      setError("Please select a date.");
      return;
    }

    const selected = new Date(inputDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      setError("Please choose a future date.");
      return;
    }

    setTestDate(inputDate);
    closeModal();

    const savedDate = new Date(inputDate);
    const now2 = new Date();
    now2.setHours(0, 0, 0, 0);
    savedDate.setHours(0, 0, 0, 0);
    const daysAway = Math.ceil(
      (savedDate.getTime() - now2.getTime()) / (1000 * 60 * 60 * 24)
    );
    toast.success(
      "Test date saved! 📅",
      daysAway === 1
        ? "1 day to go — you've got this, mate!"
        : `${daysAway} days to go — let's make them count!`
    );
  };

  const handleClear = () => {
    clearTestDate();
    setInputDate("");
    closeModal();
    toast.info("Test date cleared", "You can set a new one anytime.");
  };

  // Get today's date in YYYY-MM-DD for min attribute
  const todayStr = new Date().toISOString().split("T")[0];

  // Encouragement message based on days
  const getEncouragement = () => {
    if (!inputDate) return null;
    const selected = new Date(inputDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    const days = Math.ceil(
      (selected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) return null;
    if (days <= 7)
      return "That's really soon — let's make every study session count! 💪";
    if (days <= 14)
      return "Two weeks is a solid study window. You've got this, mate!";
    if (days <= 30)
      return "Great timing — one month is perfect for focused preparation.";
    return "Plenty of time to prepare thoroughly. Let's build your confidence!";
  };

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-cm-slate-200 overflow-hidden">
              {/* Header */}
              <div className="relative bg-cm-navy text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/generated/modal-test-date.webp"
                    alt="A marked calendar"
                    fill
                    className="object-cover opacity-50 mix-blend-screen"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-cm-navy to-transparent opacity-90" />
                </div>
                
                <div className="relative z-10 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-lg drop-shadow-sm">
                          Set Your Test Date
                        </h2>
                        <p className="text-sm text-white/90 drop-shadow-sm font-medium">
                          We&apos;ll build your study plan around it
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5">
                {/* Date picker */}
                <div>
                  <label className="block text-sm font-medium text-cm-slate-700 mb-2">
                    When is your citizenship test?
                  </label>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => {
                      setInputDate(e.target.value);
                      setError("");
                    }}
                    min={todayStr}
                    className="w-full px-4 py-3 rounded-xl border-2 border-cm-slate-200 focus:border-cm-navy focus:outline-none transition-colors text-cm-slate-900 font-medium"
                  />
                  {error && (
                    <p className="text-sm text-cm-red mt-2 font-medium">{error}</p>
                  )}
                </div>

                {/* Encouragement */}
                {getEncouragement() && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 px-4 py-3 bg-cm-gold-light rounded-xl"
                  >
                    <Sparkles className="w-4 h-4 text-cm-gold mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-cm-slate-700">
                      {getEncouragement()}
                    </p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-cm-navy text-white font-heading font-semibold rounded-xl hover:bg-cm-navy-light transition-colors cursor-pointer"
                  >
                    Save Date
                  </button>
                  {testDate && (
                    <button
                      onClick={handleClear}
                      className="px-4 py-3 text-cm-slate-500 font-medium rounded-xl border-2 border-cm-slate-200 hover:border-cm-red/30 hover:text-cm-red transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Haven't booked */}
                <button
                  onClick={() => {
                    clearTestDate();
                    closeModal();
                  }}
                  className="w-full text-center text-sm text-cm-slate-400 hover:text-cm-navy transition-colors cursor-pointer py-1"
                >
                  I haven&apos;t booked my test yet
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
