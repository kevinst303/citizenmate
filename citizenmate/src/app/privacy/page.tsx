import { Metadata } from "next";
import { LegalLayout } from "@/components/shared/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How CitizenMate collects, uses, and protects your personal information in compliance with the Australian Privacy Act.",
};

const sections = [
  { id: "overview", title: "Overview" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Your Data" },
  { id: "ai-features", title: "AI Features & Data" },
  { id: "data-storage", title: "Data Storage & Security" },
  { id: "third-parties", title: "Third-Party Services" },
  { id: "your-rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="24 March 2026"
      sections={sections}
    >
      <h2 id="overview">Overview</h2>
      <p>
        CitizenMate (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
        committed to protecting your personal information. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information
        when you use our web application at citizenmate.com.au (the
        &quot;Service&quot;).
      </p>
      <p>
        We comply with the <strong>Australian Privacy Act 1988</strong> (Cth)
        and the <strong>Australian Privacy Principles</strong> (APPs). By using
        the Service, you agree to the collection and use of information in
        accordance with this policy.
      </p>

      <h2 id="information-we-collect">Information We Collect</h2>

      <h3>Information You Provide</h3>
      <ul>
        <li>
          <strong>Account information:</strong> Email address and display name
          when you create an account via Supabase authentication.
        </li>
        <li>
          <strong>Study progress:</strong> Your quiz answers, scores, topic
          mastery data, and study preferences.
        </li>
        <li>
          <strong>Test date:</strong> Your scheduled citizenship test date, if
          you choose to set one.
        </li>
        <li>
          <strong>Chat messages:</strong> Messages you send to the AI Tutor
          chatbot during your study sessions.
        </li>
      </ul>

      <h3>Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Usage data:</strong> Pages visited, features used, time spent,
          and interactions with the Service.
        </li>
        <li>
          <strong>Device information:</strong> Browser type, operating system,
          and screen resolution.
        </li>
        <li>
          <strong>Cookies:</strong> See our{" "}
          <a href="/cookies">Cookie Policy</a> for details.
        </li>
      </ul>

      <h2 id="how-we-use">How We Use Your Data</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain the Service</li>
        <li>Track your study progress and generate readiness scores</li>
        <li>
          Power the AI Tutor with context about your learning gaps and progress
        </li>
        <li>Personalise your study plan based on your test date</li>
        <li>Improve the Service through aggregated, anonymised analytics</li>
        <li>Send important service-related communications</li>
      </ul>

      <h2 id="ai-features">AI Features &amp; Data</h2>
      <p>
        CitizenMate uses <strong>Google Gemini AI</strong> to power the AI Tutor
        chatbot. When you interact with the AI Tutor:
      </p>
      <ul>
        <li>
          Your messages are sent to Google&apos;s Gemini API for processing.
        </li>
        <li>
          Google may process this data in accordance with their own privacy
          policies. We encourage you to review{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </li>
        <li>
          We do not use your chat data to train any AI models. Chat data is used
          solely to generate real-time responses.
        </li>
        <li>
          AI-generated responses are informational only and should not be
          considered official government advice.
        </li>
      </ul>

      <h2 id="data-storage">Data Storage &amp; Security</h2>
      <p>
        Your data is stored securely using <strong>Supabase</strong>, which
        provides enterprise-grade security including:
      </p>
      <ul>
        <li>Encryption at rest and in transit (TLS 1.2+)</li>
        <li>Row Level Security (RLS) policies on all database tables</li>
        <li>Regular security audits and compliance certifications</li>
      </ul>
      <p>
        While we implement commercially reasonable security measures, no method
        of electronic storage is 100% secure. We cannot guarantee absolute
        security of your data.
      </p>

      <h2 id="third-parties">Third-Party Services</h2>
      <p>We use the following third-party services that may process your data:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — Authentication and database storage
        </li>
        <li>
          <strong>Google Gemini AI</strong> — AI Tutor chatbot responses
        </li>
        <li>
          <strong>Google Analytics</strong> — Anonymised usage analytics (with
          your consent)
        </li>
        <li>
          <strong>Vercel</strong> — Application hosting and delivery
        </li>
      </ul>

      <h2 id="your-rights">Your Rights</h2>
      <p>Under the Australian Privacy Act, you have the right to:</p>
      <ul>
        <li>
          <strong>Access</strong> your personal information held by us
        </li>
        <li>
          <strong>Correct</strong> inaccurate or outdated personal information
        </li>
        <li>
          <strong>Delete</strong> your account and associated data
        </li>
        <li>
          <strong>Withdraw consent</strong> for data processing at any time
        </li>
        <li>
          <strong>Lodge a complaint</strong> with the Office of the Australian
          Information Commissioner (OAIC) if you believe your privacy has been
          breached
        </li>
      </ul>
      <p>
        To exercise any of these rights, please contact us at{" "}
        <a href="mailto:privacy@citizenmate.com.au">privacy@citizenmate.com.au</a>.
      </p>

      <h2 id="cookies">Cookies</h2>
      <p>
        We use cookies and similar technologies to enhance your experience. For
        full details, please see our <a href="/cookies">Cookie Policy</a>.
      </p>

      <h2 id="children">Children&apos;s Privacy</h2>
      <p>
        The Service is not intended for children under the age of 16. We do not
        knowingly collect personal information from children. If you believe a
        child has provided us with personal data, please contact us immediately.
      </p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any material changes by posting the new policy on this page and
        updating the &quot;Last updated&quot; date. Your continued use after
        changes constitutes acceptance of the revised policy.
      </p>

      <h2 id="contact">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or our data
        practices, please contact us at:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:privacy@citizenmate.com.au">privacy@citizenmate.com.au</a>
        </li>
        <li>
          <strong>General:</strong>{" "}
          <a href="mailto:hello@citizenmate.com.au">hello@citizenmate.com.au</a>
        </li>
      </ul>
    </LegalLayout>
  );
}
