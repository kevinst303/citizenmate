"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const [testDate, setTestDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, refreshPremiumStatus } = useAuth();
  const router = useRouter();

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
        console.error("Failed to save test date:", error);
      } else {
        await refreshPremiumStatus();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-neutral-800 rounded-2xl p-8 border border-neutral-700 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Welcome to CitizenMate!</h1>
          <p className="text-neutral-400">
            Let's get started by setting your goal test date. This helps us tailor your study plan.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              When is your citizenship test?
            </label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => handleSave(testDate)}
              disabled={!testDate || loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6 text-lg"
            >
              {loading ? "Saving..." : "Set Goal Date"}
            </Button>
            
            <button
              onClick={() => handleSave(null)}
              disabled={loading}
              className="w-full text-neutral-400 hover:text-white text-sm py-2 transition-colors"
            >
              I don't know my test date yet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
