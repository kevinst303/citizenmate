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
    <div className="my-10 rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
      <div className="space-y-3 flex-1 text-center sm:text-left">
        <h3 className="!text-2xl !font-bold !text-slate-900 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 !m-0">
          <CheckCircle2 className="h-6 w-6 text-conseil-teal" />
          {title}
        </h3>
        <p className="!text-slate-600 !m-0">{text}</p>
      </div>
      <Link href="/" className="no-underline">
        <Button size="lg" className="shrink-0 w-full sm:w-auto bg-conseil-teal text-white hover:bg-conseil-teal/90 shadow-md">
          Try Free Practice Test <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  ),
};
