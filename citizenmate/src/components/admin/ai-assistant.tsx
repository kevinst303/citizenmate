'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Languages, Search, FileText, Tags as TagsIcon, X } from 'lucide-react';

interface AiAssistantProps {
  currentContent: string;
  currentLocale: string;
  targetLocales: string[];
  onInsertContent: (html: string) => void;
  onSuggestTags: (tags: string[]) => void;
  onSuggestSeo: (seo: { title: string; description: string; keywords: string }) => void;
  postId?: string;
}

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  hi: 'Hindi',
  zh: 'Chinese',
  ar: 'Arabic',
};

export function AiAssistant({
  currentContent,
  currentLocale,
  targetLocales,
  onInsertContent,
  onSuggestTags,
  onSuggestSeo,
}: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [tagResults, setTagResults] = useState<string[] | null>(null);
  const [seoResults, setSeoResults] = useState<{
    title: string;
    description: string;
    keywords: string;
  } | null>(null);
  const [topic, setTopic] = useState('');

  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading('generate');
    setResult('');
    try {
      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!res.ok || !res.body) {
        setLoading(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const { fullContent } = JSON.parse(line.slice(6));
              if (fullContent) setResult(fullContent);
            } catch { /* skip malformed chunks */ }
          }
        }
      }
    } catch {
      /* ignore */
    }
    setLoading(null);
  };

  const handleRewrite = async () => {
    if (!currentContent) return;
    setLoading('rewrite');
    setResult(null);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentContent }),
      });
      const data = await res.json();
      if (res.ok && data.content) {
        setResult(data.content);
      }
    } catch {
      /* ignore */
    }
    setLoading(null);
  };

  const handleTranslate = async (targetLocale: string) => {
    if (!currentContent) return;
    setLoading('translate');
    setResult(null);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentContent, targetLocale }),
      });
      const data = await res.json();
      if (res.ok && data.translated) {
        setResult(data.translated);
      }
    } catch {
      /* ignore */
    }
    setLoading(null);
  };

  const handleSuggestSeo = async () => {
    if (!currentContent) return;
    setLoading('seo');
    setSeoResults(null);
    try {
      const res = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setSeoResults(data);
      }
    } catch {
      /* ignore */
    }
    setLoading(null);
  };

  const handleSuggestTags = async () => {
    if (!currentContent) return;
    setLoading('tags');
    setTagResults(null);
    try {
      const res = await fetch('/api/ai/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentContent }),
      });
      const data = await res.json();
      if (res.ok && data.tags) {
        setTagResults(data.tags);
      }
    } catch {
      /* ignore */
    }
    setLoading(null);
  };

  const btnClass =
    'w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-[#E9ECEF] bg-white hover:bg-[#006d77]/5 hover:border-[#006d77] text-slate-700 transition-colors';
  const activeBtnClass =
    'w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-[#006d77] bg-[#006d77]/5 text-[#006d77] transition-colors';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          isOpen
            ? 'bg-[#006d77] text-white'
            : 'border border-[#E9ECEF] bg-white text-slate-600 hover:bg-[#006d77]/5'
        }`}
      >
        <Sparkles size={14} />
        AI Assistant
      </button>

      {isOpen && (
        <div className="rounded-[10px] border border-[#E9ECEF] bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">AI Assistant</h4>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setResult(null);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>

          {/* Generate */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Generate new content from a topic</p>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g. 'How to prepare for the citizenship test')"
              className="w-full px-3 py-2 text-xs border border-[#E9ECEF] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#006d77]"
              rows={2}
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading === 'generate' || !topic.trim()}
              className={loading === 'generate' ? `${btnClass} opacity-50` : btnClass}
            >
              {loading === 'generate' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              Generate
            </button>
          </div>

          {/* Rewrite */}
          <button
            type="button"
            onClick={handleRewrite}
            disabled={loading === 'rewrite' || !currentContent}
            className={loading === 'rewrite' ? `${btnClass} opacity-50` : btnClass}
          >
            {loading === 'rewrite' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            Rewrite Current Content
          </button>

          {/* Translate */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Translate to:</p>
            <div className="flex flex-wrap gap-1">
              {targetLocales
                .filter((l) => l !== currentLocale)
                .map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    onClick={() => handleTranslate(locale)}
                    disabled={loading === 'translate' || !currentContent}
                    className="px-2 py-1 text-xs rounded-md border border-[#E9ECEF] bg-white hover:bg-[#006d77]/5 hover:border-[#006d77] text-slate-600 transition-colors disabled:opacity-50"
                  >
                    <Languages size={12} className="inline mr-1" />
                    {LOCALE_LABELS[locale] || locale}
                  </button>
                ))}
            </div>
          </div>

          {/* SEO */}
          <button
            type="button"
            onClick={handleSuggestSeo}
            disabled={loading === 'seo' || !currentContent}
            className={loading === 'seo' ? `${btnClass} opacity-50` : btnClass}
          >
            {loading === 'seo' ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Suggest SEO Metadata
          </button>

          {/* Tags */}
          <button
            type="button"
            onClick={handleSuggestTags}
            disabled={loading === 'tags' || !currentContent}
            className={loading === 'tags' ? `${btnClass} opacity-50` : btnClass}
          >
            {loading === 'tags' ? <Loader2 size={14} className="animate-spin" /> : <TagsIcon size={14} />}
            Suggest Tags
          </button>

          {/* Results */}
          {result && (
            <div className="rounded-lg border border-[#E9ECEF] bg-slate-50 p-3 space-y-2">
              <div className="text-xs text-slate-500 max-h-48 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: result }} />
              </div>
              <button
                type="button"
                onClick={() => {
                  onInsertContent(result);
                  setResult(null);
                }}
                className="w-full px-3 py-1.5 text-xs font-medium rounded-md bg-[#006d77] text-white hover:bg-[#005a63] transition-colors"
              >
                Insert into Editor
              </button>
            </div>
          )}

          {tagResults && (
            <div className="rounded-lg border border-[#E9ECEF] bg-slate-50 p-3 space-y-2">
              <div className="flex flex-wrap gap-1">
                {tagResults.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-[#006d77]/10 text-[#006d77]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  onSuggestTags(tagResults);
                  setTagResults(null);
                }}
                className="w-full px-3 py-1.5 text-xs font-medium rounded-md bg-[#006d77] text-white hover:bg-[#005a63] transition-colors"
              >
                Add These Tags
              </button>
            </div>
          )}

          {seoResults && (
            <div className="rounded-lg border border-[#E9ECEF] bg-slate-50 p-3 space-y-2">
              <div className="text-xs space-y-1">
                <p><strong>Title:</strong> {seoResults.title}</p>
                <p><strong>Description:</strong> {seoResults.description}</p>
                {seoResults.keywords && <p><strong>Keywords:</strong> {seoResults.keywords}</p>}
              </div>
              <button
                type="button"
                onClick={() => {
                  onSuggestSeo(seoResults);
                  setSeoResults(null);
                }}
                className="w-full px-3 py-1.5 text-xs font-medium rounded-md bg-[#006d77] text-white hover:bg-[#005a63] transition-colors"
              >
                Apply SEO Fields
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
