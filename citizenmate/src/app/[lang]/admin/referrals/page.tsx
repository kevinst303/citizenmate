import { Metadata } from "next";
import { ReferralAdminDashboard } from "@/components/admin/referral-dashboard";

export const metadata: Metadata = {
  title: "Referral Management — CitizenMate Admin",
};

export default function AdminReferralsPage() {
  return <ReferralAdminDashboard />;
}
