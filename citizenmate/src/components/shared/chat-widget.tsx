"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  X,
  Send,
  Sparkles,
  BookOpen,
  Scale,
  Landmark,
  Heart,
  Loader2,
} from "lucide-react";

// ─── Rate Limiting ───────────────────────────────────────────

const RATE_KEY = "citizenmate-chat-usage";
const MAX_DAILY_QUESTIONS = 3;

interface DailyUsage {
  date: string;
  count: number;
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDailyUsage(): DailyUsage {
  if (typeof window === "undefined") return { date: getTodayString(), count: 0 };
  const raw = localStorage.getItem(RATE_KEY);
  if (!raw) return { date: getTodayString(), count: 0 };
  const parsed: DailyUsage = JSON.parse(raw);
  if (parsed.date !== getTodayString()) {
    return { date: getTodayString(), count: 0 };
  }
  return parsed;
}

function incrementUsage(): DailyUsage {
  const usage = getDailyUsage();
  usage.count += 1;
  localStorage.setItem(RATE_KEY, JSON.stringify(usage));
  return usage;
}

// ─── Suggestion Chips ────────────────────────────────────────

const SUGGESTIONS = [
  {
    text: "What are Australian values?",
    icon: Heart,
  },
  {
    text: "Explain the three levels of government",
    icon: Landmark,
  },
  {
    text: "Tell me about Indigenous heritage",
    icon: BookOpen,
  },
  {
    text: "What freedoms do Australians have?",
    icon: Scale,
  },
];

// ─── Chat Widget ─────────────────────────────────────────────

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>(() => ({
    date: getTodayString(),
    count: 0,
  }));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load usage from localStorage on mount
  useEffect(() => {
    setDailyUsage(getDailyUsage());
  }, []);

  const isLimitReached = dailyUsage.count >= MAX_DAILY_QUESTIONS;

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat();

  const isStreaming = status === "streaming" || status === "submitted";

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming || isLimitReached) return;

      const newUsage = incrementUsage();
      setDailyUsage(newUsage);
      setInputValue("");
      sendMessage({ text: trimmed });
    },
    [isStreaming, isLimitReached, sendMessage]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSend(inputValue);
    },
    [inputValue, handleSend]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setMessages([]);
    setInputValue("");
  }, [setMessages]);

  const remaining = MAX_DAILY_QUESTIONS - dailyUsage.count;

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cm-navy text-white shadow-xl flex items-center justify-center cursor-pointer hover:bg-cm-navy-light transition-colors"
            aria-label="Open study tutor"
          >
            <GraduationCap className="w-6 h-6" />
            {/* Online dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-cm-eucalyptus border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 z-50 w-[min(400px,calc(100vw-2rem))] h-[min(600px,calc(100vh-6rem))] bg-white rounded-2xl shadow-2xl border border-cm-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cm-navy via-cm-navy-light to-cm-navy-lighter px-4 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-heading font-bold text-sm">
                    CitizenMate Tutor
                  </h3>
                  <p className="text-white/60 text-xs">
                    Your study buddy
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Welcome message */}
              {messages.length === 0 && !isStreaming && (
                <div className="space-y-4">
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-cm-navy-50 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-cm-navy" />
                    </div>
                    <div className="bg-cm-slate-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                      <p className="text-sm text-cm-slate-700 leading-relaxed">
                        G&apos;day! 🇦🇺 I&apos;m your CitizenMate Tutor. Ask me
                        anything about the Australian citizenship test — values,
                        history, government, you name it!
                      </p>
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="pl-10 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.text}
                        onClick={() => handleSend(s.text)}
                        disabled={isLimitReached}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-cm-slate-200 text-xs text-cm-slate-600 font-medium hover:bg-cm-slate-50 hover:border-cm-slate-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <s.icon className="w-3 h-3" />
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-cm-navy-50 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-cm-navy" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                      message.role === "user"
                        ? "bg-cm-navy text-white rounded-tr-sm"
                        : "bg-cm-slate-50 text-cm-slate-700 rounded-tl-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.parts
                        ?.filter((part): part is { type: "text"; text: string } => part.type === "text")
                        .map((part, i) => (
                          <span key={i}>{part.text}</span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isStreaming && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-cm-navy-50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-cm-navy" />
                  </div>
                  <div className="bg-cm-slate-50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 text-cm-slate-400 animate-spin" />
                      <span className="text-xs text-cm-slate-400">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Rate limit banner */}
            {isLimitReached && (
              <div className="mx-4 mb-2 px-3 py-2 bg-cm-gold-light rounded-xl text-center">
                <p className="text-xs text-cm-gold font-semibold">
                  Daily limit reached (3/3 questions)
                </p>
                <p className="text-xs text-cm-slate-500 mt-0.5">
                  Come back tomorrow, or explore the study guide!
                </p>
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-cm-slate-100 px-4 py-3 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isLimitReached
                    ? "Daily limit reached..."
                    : "Ask about the citizenship test..."
                }
                disabled={isLimitReached || isStreaming}
                className="flex-1 bg-cm-slate-50 rounded-xl px-4 py-2.5 text-sm text-cm-slate-800 placeholder:text-cm-slate-400 border border-cm-slate-200 focus:outline-none focus:border-cm-navy focus:ring-1 focus:ring-cm-navy/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isStreaming || isLimitReached}
                className="w-10 h-10 rounded-xl bg-cm-navy text-white flex items-center justify-center shrink-0 hover:bg-cm-navy-light transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Usage counter */}
            {!isLimitReached && dailyUsage.count > 0 && (
              <div className="px-4 pb-2">
                <p className="text-[11px] text-cm-slate-400 text-center">
                  {remaining} question{remaining !== 1 ? "s" : ""} remaining
                  today
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
