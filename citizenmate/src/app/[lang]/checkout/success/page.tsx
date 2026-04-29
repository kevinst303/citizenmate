import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Purchase Complete — CitizenMate",
  description: "Your Exam Sprint Pass is now active. Start studying for your Australian citizenship test.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-cm-ice flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cm-teal/10 text-cm-teal mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-cm-slate-900 mb-4">
          You&apos;re all set, mate! 🎉
        </h1>

        <p className="text-lg text-cm-slate-500 leading-relaxed mb-4">
          Your <strong className="text-cm-teal">Exam Sprint Pass</strong> is now active.
          You have <strong>60 days</strong> of full access to everything CitizenMate offers.
        </p>

        <p className="text-sm text-cm-slate-400 mb-10">
          A confirmation email will arrive shortly. If you need any help,
          reach out to{" "}
          <a href="mailto:support@citizenmate.com.au" className="text-cm-teal hover:underline">
            support@citizenmate.com.au
          </a>
        </p>

        {/* What to do next */}
        <div className="card-conseil p-6 text-left mb-8">
          <h2 className="font-heading font-bold text-cm-slate-900 mb-4">
            What to do next
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cm-teal/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-cm-teal" />
              </div>
              <div>
                <p className="font-semibold text-sm text-cm-slate-900">Study the topics</p>
                <p className="text-xs text-cm-slate-500">
                  Work through all chapters in bilingual mode with AI explanations.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cm-purple/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-cm-purple" />
              </div>
              <div>
                <p className="font-semibold text-sm text-cm-slate-900">Take mock tests</p>
                <p className="text-xs text-cm-slate-500">
                  You now have access to all 15 mock tests with unlimited retakes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-cm-teal text-white font-heading font-bold rounded-full hover:bg-cm-teal/90 transition-colors duration-200"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-cm-slate-200 text-cm-slate-700 font-heading font-semibold rounded-full hover:bg-cm-slate-50 transition-colors duration-200"
          >
            Start a Mock Test
          </Link>
        </div>
      </div>
    </div>
  );
}
