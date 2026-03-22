import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Mock Tests", href: "#" },
    { label: "Study Mode", href: "#" },
  ],
  Support: [
    { label: "FAQ", href: "#faq" },
    { label: "Contact Us", href: "mailto:hello@citizenmate.com" },
    { label: "Help Centre", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-cm-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cm-navy text-white font-heading font-bold text-lg">
                CM
              </div>
              <span className="font-heading text-xl font-bold">
                Citizen<span className="text-cm-sky">Mate</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Your mate for the citizenship test. Study in your language,
              practice with AI, and pass with confidence.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Disclaimer + copyright */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs text-white/40">
              CitizenMate is independent from the Australian Government. Not
              affiliated with or endorsed by the Department of Home Affairs.
            </p>
            <p className="text-xs text-white/40">
              Content based on &ldquo;Our Common Bond&rdquo; booklet — March
              2026 edition.
            </p>
          </div>
          <p className="text-xs text-white/40 shrink-0">
            © {new Date().getFullYear()} CitizenMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
