import { Metadata } from "next";
import { ReferralAdminDashboard } from "@/components/admin/referral-dashboard";

export const metadata: Metadata = {
  metadataBase: new URL("https://citizenmate.com.au"),
  title: "Referral Management — CitizenMate Admin",
};

export default function AdminReferralsPage() {
  return <ReferralAdminDashboard />;
}
