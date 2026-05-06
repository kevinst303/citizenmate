"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
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
  MessageCircle,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { usePremium } from "@/lib/auth-context";
import { useT } from "@/i18n/i18n-context";

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
    text: "chat.suggestion_1",
    icon: Heart,
  },
  {
    text: "chat.suggestion_2",
    icon: Landmark,
  },
  {
    text: "chat.suggestion_3",
    icon: BookOpen,
  },
  {
    text: "chat.suggestion_4",
    icon: Scale,
  },
];

// ─── Follow-up Suggestions (shown after AI responds) ────────

const FOLLOW_UP_SUGGESTIONS = [
  { text: "chat.follow_up_tell_more", icon: MessageCircle },
  { text: "chat.follow_up_quiz_me", icon: HelpCircle },
  { text: "chat.follow_up_why_important", icon: Lightbulb },
];

// ─── Thinking stage labels ───────────────────────────────────

const THINKING_STAGES = [
  "chat.thinking_reading",
  "chat.thinking_searching",
  "chat.thinking_composing",
];

// ─── Chat Widget ─────────────────────────────────────────────

export function ChatWidget() {
  const { t } = useT();
  const { isPremium, upgrade } = usePremium();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>(() => ({
    date: getTodayString(),
    count: 0,
  }));
  const [thinkingStage, setThinkingStage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load usage from localStorage on mount
  useEffect(() => {
    setDailyUsage(getDailyUsage());
  }, []);

  const isLimitReached = !isPremium && dailyUsage.count >= MAX_DAILY_QUESTIONS;

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    onFinish: () => {
      const newUsage = incrementUsage();
      setDailyUsage(newUsage);
      if (newUsage.count >= MAX_DAILY_QUESTIONS) {
        toast.warning(
          t("chat.daily_limit_title"),
          t("chat.daily_limit_desc"),
          { timing: { displayDuration: 5000 } }
        );
        setTimeout(() => upgrade(), 1200);
      } else if (newUsage.count === MAX_DAILY_QUESTIONS - 1) {
        toast.info(
          t("chat.last_question_title"),
          t("chat.last_question_desc")
        );
      }
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Cycle through thinking stages while streaming
  useEffect(() => {
    if (!isStreaming) {
      setThinkingStage(0);
      return;
    }
    const interval = setInterval(() => {
      setThinkingStage((s) => (s + 1) % THINKING_STAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Check if last message is from assistant (for follow-up chips)
  const lastMessageIsAssistant =
    messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && !isStreaming;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isLimitReached) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isLimitReached]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming || isLimitReached) return;

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
            aria-label={t("chat.open_tutor")}
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
                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-sm">
                  <Image
                    src="/generated/avatar-tutor.webp"
                    alt="AI Tutor Avatar"
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div>
                  <h3 className="text-white font-heading font-bold text-sm">
                    {t("chat.tutor_name")}
                  </h3>
                  <p className="text-white/60 text-xs">
                    {t("chat.tutor_subtitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label={t("chat.close_chat")}
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
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm ring-1 ring-cm-slate-200">
                      <Image
                        src="/generated/avatar-tutor.webp"
                        alt="AI Tutor"
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="bg-cm-slate-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                      <p className="text-sm text-cm-slate-700 leading-relaxed">
                        {t("chat.greeting")}
                      </p>
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="pl-10 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.text}
                        onClick={() => handleSend(t(s.text))}
                        disabled={isLimitReached}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-cm-slate-200 text-xs text-cm-slate-600 font-medium hover:bg-cm-slate-50 hover:border-cm-slate-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <s.icon className="w-3 h-3" />
                        {t(s.text)}
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
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm ring-1 ring-cm-slate-200">
                      <Image
                        src="/generated/avatar-tutor.webp"
                        alt="AI Tutor"
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                        message.role === "user"
                          ? "bg-cm-navy text-white rounded-tr-sm"
                          : "bg-cm-slate-50 text-cm-slate-700 rounded-tl-sm"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.parts && message.parts.length > 0
                          ? message.parts
                              .filter((part): part is { type: "text"; text: string } => part.type === "text")
                              .map((part, i) => <span key={i}>{part.text}</span>)
                          : (message as any).content}
                      </div>
                    </div>
                    {/* Source label for AI messages — trust building */}
                    {message.role === "assistant" && (
                      <div className="source-label mt-1.5 ml-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-cm-slate-300" />
                        <span className="text-[10px] text-cm-slate-400">
                          {t("chat.source_label")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Multi-stage thinking indicator — Action Transparency */}
              {isStreaming && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm ring-1 ring-cm-slate-200">
                    <Image
                      src="/generated/avatar-tutor.webp"
                      alt="AI Tutor Thinking"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <div className="bg-cm-slate-50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-cm-slate-400">
                        <span className="ai-typing-dot" />
                        <span className="ai-typing-dot" />
                        <span className="ai-typing-dot" />
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={thinkingStage}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.25 }}
                          className="text-xs text-cm-slate-400 font-medium"
                        >
                          {t(THINKING_STAGES[thinkingStage])}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Follow-up suggestion chips after AI responds */}
              {lastMessageIsAssistant && !isLimitReached && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="pl-10 flex flex-wrap gap-2"
                >
                  {FOLLOW_UP_SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s.text}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      onClick={() => handleSend(t(s.text))}
                      className="follow-up-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cm-navy-50 border border-cm-navy-100 text-xs text-cm-navy font-medium hover:bg-cm-navy-100 cursor-pointer"
                    >
                      <s.icon className="w-3 h-3" />
                      {t(s.text)}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Rate limit banner */}
            {isLimitReached && (
              <div className="mx-4 mb-2 px-3 py-3 bg-cm-gold-light/40 border border-cm-gold rounded-xl flex flex-col items-center text-center gap-2">
                <div>
                  <p className="text-sm text-cm-navy font-bold">
                    {t("chat.daily_limit_banner")}
                  </p>
                  <p className="text-xs text-cm-slate-600 mt-0.5 max-w-[250px] mx-auto">
                    {t("chat.daily_limit_banner_desc")}
                  </p>
                </div>
                <button
                  onClick={upgrade}
                  className="w-full mt-1 bg-cm-red hover:bg-cm-red-dark text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("chat.unlock_unlimited")}
                </button>
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
                    ? t("chat.placeholder_limit")
                    : t("chat.placeholder_default")
                }
                disabled={isLimitReached || isStreaming}
                className="flex-1 bg-cm-slate-50 rounded-xl px-4 py-2.5 text-sm text-cm-slate-800 placeholder:text-cm-slate-400 border border-cm-slate-200 focus:outline-none focus:border-cm-navy focus:ring-1 focus:ring-cm-navy/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isStreaming || isLimitReached}
                className="w-10 h-10 rounded-xl bg-cm-navy text-white flex items-center justify-center shrink-0 hover:bg-cm-navy-light transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={t("chat.send_message")}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Usage counter */}
            {!isPremium && !isLimitReached && dailyUsage.count > 0 && (
              <div className="px-4 pb-2">
                <p className="text-[11px] text-cm-slate-400 text-center">
                  {remaining} {remaining === 1 ? t("chat.questions_remaining_singular") : t("chat.questions_remaining")}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
