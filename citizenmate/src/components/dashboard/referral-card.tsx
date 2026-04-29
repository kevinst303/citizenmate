"use client";

import { useState } from "react";
import { Copy, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export function ReferralCard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${user.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Gift className="w-5 h-5" />
          Help a Mate
        </CardTitle>
        <CardDescription>
          Share this link with a friend. When they sign up, you both get 7 days of Premium for free!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-background border rounded-md px-3 py-2 text-sm text-muted-foreground truncate select-all">
            {referralLink}
          </div>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
