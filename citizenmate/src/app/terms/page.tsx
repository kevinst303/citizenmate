import { Metadata } from "next";
import { LegalLayout } from "@/components/shared/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using CitizenMate, the Australian citizenship test preparation platform.",
};

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "description", title: "Service Description" },
  { id: "disclaimer", title: "Official Disclaimer" },
  { id: "accounts", title: "User Accounts" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "payments", title: "Payments & Refunds" },
  { id: "ai-tutor", title: "AI Tutor Disclaimer" },
  { id: "limitation", title: "Limitation of Liability" },
  { id: "termination", title: "Termination" },
  { id: "governing-law", title: "Governing Law" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Us" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="24 March 2026"
      sections={sections}
    >
      <h2 id="acceptance">Acceptance of Terms</h2>
      <p>
        By accessing or using CitizenMate (&quot;the Service&quot;), you agree
        to be bound by these Terms of Service (&quot;Terms&quot;). If you do not
        agree to these Terms, you must not use the Service.
      </p>
      <p>
        These Terms constitute a legally binding agreement between you and
        CitizenMate (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
      </p>

      <h2 id="description">Service Description</h2>
      <p>
        CitizenMate is an online study platform designed to help users prepare
        for the Australian Citizenship Test. The Service includes:
      </p>
      <ul>
        <li>Practice tests based on the official test format</li>
        <li>
          Study materials covering topics from the &quot;Our Common Bond&quot;
          resource booklet
        </li>
        <li>AI-powered tutoring via the AI Tutor chatbot</li>
        <li>Progress tracking and readiness scoring</li>
        <li>Bilingual study mode</li>
        <li>Spaced repetition learning system</li>
      </ul>

      <h2 id="disclaimer">Official Disclaimer</h2>
      <p>
        <strong>
          CitizenMate is an independent study tool. It is NOT affiliated with,
          endorsed by, or connected to the Australian Government, the Department
          of Home Affairs, or any government agency.
        </strong>
      </p>
      <p>
        Our practice questions are inspired by the types of questions in the
        official test but are <strong>not</strong> official test questions. The
        content is based on publicly available materials, primarily the
        &quot;Our Common Bond&quot; booklet published by the Department of Home
        Affairs.
      </p>
      <p>
        <strong>
          Using CitizenMate does not guarantee that you will pass the Australian
          Citizenship Test.
        </strong>{" "}
        Test outcomes depend on many factors, including the specific questions
        presented in the official examination.
      </p>

      <h2 id="accounts">User Accounts</h2>
      <ul>
        <li>
          You must provide accurate and complete information when creating an
          account.
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your account
          credentials.
        </li>
        <li>
          You are responsible for all activities that occur under your account.
        </li>
        <li>
          You must notify us immediately of any unauthorised use of your
          account.
        </li>
      </ul>

      <h2 id="acceptable-use">Acceptable Use</h2>
      <p>You agree NOT to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>
          Attempt to reverse-engineer, decompile, or extract source code from
          the Service
        </li>
        <li>
          Use automated scripts, bots, or scrapers to access the Service
        </li>
        <li>
          Abuse the AI Tutor by sending excessive, spam, or harmful requests
        </li>
        <li>Share your account credentials with others</li>
        <li>
          Reproduce, distribute, or resell any content from the Service without
          permission
        </li>
        <li>
          Interfere with or disrupt the Service or servers connected to the
          Service
        </li>
      </ul>

      <h2 id="intellectual-property">Intellectual Property</h2>
      <p>
        All content, features, and functionality of the Service — including but
        not limited to text, graphics, logos, icons, images, software, and the
        overall design — are owned by CitizenMate and protected by Australian
        and international intellectual property laws.
      </p>
      <p>
        Content sourced from the &quot;Our Common Bond&quot; booklet is
        attributed to the Australian Government Department of Home Affairs and
        is used for educational purposes under fair dealing provisions.
      </p>

      <h2 id="payments">Payments &amp; Refunds</h2>
      <h3>Paid Plans</h3>
      <p>
        CitizenMate offers both free and paid tiers. Paid plans (&quot;Exam
        Sprint Pass&quot;) provide access to premium features for a fixed
        duration.
      </p>
      <h3>Billing</h3>
      <ul>
        <li>All prices are listed in Australian Dollars (AUD) and include GST.</li>
        <li>Payment is processed securely through our payment provider.</li>
        <li>
          Subscription plans renew automatically unless cancelled before the
          renewal date.
        </li>
      </ul>
      <h3>Refund Policy</h3>
      <ul>
        <li>
          You may request a full refund within <strong>7 days</strong> of
          purchase if you have not completed more than 2 practice tests during
          that period.
        </li>
        <li>
          Refund requests can be made by emailing{" "}
          <a href="mailto:support@citizenmate.com.au">support@citizenmate.com.au</a>.
        </li>
        <li>
          Refunds are processed within 5–10 business days to your original
          payment method.
        </li>
      </ul>

      <h2 id="ai-tutor">AI Tutor Disclaimer</h2>
      <p>
        The AI Tutor is powered by Google Gemini and provides{" "}
        <strong>informational responses only</strong>. You should be aware that:
      </p>
      <ul>
        <li>
          AI responses may occasionally contain inaccuracies or outdated
          information.
        </li>
        <li>
          The AI Tutor is not a substitute for reading the official &quot;Our
          Common Bond&quot; booklet.
        </li>
        <li>
          We do not guarantee the accuracy, completeness, or reliability of any
          AI-generated content.
        </li>
        <li>
          Use of the AI Tutor is subject to rate limits to ensure fair access
          for all users.
        </li>
      </ul>

      <h2 id="limitation">Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by Australian law, CitizenMate shall not
        be liable for any indirect, incidental, special, consequential, or
        punitive damages, including but not limited to:
      </p>
      <ul>
        <li>Loss of data or profits</li>
        <li>Failure to pass the citizenship test</li>
        <li>Interruption of service</li>
        <li>Errors or inaccuracies in content or AI responses</li>
      </ul>
      <p>
        Our total liability for any claim arising from or related to the Service
        shall not exceed the amount you paid us in the 12 months preceding the
        claim.
      </p>

      <h2 id="termination">Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time,
        without prior notice, for conduct that we determine violates these Terms
        or is harmful to other users or the Service.
      </p>
      <p>
        You may delete your account at any time through your account settings.
        Upon deletion, your personal data will be removed in accordance with our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2 id="governing-law">Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of
        the <strong>State of New South Wales, Australia</strong>. Any disputes
        shall be subject to the exclusive jurisdiction of the courts of New
        South Wales.
      </p>

      <h2 id="changes">Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Material
        changes will be communicated via email or a prominent notice on the
        Service. Your continued use after changes constitutes acceptance.
      </p>

      <h2 id="contact">Contact Us</h2>
      <p>
        For questions about these Terms, please contact us at:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:legal@citizenmate.com.au">legal@citizenmate.com.au</a>
        </li>
        <li>
          <strong>General:</strong>{" "}
          <a href="mailto:hello@citizenmate.com.au">hello@citizenmate.com.au</a>
        </li>
      </ul>
    </LegalLayout>
  );
}
