import Image from 'next/image';
import Link from 'next/link';
import parse, { domToReact, Element, type DOMNode, type HTMLReactParserOptions } from 'html-react-parser';
import { QuizCTA } from '@/components/blog/quiz-cta';

function isElement(node: DOMNode): node is Element {
  return node instanceof Element && (node as Element).type === 'tag';
}

function isInternalUrl(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#');
}

function parseQuizCtaAttributes(content: string): string {
  let preprocessed = content.replace(
    /<QuizCTA\s+title\s*=\s*"([^"]*)"\s+text\s*=\s*"((?:[^"]|\\")*?)"\s*(?:\/|><\/QuizCTA)?>/gi,
    (_match, title, text) =>
      `<div data-component="quiz-cta" data-title="${escapeAttr(title)}" data-text="${escapeAttr(text.replace(/\\"/g, '"'))}"></div>`
  );

  preprocessed = preprocessed.replace(
    /<QuizCTA\s*(?:\/|><\/QuizCTA)?>/gi,
    () => `<div data-component="quiz-cta"></div>`
  );

  return preprocessed;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const IMAGE_DIMENSIONS = { width: 800, height: 450 };

export function BlogHtmlContent({ content }: { content: string }) {
  const preprocessed = parseQuizCtaAttributes(content);

  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (!isElement(domNode)) return;

      const { name, attribs, children } = domNode;

      if (attribs['data-component'] === 'quiz-cta') {
        return (
          <QuizCTA
            title={attribs['data-title']}
            text={attribs['data-text']}
          />
        );
      }

      if (name === 'img') {
        const src = attribs.src || '';
        const alt = attribs.alt || '';
        return (
          <span className="my-8 block overflow-hidden rounded-xl border border-slate-200">
            <Image
              src={src}
              alt={alt}
              width={IMAGE_DIMENSIONS.width}
              height={IMAGE_DIMENSIONS.height}
              className="object-cover w-full h-auto m-0"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </span>
        );
      }

      if (name === 'a' && attribs.href) {
        const { href, ...rest } = attribs;
        if (isInternalUrl(href)) {
          return (
            <Link href={href} {...rest}>
              {domToReact(children as unknown as DOMNode[], options)}
            </Link>
          );
        }
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
            {domToReact(children as unknown as DOMNode[], options)}
          </a>
        );
      }
    },
  };

  return (
    <div
      className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-cm-dark prose-headings:tracking-tight prose-p:text-cm-slate-600 prose-p:leading-relaxed prose-a:text-cm-teal prose-a:no-underline hover:prose-a:text-cm-teal-dark hover:prose-a:underline prose-img:rounded-[24px] prose-img:shadow-card prose-li:text-cm-slate-600 prose-strong:text-cm-slate-800"
    >
      {parse(preprocessed, options)}
    </div>
  );
}
