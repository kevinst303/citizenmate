"use client";

import { LegalLayout } from "@/components/shared/legal-layout";
import { useT } from "@/i18n/i18n-context";

export default function PrivacyPage() {
  const { t } = useT();

  const sections = [
    { id: "overview", title: t("legal.privacy_section_overview", "Overview") },
    { id: "information-we-collect", title: t("legal.privacy_section_info_collect", "Information We Collect") },
    { id: "how-we-use", title: t("legal.privacy_section_how_use", "How We Use Your Data") },
    { id: "ai-features", title: t("legal.privacy_section_ai", "AI Features & Data") },
    { id: "data-storage", title: t("legal.privacy_section_storage", "Data Storage & Security") },
    { id: "third-parties", title: t("legal.privacy_section_third_parties", "Third-Party Services") },
    { id: "your-rights", title: t("legal.privacy_section_rights", "Your Rights") },
    { id: "cookies", title: t("legal.privacy_section_cookies", "Cookies") },
    { id: "children", title: t("legal.privacy_section_children", "Children's Privacy") },
    { id: "changes", title: t("legal.privacy_section_changes", "Changes to This Policy") },
    { id: "contact", title: t("legal.privacy_section_contact", "Contact Us") },
  ];

  return (
    <LegalLayout
      title={t("legal.privacy_title", "Privacy Policy")}
      lastUpdated={t("legal.privacy_last_updated", "24 March 2026")}
      sections={sections}
    >
      <h2 id="overview">{t("legal.privacy_section_overview", "Overview")}</h2>
      <p>
        {t("legal.privacy_overview_p1", 'CitizenMate ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application at citizenmate.com.au (the "Service").')}
      </p>
      <p>
        {t("legal.privacy_overview_p2_prefix", "We comply with the")}{" "}
        <strong>{t("legal.privacy_overview_p2_act", "Australian Privacy Act 1988")}</strong>
        {t("legal.privacy_overview_p2_mid", " (Cth) and the")}{" "}
        <strong>{t("legal.privacy_overview_p2_apps", "Australian Privacy Principles")}</strong>
        {t("legal.privacy_overview_p2_suffix", " (APPs). By using the Service, you agree to the collection and use of information in accordance with this policy.")}
      </p>

      <h2 id="information-we-collect">{t("legal.privacy_section_info_collect", "Information We Collect")}</h2>

      <h3>{t("legal.privacy_info_collect_provided_heading", "Information You Provide")}</h3>
      <ul>
        <li>
          <strong>{t("legal.privacy_info_collect_provided_li1_label", "Account information:")}</strong>{" "}
          {t("legal.privacy_info_collect_provided_li1_desc", "Email address and display name when you create an account via Supabase authentication.")}
        </li>
        <li>
          <strong>{t("legal.privacy_info_collect_provided_li2_label", "Study progress:")}</strong>{" "}
          {t("legal.privacy_info_collect_provided_li2_desc", "Your quiz answers, scores, topic mastery data, and study preferences.")}
        </li>
        <li>
          <strong>{t("legal.privacy_info_collect_provided_li3_label", "Test date:")}</strong>{" "}
          {t("legal.privacy_info_collect_provided_li3_desc", "Your scheduled citizenship test date, if you choose to set one.")}
        </li>
        <li>
          <strong>{t("legal.privacy_info_collect_provided_li4_label", "Chat messages:")}</strong>{" "}
          {t("legal.privacy_info_collect_provided_li4_desc", "Messages you send to the AI Tutor chatbot during your study sessions.")}
        </li>
      </ul>

      <h3>{t("legal.privacy_info_collect_auto_heading", "Information Collected Automatically")}</h3>
      <ul>
        <li>
          <strong>{t("legal.privacy_info_collect_auto_li1_label", "Usage data:")}</strong>{" "}
          {t("legal.privacy_info_collect_auto_li1_desc", "Pages visited, features used, time spent, and interactions with the Service.")}
        </li>
        <li>
          <strong>{t("legal.privacy_info_collect_auto_li2_label", "Device information:")}</strong>{" "}
          {t("legal.privacy_info_collect_auto_li2_desc", "Browser type, operating system, and screen resolution.")}
        </li>
        <li>
          <strong>{t("legal.privacy_info_collect_auto_li3_prefix", "Cookies:")}</strong>{" "}
          <a href="/cookies">{t("legal.privacy_info_collect_auto_li3_link", "Cookie Policy")}</a>
          {t("legal.privacy_info_collect_auto_li3_suffix", " for details.")}
        </li>
      </ul>

      <h2 id="how-we-use">{t("legal.privacy_section_how_use", "How We Use Your Data")}</h2>
      <p>{t("legal.privacy_how_use_p1", "We use the information we collect to:")}</p>
      <ul>
        <li>{t("legal.privacy_how_use_li1", "Provide and maintain the Service")}</li>
        <li>{t("legal.privacy_how_use_li2", "Track your study progress and generate readiness scores")}</li>
        <li>{t("legal.privacy_how_use_li3", "Power the AI Tutor with context about your learning gaps and progress")}</li>
        <li>{t("legal.privacy_how_use_li4", "Personalise your study plan based on your test date")}</li>
        <li>{t("legal.privacy_how_use_li5", "Improve the Service through aggregated, anonymised analytics")}</li>
        <li>{t("legal.privacy_how_use_li6", "Send important service-related communications")}</li>
      </ul>

      <h2 id="ai-features">{t("legal.privacy_section_ai", "AI Features & Data")}</h2>
      <p>
        {t("legal.privacy_ai_p1_prefix", "CitizenMate uses")}{" "}
        <strong>{t("legal.privacy_ai_p1_bold", "Google Gemini AI")}</strong>
        {t("legal.privacy_ai_p1_suffix", " to power the AI Tutor chatbot. When you interact with the AI Tutor:")}
      </p>
      <ul>
        <li>{t("legal.privacy_ai_li1", "Your messages are sent to Google's Gemini API for processing.")}</li>
        <li>
          {t("legal.privacy_ai_li2_prefix", "Google may process this data in accordance with their own privacy policies. We encourage you to review")}{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            {t("legal.privacy_ai_li2_link", "Google's Privacy Policy")}
          </a>.
        </li>
        <li>{t("legal.privacy_ai_li3", "We do not use your chat data to train any AI models. Chat data is used solely to generate real-time responses.")}</li>
        <li>{t("legal.privacy_ai_li4", "AI-generated responses are informational only and should not be considered official government advice.")}</li>
      </ul>

      <h2 id="data-storage">{t("legal.privacy_section_storage", "Data Storage & Security")}</h2>
      <p>
        {t("legal.privacy_storage_p1_prefix", "Your data is stored securely using")}{" "}
        <strong>{t("legal.privacy_storage_p1_bold", "Supabase")}</strong>
        {t("legal.privacy_storage_p1_suffix", ", which provides enterprise-grade security including:")}
      </p>
      <ul>
        <li>{t("legal.privacy_storage_li1", "Encryption at rest and in transit (TLS 1.2+)")}</li>
        <li>{t("legal.privacy_storage_li2", "Row Level Security (RLS) policies on all database tables")}</li>
        <li>{t("legal.privacy_storage_li3", "Regular security audits and compliance certifications")}</li>
      </ul>
      <p>
        {t("legal.privacy_storage_p2", "While we implement commercially reasonable security measures, no method of electronic storage is 100% secure. We cannot guarantee absolute security of your data.")}
      </p>

      <h2 id="third-parties">{t("legal.privacy_section_third_parties", "Third-Party Services")}</h2>
      <p>{t("legal.privacy_third_parties_p1", "We use the following third-party services that may process your data:")}</p>
      <ul>
        <li>
          <strong>{t("legal.privacy_third_parties_li1_label", "Supabase")}</strong>{" — "}
          {t("legal.privacy_third_parties_li1_desc", "Authentication and database storage")}
        </li>
        <li>
          <strong>{t("legal.privacy_third_parties_li2_label", "Stripe")}</strong>{" — "}
          {t("legal.privacy_third_parties_li2_desc_prefix", "Payment processing. When you purchase a Sprint Pass, your payment details are processed directly by Stripe. We do not store your card details. See")}{" "}
          <a href="https://stripe.com/au/privacy" target="_blank" rel="noopener noreferrer">
            {t("legal.privacy_third_parties_li2_link", "Stripe's Privacy Policy")}
          </a>.
        </li>
        <li>
          <strong>{t("legal.privacy_third_parties_li3_label", "Google Gemini AI")}</strong>{" — "}
          {t("legal.privacy_third_parties_li3_desc", "AI Tutor chatbot responses")}
        </li>
        <li>
          <strong>{t("legal.privacy_third_parties_li4_label", "Google Analytics")}</strong>{" — "}
          {t("legal.privacy_third_parties_li4_desc", "Anonymised usage analytics (with your consent)")}
        </li>
        <li>
          <strong>{t("legal.privacy_third_parties_li5_label", "Vercel")}</strong>{" — "}
          {t("legal.privacy_third_parties_li5_desc", "Application hosting and delivery")}
        </li>
      </ul>

      <h3>{t("legal.privacy_breach_heading", "Data Breach Notification")}</h3>
      <p>
        {t("legal.privacy_breach_p1_prefix", "In the event of a data breach that is likely to result in serious harm to affected individuals, we will notify the Office of the Australian Information Commissioner (OAIC) and affected individuals as soon as practicable, in accordance with the")}{" "}
        <strong>{t("legal.privacy_breach_p1_bold", "Notifiable Data Breaches (NDB) scheme")}</strong>
        {t("legal.privacy_breach_p1_suffix", " under the Privacy Act 1988.")}
      </p>

      <h2 id="your-rights">{t("legal.privacy_section_rights", "Your Rights")}</h2>
      <p>{t("legal.privacy_rights_p1", "Under the Australian Privacy Act, you have the right to:")}</p>
      <ul>
        <li>
          <strong>{t("legal.privacy_rights_li1_label", "Access")}</strong>{" "}
          {t("legal.privacy_rights_li1_desc", "your personal information held by us")}
        </li>
        <li>
          <strong>{t("legal.privacy_rights_li2_label", "Correct")}</strong>{" "}
          {t("legal.privacy_rights_li2_desc", "inaccurate or outdated personal information")}
        </li>
        <li>
          <strong>{t("legal.privacy_rights_li3_label", "Delete")}</strong>{" "}
          {t("legal.privacy_rights_li3_desc", "your account and associated data")}
        </li>
        <li>
          <strong>{t("legal.privacy_rights_li4_label", "Withdraw consent")}</strong>{" "}
          {t("legal.privacy_rights_li4_desc", "for data processing at any time")}
        </li>
        <li>
          <strong>{t("legal.privacy_rights_li5_label", "Lodge a complaint")}</strong>{" "}
          {t("legal.privacy_rights_li5_desc", "with the Office of the Australian Information Commissioner (OAIC) if you believe your privacy has been breached")}
        </li>
      </ul>
      <p>
        {t("legal.privacy_rights_p2_prefix", "To exercise any of these rights, please contact us at")}{" "}
        <a href="mailto:privacy@citizenmate.com.au">privacy@citizenmate.com.au</a>.
      </p>

      <h2 id="cookies">{t("legal.privacy_section_cookies", "Cookies")}</h2>
      <p>
        {t("legal.privacy_cookies_p1_prefix", "We use cookies and similar technologies to enhance your experience. For full details, please see our")}{" "}
        <a href="/cookies">{t("legal.privacy_cookies_p1_link", "Cookie Policy")}</a>.
      </p>

      <h2 id="children">{t("legal.privacy_section_children", "Children's Privacy")}</h2>
      <p>
        {t("legal.privacy_children_p1", "The Service is not intended for children under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.")}
      </p>

      <h2 id="changes">{t("legal.privacy_section_changes", "Changes to This Policy")}</h2>
      <p>
        {t("legal.privacy_changes_p1", 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use after changes constitutes acceptance of the revised policy.')}
      </p>

      <h2 id="contact">{t("legal.privacy_section_contact", "Contact Us")}</h2>
      <p>
        {t("legal.privacy_contact_p1", "If you have any questions about this Privacy Policy or our data practices, please contact us at:")}
      </p>
      <ul>
        <li>
          <strong>{t("legal.privacy_contact_li1_label", "Email:")}</strong>{" "}
          <a href="mailto:privacy@citizenmate.com.au">privacy@citizenmate.com.au</a>
        </li>
        <li>
          <strong>{t("legal.privacy_contact_li2_label", "General:")}</strong>{" "}
          <a href="mailto:hello@citizenmate.com.au">hello@citizenmate.com.au</a>
        </li>
      </ul>
    </LegalLayout>
  );
}
