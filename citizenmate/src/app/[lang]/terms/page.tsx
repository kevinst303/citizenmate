"use client";

import { LegalLayout } from "@/components/shared/legal-layout";
import { useT } from "@/i18n/i18n-context";
import { useLocalizedPath } from "@/lib/use-localized-path";

export default function TermsPage() {
  const { t } = useT();
  const { getUrl } = useLocalizedPath();

  const sections = [
    { id: "acceptance", title: t("legal.terms_section_acceptance", "Acceptance of Terms") },
    { id: "description", title: t("legal.terms_section_description", "Service Description") },
    { id: "disclaimer", title: t("legal.terms_section_disclaimer", "Official Disclaimer") },
    { id: "accounts", title: t("legal.terms_section_accounts", "User Accounts") },
    { id: "acceptable-use", title: t("legal.terms_section_acceptable_use", "Acceptable Use") },
    { id: "intellectual-property", title: t("legal.terms_section_intellectual_property", "Intellectual Property") },
    { id: "payments", title: t("legal.terms_section_payments", "Payments & Refunds") },
    { id: "ai-tutor", title: t("legal.terms_section_ai_tutor", "AI Tutor Disclaimer") },
    { id: "limitation", title: t("legal.terms_section_limitation", "Limitation of Liability") },
    { id: "termination", title: t("legal.terms_section_termination", "Termination") },
    { id: "governing-law", title: t("legal.terms_section_governing_law", "Governing Law") },
    { id: "changes", title: t("legal.terms_section_changes", "Changes to Terms") },
    { id: "contact", title: t("legal.terms_section_contact", "Contact Us") },
  ];

  return (
    <LegalLayout
      title={t("legal.terms_title", "Terms of Service")}
      lastUpdated={t("legal.terms_last_updated", "24 March 2026")}
      sections={sections}
    >
      <h2 id="acceptance">{t("legal.terms_section_acceptance", "Acceptance of Terms")}</h2>
      <p>
        {t("legal.terms_acceptance_p1", 'By accessing or using CitizenMate ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Service.')}
      </p>
      <p>
        {t("legal.terms_acceptance_p2", 'These Terms constitute a legally binding agreement between you and CitizenMate ("we", "us", or "our").')}
      </p>

      <h2 id="description">{t("legal.terms_section_description", "Service Description")}</h2>
      <p>
        {t("legal.terms_description_p1", "CitizenMate is an online study platform designed to help users prepare for the Australian Citizenship Test. The Service includes:")}
      </p>
      <ul>
        <li>{t("legal.terms_description_li1", "Practice tests based on the official test format")}</li>
        <li>{t("legal.terms_description_li2", 'Study materials covering topics from the "Our Common Bond" resource booklet')}</li>
        <li>{t("legal.terms_description_li3", "AI-powered tutoring via the AI Tutor chatbot")}</li>
        <li>{t("legal.terms_description_li4", "Progress tracking and readiness scoring")}</li>
        <li>{t("legal.terms_description_li5", "Bilingual study mode")}</li>
        <li>{t("legal.terms_description_li6", "Spaced repetition learning system")}</li>
      </ul>

      <h2 id="disclaimer">{t("legal.terms_section_disclaimer", "Official Disclaimer")}</h2>
      <p>
        <strong>
          {t("legal.terms_disclaimer_p1_bold", "CitizenMate is an independent study tool. It is NOT affiliated with, endorsed by, or connected to the Australian Government, the Department of Home Affairs, or any government agency.")}
        </strong>
      </p>
      <p>
        {t("legal.terms_disclaimer_p2_prefix", "Our practice questions are inspired by the types of questions in the official test but are")}{" "}
        <strong>{t("legal.terms_disclaimer_p2_not", "not")}</strong>{" "}
        {t("legal.terms_disclaimer_p2_suffix", 'official test questions. The content is based on publicly available materials, primarily the "Our Common Bond" booklet published by the Department of Home Affairs.')}
      </p>
      <p>
        <strong>
          {t("legal.terms_disclaimer_p3_bold", "Using CitizenMate does not guarantee that you will pass the Australian Citizenship Test.")}
        </strong>{" "}
        {t("legal.terms_disclaimer_p3_suffix", "Test outcomes depend on many factors, including the specific questions presented in the official examination.")}
      </p>

      <h2 id="accounts">{t("legal.terms_section_accounts", "User Accounts")}</h2>
      <ul>
        <li>{t("legal.terms_accounts_li1", "You must provide accurate and complete information when creating an account.")}</li>
        <li>{t("legal.terms_accounts_li2", "You are responsible for maintaining the confidentiality of your account credentials.")}</li>
        <li>{t("legal.terms_accounts_li3", "You are responsible for all activities that occur under your account.")}</li>
        <li>{t("legal.terms_accounts_li4", "You must notify us immediately of any unauthorised use of your account.")}</li>
      </ul>

      <h2 id="acceptable-use">{t("legal.terms_section_acceptable_use", "Acceptable Use")}</h2>
      <p>{t("legal.terms_acceptable_use_p1", "You agree NOT to:")}</p>
      <ul>
        <li>{t("legal.terms_acceptable_use_li1", "Use the Service for any unlawful purpose")}</li>
        <li>{t("legal.terms_acceptable_use_li2", "Attempt to reverse-engineer, decompile, or extract source code from the Service")}</li>
        <li>{t("legal.terms_acceptable_use_li3", "Use automated scripts, bots, or scrapers to access the Service")}</li>
        <li>{t("legal.terms_acceptable_use_li4", "Abuse the AI Tutor by sending excessive, spam, or harmful requests")}</li>
        <li>{t("legal.terms_acceptable_use_li5", "Share your account credentials with others")}</li>
        <li>{t("legal.terms_acceptable_use_li6", "Reproduce, distribute, or resell any content from the Service without permission")}</li>
        <li>{t("legal.terms_acceptable_use_li7", "Interfere with or disrupt the Service or servers connected to the Service")}</li>
      </ul>

      <h2 id="intellectual-property">{t("legal.terms_section_intellectual_property", "Intellectual Property")}</h2>
      <p>
        {t("legal.terms_ip_p1", "All content, features, and functionality of the Service \u2014 including but not limited to text, graphics, logos, icons, images, software, and the overall design \u2014 are owned by CitizenMate and protected by Australian and international intellectual property laws.")}
      </p>
      <p>
        {t("legal.terms_ip_p2", 'Content sourced from the "Our Common Bond" booklet is attributed to the Australian Government Department of Home Affairs and is used for educational purposes under fair dealing provisions.')}
      </p>

      <h2 id="payments">{t("legal.terms_section_payments", "Payments & Refunds")}</h2>
      <h3>{t("legal.terms_payments_plans_heading", "Paid Plans")}</h3>
      <p>
        {t("legal.terms_payments_plans_p1", 'CitizenMate offers both free and paid tiers. Paid plans ("Exam Sprint Pass") provide access to premium features for a fixed duration.')}
      </p>
      <h3>{t("legal.terms_payments_billing_heading", "Billing")}</h3>
      <ul>
        <li>{t("legal.terms_payments_billing_li1", "All prices are listed in Australian Dollars (AUD) and include GST.")}</li>
        <li>{t("legal.terms_payments_billing_li2", "Payment is processed securely through our payment provider.")}</li>
        <li>{t("legal.terms_payments_billing_li3", "Subscription plans renew automatically unless cancelled before the renewal date.")}</li>
      </ul>
      <h3>{t("legal.terms_payments_refund_heading", "Refund Policy")}</h3>
      <ul>
        <li>
          {t("legal.terms_payments_refund_li1", "You may request a full refund within")}{" "}
          <strong>{t("legal.terms_payments_refund_li1_days", "7 days")}</strong>{" "}
          {t("legal.terms_payments_refund_li1_suffix", "of purchase if you have not completed more than 2 practice tests during that period.")}
        </li>
        <li>
          {t("legal.terms_payments_refund_li2", "Refund requests can be made by emailing")}{" "}
          <a href="mailto:support@citizenmate.com.au">support@citizenmate.com.au</a>.
        </li>
        <li>
          {t("legal.terms_payments_refund_li3", "Refunds are processed within 5\u201310 business days to your original payment method.")}
        </li>
      </ul>

      <h2 id="ai-tutor">{t("legal.terms_section_ai_tutor", "AI Tutor Disclaimer")}</h2>
      <p>
        {t("legal.terms_ai_tutor_p1", "The AI Tutor is powered by Google Gemini and provides")}{" "}
        <strong>{t("legal.terms_ai_tutor_p1_bold", "informational responses only")}</strong>
        {t("legal.terms_ai_tutor_p1_suffix", ". You should be aware that:")}
      </p>
      <ul>
        <li>{t("legal.terms_ai_tutor_li1", "AI responses may occasionally contain inaccuracies or outdated information.")}</li>
        <li>{t("legal.terms_ai_tutor_li2", 'The AI Tutor is not a substitute for reading the official "Our Common Bond" booklet.')}</li>
        <li>{t("legal.terms_ai_tutor_li3", "We do not guarantee the accuracy, completeness, or reliability of any AI-generated content.")}</li>
        <li>{t("legal.terms_ai_tutor_li4", "Use of the AI Tutor is subject to rate limits to ensure fair access for all users.")}</li>
      </ul>

      <h2 id="limitation">{t("legal.terms_section_limitation", "Limitation of Liability")}</h2>
      <p>
        {t("legal.terms_limitation_p1", "To the maximum extent permitted by Australian law, CitizenMate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:")}
      </p>
      <ul>
        <li>{t("legal.terms_limitation_li1", "Loss of data or profits")}</li>
        <li>{t("legal.terms_limitation_li2", "Failure to pass the citizenship test")}</li>
        <li>{t("legal.terms_limitation_li3", "Interruption of service")}</li>
        <li>{t("legal.terms_limitation_li4", "Errors or inaccuracies in content or AI responses")}</li>
      </ul>
      <p>
        {t("legal.terms_limitation_p2", "Our total liability for any claim arising from or related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim.")}
      </p>

      <h2 id="termination">{t("legal.terms_section_termination", "Termination")}</h2>
      <p>
        {t("legal.terms_termination_p1", "We may suspend or terminate your access to the Service at any time, without prior notice, for conduct that we determine violates these Terms or is harmful to other users or the Service.")}
      </p>
      <p>
        {t("legal.terms_termination_p2_prefix", "You may delete your account at any time through your account settings. Upon deletion, your personal data will be removed in accordance with our")}{" "}
        <a href={getUrl("/privacy")}>{t("legal.terms_termination_p2_link", "Privacy Policy")}</a>
        {t("legal.terms_termination_p2_suffix", ".")}
      </p>

      <h2 id="governing-law">{t("legal.terms_section_governing_law", "Governing Law")}</h2>
      <p>
        {t("legal.terms_governing_law_p1_prefix", "These Terms are governed by and construed in accordance with the laws of the")}{" "}
        <strong>{t("legal.terms_governing_law_p1_bold", "State of New South Wales, Australia")}</strong>
        {t("legal.terms_governing_law_p1_suffix", ". Any disputes shall be subject to the exclusive jurisdiction of the courts of New South Wales.")}
      </p>

      <h2 id="changes">{t("legal.terms_section_changes", "Changes to Terms")}</h2>
      <p>
        {t("legal.terms_changes_p1", "We reserve the right to modify these Terms at any time. Material changes will be communicated via email or a prominent notice on the Service. Your continued use after changes constitutes acceptance.")}
      </p>

      <h2 id="contact">{t("legal.terms_section_contact", "Contact Us")}</h2>
      <p>
        {t("legal.terms_contact_p1", "For questions about these Terms, please contact us at:")}
      </p>
      <ul>
        <li>
          <strong>{t("legal.terms_contact_li1_label", "Email:")}</strong>{" "}
          <a href="mailto:legal@citizenmate.com.au">legal@citizenmate.com.au</a>
        </li>
        <li>
          <strong>{t("legal.terms_contact_li2_label", "General:")}</strong>{" "}
          <a href="mailto:hello@citizenmate.com.au">hello@citizenmate.com.au</a>
        </li>
      </ul>
    </LegalLayout>
  );
}
