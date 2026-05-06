"use client";

import { SubpageHero } from "@/components/shared/subpage-hero";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useT } from "@/i18n/i18n-context";

export default function AboutPage() {
  const { t } = useT();
  return (
    <main className="min-h-screen bg-cm-slate-50">
      <SubpageHero
        title={t("legal.about_title", "About Us")}
        description={t("legal.about_subtitle", "We're on a mission to help everyone pass their Australian citizenship test with confidence.")}
        breadcrumbs={[
          { label: t("legal.breadcrumb_home", "Home"), href: "/" },
          { label: t("legal.about_title", "About Us") },
        ]}
        curveColorClass="text-cm-slate-50"
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* About Text */}
            <div>
              <span className="badge-pill mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cm-teal" />
                {t("legal.about_story_badge", "Our Story")}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t("legal.about_mission", "Empowering your journey to Australian citizenship.")}
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  {t("legal.about_para_1", "CitizenMate was born out of a simple observation: preparing for the Australian citizenship test shouldn't be stressful, confusing, or limited by language barriers.")}
                </p>
                <p>
                  {t("legal.about_para_2", "We realised that the official materials, while comprehensive, can be overwhelming. We wanted to create a modern, AI-powered platform that doesn't just throw practice questions at you, but actually helps you understand the \u201cOur Common Bond\u201d material deeply.")}
                </p>
                <p>
                  {t("legal.about_para_3", "Our bilingual study modes, smart mock tests, and personalised study plans are all designed with one goal in mind: to get you ready for your test day as efficiently as possible, so you can celebrate becoming an Australian citizen.")}
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cm-teal-50 text-cm-teal flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t("legal.about_email_label", "Email Us")}</h4>
                    <a href="mailto:hello@citizenmate.com.au" className="text-muted-foreground hover:text-cm-teal transition-colors">
                      hello@citizenmate.com.au
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cm-teal-50 text-cm-teal flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t("legal.about_location_label", "Location")}</h4>
                    <p className="text-muted-foreground">
                      {t("legal.about_location_value", "Sydney, Australia")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div id="contact" className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-cm-slate-200/50 border border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cm-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              
              <div className="relative z-10">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  {t("legal.about_contact_title", "Get in Touch")}
                </h3>
                <p className="text-muted-foreground mb-8">
                  {t("legal.about_contact_desc", "Have a question or need support? Fill out the form below and our team will get back to you shortly.")}
                </p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-semibold text-foreground">{t("legal.about_field_first_name", "First Name")}</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal transition-all"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-semibold text-foreground">{t("legal.about_field_last_name", "Last Name")}</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal transition-all"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-foreground">{t("legal.about_field_email", "Email Address")}</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-foreground">{t("legal.about_field_subject", "Subject")}</label>
                    <div className="relative">
                      <select 
                        id="subject" 
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal transition-all appearance-none pr-10"
                      >
                        <option value="support">{t("legal.about_option_support", "General Support")}</option>
                        <option value="billing">{t("legal.about_option_billing", "Billing & Subscriptions")}</option>
                        <option value="feedback">{t("legal.about_option_feedback", "Feedback")}</option>
                        <option value="other">{t("legal.about_option_other", "Other")}</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-foreground">{t("legal.about_field_message", "Message")}</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal transition-all resize-none"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full py-4 text-[1rem] font-semibold"
                  >
                    {t("legal.about_send_button", "Send Message")}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    {t("legal.about_privacy_note", "By submitting this form, you agree to our privacy policy.")}
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
