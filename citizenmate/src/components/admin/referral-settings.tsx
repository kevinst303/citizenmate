"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import type { ReferralConfig } from "./referral-dashboard";

// ===== Settings Tab =====
// Admin UI to configure the referral program parameters.

interface Props {
  config: ReferralConfig;
  onSave: () => void;
}

export function ReferralSettings({ config, onSave }: Props) {
  const [form, setForm] = useState<ReferralConfig>({ ...config });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = JSON.stringify(form) !== JSON.stringify(config);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/referrals/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSaved(true);
      onSave();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Program Status */}
      <SettingsCard title="Program Status" icon="🟢">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cm-slate-800">
              Referral Program Active
            </p>
            <p className="text-xs text-cm-slate-500 mt-0.5">
              When disabled, users cannot generate new promo codes or earn rewards.
            </p>
          </div>
          <ToggleSwitch
            checked={form.program_active}
            onChange={(v) => setForm({ ...form, program_active: v })}
          />
        </div>
      </SettingsCard>

      {/* Reward Configuration */}
      <SettingsCard title="Reward Configuration" icon="🎁">
        <div className="space-y-5">
          <NumberInput
            label="Friend Discount"
            suffix="%"
            value={form.discount_percent}
            min={1}
            max={100}
            onChange={(v) => setForm({ ...form, discount_percent: v })}
            description="Percentage discount applied to the friend's Sprint Pass purchase via promo code."
          />
          <NumberInput
            label="Referrer Reward"
            suffix="days"
            value={form.reward_days}
            min={1}
            max={90}
            onChange={(v) => setForm({ ...form, reward_days: v })}
            description="Premium days added to the referrer's account when their friend qualifies."
          />
          <NumberInput
            label="Max Referrals Per User"
            suffix="mates"
            value={form.max_referrals_per_user}
            min={1}
            max={50}
            onChange={(v) =>
              setForm({ ...form, max_referrals_per_user: v })
            }
            description="Maximum number of qualified referrals a single user can earn rewards from."
          />
        </div>
      </SettingsCard>

      {/* Qualification Rules */}
      <SettingsCard title="Qualification Rules" icon="✅">
        <div className="space-y-4">
          <div className="bg-cm-sky/5 border border-cm-sky/20 rounded-xl p-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cm-sky mt-0.5 shrink-0" />
            <p className="text-xs text-cm-slate-600 leading-relaxed">
              A referee must meet <strong>at least one</strong> of the enabled
              conditions below to qualify. This prevents reward gaming.
            </p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-cm-slate-800">
                Complete a Quiz
              </p>
              <p className="text-xs text-cm-slate-500 mt-0.5">
                Friend must complete at least one diagnostic quiz.
              </p>
            </div>
            <ToggleSwitch
              checked={form.require_quiz_completion}
              onChange={(v) =>
                setForm({ ...form, require_quiz_completion: v })
              }
            />
          </div>

          <div className="border-t border-[#E9ECEF]" />

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-cm-slate-800">
                Purchase Sprint Pass
              </p>
              <p className="text-xs text-cm-slate-500 mt-0.5">
                Friend must purchase the Sprint Pass (paid conversion).
              </p>
            </div>
            <ToggleSwitch
              checked={form.require_purchase}
              onChange={(v) => setForm({ ...form, require_purchase: v })}
            />
          </div>

          {!form.require_quiz_completion && !form.require_purchase && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Warning:</strong> No qualification rules are enabled.
                Rewards will be granted immediately upon referral signup, which
                may be vulnerable to gaming.
              </p>
            </div>
          )}
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-cm-navy rounded-xl hover:bg-cm-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>

        {hasChanges && !saving && !saved && (
          <span className="text-xs text-amber-600 font-medium">
            Unsaved changes
          </span>
        )}

        {error && (
          <span className="text-xs text-red-600 font-medium">{error}</span>
        )}
      </div>

      {/* Info Footer */}
      <div className="bg-cm-slate-50 rounded-xl p-4 mt-4">
        <p className="text-xs text-cm-slate-500 leading-relaxed">
          <strong>Note:</strong> Changing the discount percentage here updates the database config.
          To update the actual Stripe coupon, you&apos;ll need to create a new coupon in the{" "}
          <a
            href="https://dashboard.stripe.com/coupons"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cm-sky underline hover:no-underline"
          >
            Stripe Dashboard
          </a>{" "}
          and update the <code className="text-xs bg-white px-1 py-0.5 rounded">STRIPE_REFERRAL_COUPON_ID</code> environment variable.
        </p>
      </div>
    </div>
  );
}

// ===== Settings Card =====
function SettingsCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden"
      style={{ boxShadow: "rgba(0,0,0,0.02) 0px 4px 12px" }}
    >
      <div className="px-6 py-4 border-b border-[#E9ECEF] bg-cm-slate-50/50">
        <h3 className="text-sm font-bold text-cm-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ===== Number Input =====
function NumberInput({
  label,
  suffix,
  value,
  min,
  max,
  onChange,
  description,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  description: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-cm-slate-800">{label}</label>
      <p className="text-xs text-cm-slate-500 mt-0.5 mb-2">{description}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(parseInt(e.target.value) || min)}
          className="w-24 px-3 py-2 text-sm border border-[#E9ECEF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cm-sky/20 focus:border-cm-sky transition-colors text-center font-medium"
        />
        <span className="text-sm text-cm-slate-500">{suffix}</span>
      </div>
    </div>
  );
}

// ===== Toggle Switch =====
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-cm-teal" : "bg-cm-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
