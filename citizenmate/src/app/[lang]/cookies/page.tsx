import { Metadata } from "next";
import { LegalLayout } from "@/components/shared/legal-layout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How CitizenMate uses cookies and similar technologies to improve your experience.",
};

const sections = [
  { id: "what-are-cookies", title: "What Are Cookies?" },
  { id: "cookies-we-use", title: "Cookies We Use" },
  { id: "analytics", title: "Analytics Cookies" },
  { id: "managing-cookies", title: "Managing Cookies" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="24 March 2026"
      sections={sections}
    >
      <h2 id="what-are-cookies">What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on your device when you
        visit a website. They are widely used to make websites work more
        efficiently and to provide information to the site owners.
      </p>

      <h2 id="cookies-we-use">Cookies We Use</h2>
      <p>CitizenMate uses the following types of cookies:</p>

      <h3>Essential Cookies</h3>
      <p>
        These cookies are necessary for the Service to function and cannot be
        switched off. They are usually set in response to actions you take, such
        as logging in or setting your study preferences.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>sb-access-token</code></td>
            <td>Supabase authentication session</td>
            <td>Session</td>
          </tr>
          <tr>
            <td><code>sb-refresh-token</code></td>
            <td>Supabase session refresh</td>
            <td>7 days</td>
          </tr>
          <tr>
            <td><code>cm-cookie-consent</code></td>
            <td>Records your cookie consent preference</td>
            <td>365 days</td>
          </tr>
        </tbody>
      </table>

      <h3>Functional Cookies</h3>
      <p>
        These cookies enable enhanced functionality and personalisation, such as
        remembering your study preferences and test date.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie / Storage</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>cm-test-date</code></td>
            <td>Stores your citizenship test date</td>
            <td>Persistent (localStorage)</td>
          </tr>
          <tr>
            <td><code>cm-study-progress</code></td>
            <td>Stores your offline study progress</td>
            <td>Persistent (localStorage)</td>
          </tr>
        </tbody>
      </table>

      <h2 id="analytics">Analytics Cookies</h2>
      <p>
        With your consent, we use <strong>Google Analytics (GA4)</strong> to
        understand how visitors use our Service. These cookies collect
        information in an anonymised form, including the pages visited, time
        spent on pages, and how users arrived at our site.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>_ga</code></td>
            <td>Google Analytics — distinguishes users</td>
            <td>2 years</td>
          </tr>
          <tr>
            <td><code>_ga_*</code></td>
            <td>Google Analytics — maintains session state</td>
            <td>2 years</td>
          </tr>
        </tbody>
      </table>
      <p>
        Analytics cookies are only set <strong>after you have given consent</strong>{" "}
        via the cookie consent banner displayed on your first visit.
      </p>

      <h2 id="managing-cookies">Managing Cookies</h2>
      <p>You can manage your cookie preferences in several ways:</p>
      <ul>
        <li>
          <strong>Cookie consent banner:</strong> When you first visit
          CitizenMate, a consent banner will appear allowing you to accept or
          decline non-essential cookies.
        </li>
        <li>
          <strong>Browser settings:</strong> Most web browsers allow you to
          control cookies through their settings. You can delete existing cookies
          and set your browser to block future cookies.
        </li>
        <li>
          <strong>Google Analytics opt-out:</strong> You can install the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </li>
      </ul>
      <p>
        Please note that blocking essential cookies may prevent you from using
        certain features of the Service, such as logging in to your account.
      </p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. Changes will be
        posted on this page with an updated &quot;Last updated&quot; date.
      </p>

      <h2 id="contact">Contact Us</h2>
      <p>
        If you have questions about our use of cookies, please contact us at:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:privacy@citizenmate.com.au">privacy@citizenmate.com.au</a>
        </li>
      </ul>
    </LegalLayout>
  );
}
