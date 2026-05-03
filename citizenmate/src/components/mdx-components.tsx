import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const mdxComponents = {
  a: ({ href, children, ...props }: any) => {
    return (
      <Link href={href || '#'} {...props}>
        {children}
      </Link>
    );
  },
  img: (props: any) => (
    <div className="my-8 overflow-hidden rounded-xl border border-slate-200">
      <Image
        src={props.src}
        alt={props.alt || 'Blog Image'}
        width={800}
        height={450}
        className="object-cover w-full h-auto m-0"
      />
    </div>
  ),
  // Custom Interactive Component for conversion embedding
  QuizCTA: ({ title = 'Ready to Practice?', text = 'Don’t wait until the last minute. Familiarize yourself with the actual test format using our hyper-realistic simulator.' }) => (
    <div className="my-10 sm:my-16 group/card card-conseil-popular action-card-shine grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 md:gap-12 items-center p-6 sm:p-10 lg:p-12 not-prose relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,109,119,0.3)] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,109,119,0.5)] hover:-translate-y-1">
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xNSkiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>

      {/* Premium organic decorative background elements */}
      <div className="absolute -right-20 -top-20 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-[40px] sm:blur-[64px] pointer-events-none transition-transform duration-700 group-hover/card:scale-110"></div>
      <div className="absolute -left-10 -bottom-10 w-40 sm:w-56 h-40 sm:h-56 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-[32px] sm:blur-[48px] pointer-events-none transition-transform duration-700 group-hover/card:scale-110"></div>
      <div className="absolute right-1/4 bottom-1/4 w-32 sm:w-40 h-32 sm:h-40 bg-teal-400/20 rounded-full blur-2xl sm:blur-3xl pointer-events-none animate-pulse duration-3000"></div>
      
      {/* Left Content Area */}
      <div className="space-y-4 sm:space-y-6 md:col-span-3 relative z-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
          <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-teal-400"></span>
          </span>
          <span className="text-white/90 text-[10px] sm:text-xs font-bold tracking-wider uppercase">Fast-Track Your Success</span>
        </div>

        <h3 className="!text-2xl sm:!text-4xl !font-extrabold !text-white flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4 !m-0 !leading-tight tracking-tight drop-shadow-sm">
          {title}
        </h3>
        
        <p className="!text-white/80 !text-base sm:!text-xl !m-0 !leading-relaxed max-w-xl font-medium mx-auto sm:mx-0">
          {text}
        </p>
        
        <div className="pt-2 sm:pt-4">
          <div className="relative inline-block w-full sm:w-auto group/btn">
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
            <Link href="/" className="no-underline block relative">
              <Button size="lg" className="w-full sm:w-auto bg-white !text-cm-teal hover:bg-slate-50 hover:!text-cm-teal-dark shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm sm:text-lg h-12 sm:h-14 px-6 sm:px-10 rounded-full font-bold transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.03] active:scale-[0.98] sm:active:scale-[0.97] border border-white/60 flex items-center justify-center group-hover/btn:border-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cm-teal-dark to-cm-teal">Try Free Practice Test</span>
                <ArrowRight className="ml-2 sm:ml-2.5 h-4 sm:h-5 w-4 sm:w-5 !text-cm-teal transition-transform duration-300 group-hover/btn:translate-x-1 sm:group-hover/btn:translate-x-1.5" strokeWidth={2.5} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Visual Area - Custom CSS Mockup */}
      <div className="hidden md:block md:col-span-2 relative z-10 perspective-[1000px]">
        <div className="relative w-full aspect-square max-w-[280px] mx-auto transition-transform duration-700 ease-out transform-gpu group-hover/card:rotate-y-[-10deg] group-hover/card:rotate-x-[5deg] group-hover/card:scale-105">
          {/* Main Mockup Card */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 transform rotate-3">
            {/* Mockup Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="h-3 w-16 bg-white/20 rounded-full"></div>
              <div className="h-3 w-8 bg-white/20 rounded-full"></div>
            </div>
            {/* Mockup Question */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-white/30 rounded-full"></div>
              <div className="h-4 w-4/5 bg-white/30 rounded-full"></div>
            </div>
            {/* Mockup Answers */}
            <div className="space-y-3 mt-auto">
              <div className="h-10 w-full bg-white/5 border border-white/10 rounded-lg"></div>
              <div className="h-10 w-full bg-white/90 rounded-lg flex items-center px-3 shadow-[0_0_15px_rgba(255,255,255,0.3)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent"></div>
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 relative z-10" />
                <div className="h-2 w-24 bg-slate-200 rounded-full relative z-10"></div>
              </div>
              <div className="h-10 w-full bg-white/5 border border-white/10 rounded-lg"></div>
            </div>
          </div>
          
          {/* Floating Element 1 */}
          <div className="absolute -right-6 -top-6 bg-white p-3 rounded-xl shadow-xl border border-slate-100 transform rotate-12 transition-transform duration-700 group-hover/card:-translate-y-2 group-hover/card:rotate-12 group-hover/card:scale-110 animate-float">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-1">
                <div className="h-2 w-10 bg-slate-200 rounded-full"></div>
                <div className="h-2 w-14 bg-slate-100 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
