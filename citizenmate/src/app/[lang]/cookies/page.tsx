"use client";

import { LegalLayout } from "@/components/shared/legal-layout";
import { useT } from "@/i18n/i18n-context";

export default function CookiesPage() {
  const { t } = useT();

  const sections = [
    { id: "what-are-cookies", title: t("legal.cookies_section_what", "What Are Cookies?") },
    { id: "cookies-we-use", title: t("legal.cookies_section_we_use", "Cookies We Use") },
    { id: "analytics", title: t("legal.cookies_section_analytics", "Analytics Cookies") },
    { id: "managing-cookies", title: t("legal.cookies_section_managing", "Managing Cookies") },
    { id: "changes", title: t("legal.cookies_section_changes", "Changes to This Policy") },
    { id: "contact", title: t("legal.cookies_section_contact", "Contact Us") },
  ];

  return (
    <LegalLayout
      title={t("legal.cookies_title", "Cookie Policy")}
      lastUpdated={t("legal.cookies_last_updated", "24 March 2026")}
      sections={sections}
    >
      <h2 id="what-are-cookies">{t("legal.cookies_section_what", "What Are Cookies?")}</h2>
      <p>
        {t("legal.cookies_what_p1", "Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owners.")}
      </p>

      <h2 id="cookies-we-use">{t("legal.cookies_section_we_use", "Cookies We Use")}</h2>
      <p>{t("legal.cookies_we_use_p1", "CitizenMate uses the following types of cookies:")}</p>

      <h3>{t("legal.cookies_essential_heading", "Essential Cookies")}</h3>
      <p>
        {t("legal.cookies_essential_desc", "These cookies are necessary for the Service to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or setting your study preferences.")}
      </p>
      <table>
        <thead>
          <tr>
            <th>{t("legal.cookies_table_header_cookie", "Cookie")}</th>
            <th>{t("legal.cookies_table_header_purpose", "Purpose")}</th>
            <th>{t("legal.cookies_table_header_duration", "Duration")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>sb-access-token</code></td>
            <td>{t("legal.cookies_essential_sb_access_purpose", "Supabase authentication session")}</td>
            <td>{t("legal.cookies_essential_sb_access_duration", "Session")}</td>
          </tr>
          <tr>
            <td><code>sb-refresh-token</code></td>
            <td>{t("legal.cookies_essential_sb_refresh_purpose", "Supabase session refresh")}</td>
            <td>{t("legal.cookies_essential_sb_refresh_duration", "7 days")}</td>
          </tr>
          <tr>
            <td><code>cm-cookie-consent</code></td>
            <td>{t("legal.cookies_essential_cm_consent_purpose", "Records your cookie consent preference")}</td>
            <td>{t("legal.cookies_essential_cm_consent_duration", "365 days")}</td>
          </tr>
        </tbody>
      </table>

      <h3>{t("legal.cookies_functional_heading", "Functional Cookies")}</h3>
      <p>
        {t("legal.cookies_functional_desc", "These cookies enable enhanced functionality and personalisation, such as remembering your study preferences and test date.")}
      </p>
      <table>
        <thead>
          <tr>
            <th>{t("legal.cookies_table_header_storage", "Cookie / Storage")}</th>
            <th>{t("legal.cookies_table_header_purpose", "Purpose")}</th>
            <th>{t("legal.cookies_table_header_duration", "Duration")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>cm-test-date</code></td>
            <td>{t("legal.cookies_functional_test_date_purpose", "Stores your citizenship test date")}</td>
            <td>{t("legal.cookies_functional_test_date_duration", "Persistent (localStorage)")}</td>
          </tr>
          <tr>
            <td><code>cm-study-progress</code></td>
            <td>{t("legal.cookies_functional_progress_purpose", "Stores your offline study progress")}</td>
            <td>{t("legal.cookies_functional_progress_duration", "Persistent (localStorage)")}</td>
          </tr>
        </tbody>
      </table>

      <h2 id="analytics">{t("legal.cookies_section_analytics", "Analytics Cookies")}</h2>
      <p>
        {t("legal.cookies_analytics_p1_prefix", "With your consent, we use")}{" "}
        <strong>{t("legal.cookies_analytics_p1_bold", "Google Analytics (GA4)")}</strong>
        {t("legal.cookies_analytics_p1_suffix", " to understand how visitors use our Service. These cookies collect information in an anonymised form, including the pages visited, time spent on pages, and how users arrived at our site.")}
      </p>
      <table>
        <thead>
          <tr>
            <th>{t("legal.cookies_table_header_cookie", "Cookie")}</th>
            <th>{t("legal.cookies_table_header_purpose", "Purpose")}</th>
            <th>{t("legal.cookies_table_header_duration", "Duration")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>_ga</code></td>
            <td>{t("legal.cookies_analytics_ga_purpose", "Google Analytics \u2014 distinguishes users")}</td>
            <td>{t("legal.cookies_analytics_ga_duration", "2 years")}</td>
          </tr>
          <tr>
            <td><code>_ga_*</code></td>
            <td>{t("legal.cookies_analytics_ga_star_purpose", "Google Analytics \u2014 maintains session state")}</td>
            <td>{t("legal.cookies_analytics_ga_star_duration", "2 years")}</td>
          </tr>
        </tbody>
      </table>
      <p>
        {t("legal.cookies_analytics_consent_note_prefix", "Analytics cookies are only set")}{" "}
        <strong>{t("legal.cookies_analytics_consent_note_bold", "after you have given consent")}</strong>{" "}
        {t("legal.cookies_analytics_consent_note_suffix", "via the cookie consent banner displayed on your first visit.")}
      </p>

      <h2 id="managing-cookies">{t("legal.cookies_section_managing", "Managing Cookies")}</h2>
      <p>{t("legal.cookies_managing_p1", "You can manage your cookie preferences in several ways:")}</p>
      <ul>
        <li>
          <strong>{t("legal.cookies_managing_li1_label", "Cookie consent banner:")}</strong>{" "}
          {t("legal.cookies_managing_li1_desc", "When you first visit CitizenMate, a consent banner will appear allowing you to accept or decline non-essential cookies.")}
        </li>
        <li>
          <strong>{t("legal.cookies_managing_li2_label", "Browser settings:")}</strong>{" "}
          {t("legal.cookies_managing_li2_desc", "Most web browsers allow you to control cookies through their settings. You can delete existing cookies and set your browser to block future cookies.")}
        </li>
        <li>
          <strong>{t("legal.cookies_managing_li3_label", "Google Analytics opt-out:")}</strong>{" "}
          {t("legal.cookies_managing_li3_desc_prefix", "You can install the")}{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            {t("legal.cookies_managing_li3_link", "Google Analytics Opt-out Browser Add-on")}
          </a>.
        </li>
      </ul>
      <p>
        {t("legal.cookies_managing_p2", "Please note that blocking essential cookies may prevent you from using certain features of the Service, such as logging in to your account.")}
      </p>

      <h2 id="changes">{t("legal.cookies_section_changes", "Changes to This Policy")}</h2>
      <p>
        {t("legal.cookies_changes_p1", 'We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.')}
      </p>

      <h2 id="contact">{t("legal.cookies_section_contact", "Contact Us")}</h2>
      <p>
        {t("legal.cookies_contact_p1", "If you have questions about our use of cookies, please contact us at:")}
      </p>
      <ul>
        <li>
          <strong>{t("legal.cookies_contact_li1_label", "Email:")}</strong>{" "}
          <a href="mailto:privacy@citizenmate.com.au">privacy@citizenmate.com.au</a>
        </li>
      </ul>
    </LegalLayout>
  );
}
