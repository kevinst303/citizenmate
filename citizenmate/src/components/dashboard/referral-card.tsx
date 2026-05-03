"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Check,
  Gift,
  Share2,
  MessageCircle,
  Users,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

interface ReferralStats {
  promoCode: string | null;
  totalReferred: number;
  qualifiedReferred: number;
  rewardsClaimed: number;
  maxRewards: number;
}

export function ReferralCard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/referral");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch referral stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user, fetchStats]);

  if (!user) return null;

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${user.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied("link");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleCopyCode = async () => {
    if (!stats?.promoCode) return;
    try {
      await navigator.clipboard.writeText(stats.promoCode);
      setCopied("code");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/referral", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStats((prev) => (prev ? { ...prev, promoCode: data.promoCode } : null));
      }
    } catch (err) {
      console.error("Failed to generate code:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleShareWhatsApp = () => {
    const message = stats?.promoCode
      ? `Hey! I'm using CitizenMate to study for my Australian citizenship test. Use my code ${stats.promoCode} to get 20% off the Sprint Pass! 🇦🇺\n\n${referralLink}`
      : `Hey! I'm using CitizenMate to study for my Australian citizenship test. Check it out: ${referralLink}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleShareGeneric = async () => {
    const shareData = {
      title: "CitizenMate — Ace your Australian Citizenship Test",
      text: stats?.promoCode
        ? `Use my code ${stats.promoCode} to get 20% off the Sprint Pass on CitizenMate! 🇦🇺`
        : "I'm using CitizenMate to study for my Australian citizenship test. Check it out!",
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  // Progress bar percentage
  const progressPercent = stats
    ? Math.min((stats.qualifiedReferred / stats.maxRewards) * 100, 100)
    : 0;

  const progressText = stats
    ? `${stats.qualifiedReferred}/${stats.maxRewards} mates helped`
    : "Loading...";

  return (
    <Card className="relative overflow-hidden border-cm-teal/20 bg-gradient-to-br from-cm-teal/5 to-cm-ocean/5">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cm-teal via-cm-ocean to-cm-gold" />

      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-cm-teal">
          <Gift className="w-5 h-5" />
          Help a Mate
          {stats && stats.qualifiedReferred >= stats.maxRewards && (
            <span className="ml-auto text-xs font-normal bg-cm-gold/20 text-cm-gold-dark px-2 py-0.5 rounded-full">
              Max reached 🎉
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Share your code with a friend. They get{" "}
          <strong className="text-cm-teal">20% off</strong> their Sprint Pass,
          and you get <strong className="text-cm-teal">7 bonus premium days</strong> when they
          qualify!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Progress tracker ── */}
        {stats && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {progressText}
              </span>
              {stats.qualifiedReferred > 0 && (
                <span className="text-cm-teal font-medium">
                  +{stats.qualifiedReferred * 7} days earned
                </span>
              )}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cm-teal to-cm-ocean rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {stats.qualifiedReferred >= 4 && stats.qualifiedReferred < stats.maxRewards && (
              <p className="text-xs text-cm-gold-dark flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Almost there! 1 more mate and you&apos;ve maxed out your rewards!
              </p>
            )}
          </div>
        )}

        {/* ── Promo Code ── */}
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : stats?.promoCode ? (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Your Promo Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background border-2 border-dashed border-cm-teal/30 rounded-lg px-4 py-2.5 text-center">
                <span className="font-mono text-lg font-bold text-cm-teal tracking-widest select-all">
                  {stats.promoCode}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className="shrink-0"
              >
                {copied === "code" ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Friends use this code at checkout for 20% off
            </p>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={handleGenerateCode}
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating code...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Your Promo Code
              </>
            )}
          </Button>
        )}

        {/* ── Referral Link ── */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Referral Link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background border rounded-md px-3 py-2 text-sm text-muted-foreground truncate select-all">
              {referralLink}
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              {copied === "link" ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* ── Share Buttons ── */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 text-sm"
            onClick={handleShareWhatsApp}
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-sm"
            onClick={handleShareGeneric}
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
