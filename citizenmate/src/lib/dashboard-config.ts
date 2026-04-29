import {
  Globe,
  Scale,
  Landmark,
  Heart,
  Hand,
  Sprout,
  Dumbbell,
  Flame,
  Zap,
  Star,
  PartyPopper,
  AlertTriangle,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import type { TopicCategory } from "@/lib/types";

export const TOPIC_ICONS: Record<TopicCategory, typeof Globe> = {
  "australia-people": Globe,
  "democratic-beliefs": Scale,
  "government-law": Landmark,
  "australian-values": Heart,
};

export const TOPIC_COLORS: Record<
  TopicCategory,
  { bg: string; text: string; bar: string; accent: string; hoverBg: string }
> = {
  "australia-people": {
    bg: "bg-cm-sky-light",
    text: "text-cm-sky",
    bar: "bg-cm-sky",
    accent: "#0284C7",
    hoverBg: "rgba(224, 242, 254, 0.5)",
  },
  "democratic-beliefs": {
    bg: "bg-cm-navy-50",
    text: "text-cm-navy",
    bar: "bg-cm-navy",
    accent: "#0C2340",
    hoverBg: "rgba(235, 240, 247, 0.5)",
  },
  "government-law": {
    bg: "bg-cm-gold-light",
    text: "text-cm-gold",
    bar: "bg-cm-gold",
    accent: "#D97706",
    hoverBg: "rgba(254, 243, 199, 0.5)",
  },
  "australian-values": {
    bg: "bg-cm-red-light",
    text: "text-cm-red",
    bar: "bg-cm-red",
    accent: "#DC2626",
    hoverBg: "rgba(254, 226, 226, 0.5)",
  },
};

export const READINESS_ICONS: Record<string, typeof Globe> = {
  hand: Hand,
  seedling: Sprout,
  dumbbell: Dumbbell,
  flame: Flame,
  zap: Zap,
  star: Star,
  "party-popper": PartyPopper,
};

export const STAT_ACCENTS = {
  navy: "#0C2340",
  gold: "#D97706",
  eucalyptus: "#059669",
  sky: "#0284C7",
};

export const INSIGHT_ICONS: Record<string, typeof Hand> = {
  "hand": Hand,
  "alert-triangle": AlertTriangle,
  "party-popper": PartyPopper,
  "trending-up": TrendingUp,
  "book-open": BookOpen,
};
