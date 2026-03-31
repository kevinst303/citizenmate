import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const mdxComponents = {
  h1: (props: any) => <h1 className="mt-8 mb-4 text-4xl font-extrabold tracking-tight text-white lg:text-5xl" {...props} />,
  h2: (props: any) => <h2 className="mt-10 mb-4 pb-2 text-3xl font-semibold tracking-tight text-white border-b border-white/10 first:mt-0" {...props} />,
  h3: (props: any) => <h3 className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-white" {...props} />,
  p: (props: any) => <p className="leading-7 [&:not(:first-child)]:mt-6 text-neutral-300" {...props} />,
  ul: (props: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-neutral-300" {...props} />,
  ol: (props: any) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-neutral-300" {...props} />,
  li: (props: any) => <li className="text-neutral-300" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic text-neutral-400" {...props} />
  ),
  a: ({ href, children, ...props }: any) => {
    return (
      <Link href={href || '#'} className="font-medium text-primary underline underline-offset-4 hover:text-primary/80" {...props}>
        {children}
      </Link>
    );
  },
  img: (props: any) => (
    <div className="my-8 overflow-hidden rounded-xl border border-white/10">
      <Image
        src={props.src}
        alt={props.alt || 'Blog Image'}
        width={800}
        height={450}
        className="object-cover w-full h-auto"
      />
    </div>
  ),
  // Custom Interactive Component for conversion embedding
  QuizCTA: ({ title = 'Ready to Practice?', text = 'Don’t wait until the last minute. Familiarize yourself with the actual test format using our hyper-realistic simulator.' }) => (
    <div className="my-10 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_-5px_var(--primary-opacity)]">
      <div className="space-y-3 flex-1 text-center sm:text-left">
        <h3 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          {title}
        </h3>
        <p className="text-neutral-300">{text}</p>
      </div>
      <Link href="/">
        <Button size="lg" className="shrink-0 w-full sm:w-auto shadow-lg hover:shadow-primary/25 transition-all">
          Try Free Practice Test <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  ),
};
