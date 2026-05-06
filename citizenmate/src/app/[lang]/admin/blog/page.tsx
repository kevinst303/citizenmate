'use client';

import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react';
import { Pagination } from '@/components/admin/pagination';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { BlogEditor } from '@/components/admin/blog-editor';
import { AiAssistant } from '@/components/admin/ai-assistant';
import { X, Plus, Star, Globe, Loader2, Upload, ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import type { BlogPostStatus } from '@/lib/blog-types';

const PAGE_SIZE = 10;
const LOCALES = ['en', 'es', 'hi', 'zh', 'ar'] as const;
const LOCALE_LABELS: Record<string, string> = {
  en: 'English', es: 'Spanish', hi: 'Hindi', zh: 'Chinese', ar: 'Arabic',
};

interface TranslationData {
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  status: BlogPostStatus;
  published_at: string | null;
  is_featured: boolean;
  reading_time: number | null;
  translations: TranslationData[];
  media: Array<{ id: string; url: string; is_featured: boolean; alt_text?: string }>;
  tags: Tag[];
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editPostId, setEditPostId] = useState<string | null>(null);

  // Editor state
  const [activeLocale, setActiveLocale] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, TranslationData>>({});
  const [status, setStatus] = useState<BlogPostStatus>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [seoOpen, setSeoOpen] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const json = await res.json();
        setPosts(json.posts || []);
        setError(null);
      } else {
        const err = await res.json().catch(() => ({ error: 'Failed' }));
        setError(err.error || 'Failed to fetch posts');
      }
    } catch {
      setError('Failed to fetch posts');
    }
    setLoading(false);
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog/tags');
      if (res.ok) {
        const json = await res.json();
        setAllTags(json.tags || []);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [fetchPosts, fetchTags]);

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const paginatedPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const initEmptyTranslations = useCallback(() => {
    const empty: Record<string, TranslationData> = {};
    LOCALES.forEach((locale) => {
      empty[locale] = {
        locale,
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        og_image_url: '',
      };
    });
    return empty;
  }, []);

  const loadPostForEdit = useCallback(
    (post: BlogPost) => {
      setEditPostId(post.id);
      setStatus(post.status);
      setIsFeatured(post.is_featured);
      setSelectedTags(post.tags || []);
      setView('editor');

      const transMap = initEmptyTranslations();
      (post.translations || []).forEach((t) => {
        transMap[t.locale] = {
          locale: t.locale,
          title: t.title || '',
          slug: t.slug || '',
          excerpt: t.excerpt || '',
          content: t.content || '',
          seo_title: t.seo_title || '',
          seo_description: t.seo_description || '',
          seo_keywords: t.seo_keywords || '',
          og_image_url: t.og_image_url || '',
        };
      });
      setTranslations(transMap);

      const enTranslation = post.translations?.find((t) => t.locale === 'en');
      if (enTranslation) {
        setActiveLocale('en');
      } else {
        const firstLocale = post.translations?.[0]?.locale || 'en';
        setActiveLocale(firstLocale);
      }
    },
    [initEmptyTranslations]
  );

  const handleCreate = () => {
    setEditPostId(null);
    setStatus('draft');
    setIsFeatured(false);
    setSelectedTags([]);
    setTranslations(initEmptyTranslations());
    setActiveLocale('en');
    setSeoOpen(false);
    setView('editor');
  };

  const handleBackToList = () => {
    setView('list');
    setEditPostId(null);
    fetchPosts();
  };

  // Slug auto-generate
  const handleTitleChange = (title: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        title,
        slug: prev[activeLocale].slug || slugify(title),
      },
    }));
  };

  const handleSlugChange = (slug: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: { ...prev[activeLocale], slug },
    }));
  };

  // Tag management
  const filteredTags = allTags.filter(
    (t) =>
      !selectedTags.find((s) => s.id === t.id) &&
      t.name.toLowerCase().includes(tagInput.toLowerCase())
  );

  const addTag = (tag: Tag) => {
    setSelectedTags((prev) => [...prev, tag]);
    setTagInput('');
  };

  const removeTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const createTag = async () => {
    const name = tagInput.trim();
    if (!name) return;
    try {
      const res = await fetch('/api/admin/blog/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.tag) {
          setAllTags((prev) => [...prev, json.tag]);
          setSelectedTags((prev) => [...prev, json.tag]);
          setTagInput('');
        }
      }
    } catch { /* ignore */ }
  };

  // Image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editPostId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('postId', editPostId);

    try {
      const res = await fetch('/api/admin/blog/upload', { method: 'POST', body: formData });
      if (res.ok) {
        fetchPosts();
      }
    } catch { /* ignore */ }
  };

  // Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const activeTrans = translations[activeLocale];
      if (!activeTrans?.title || !activeTrans?.slug) {
        alert('Title and slug are required for the active locale.');
        setSaving(false);
        return;
      }

      const wordCount = activeTrans.content
        ? activeTrans.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
        : 0;
      const readingTime = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : null;

      const body: Record<string, unknown> = {
        status,
        is_featured: isFeatured,
        reading_time: readingTime,
        translation: {
          ...activeTrans,
        },
        tag_ids: selectedTags.map((t) => t.id),
      };

      const method = editPostId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/blog', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPostId ? { ...body, id: editPostId } : body),
      });

      if (res.ok) {
        const json = await res.json();
        const savedPost = json.post || json;

        if (!editPostId && savedPost?.id) {
          setEditPostId(savedPost.id);
        }

        // Save additional translations (non-active locales)
        if (editPostId || savedPost?.id) {
          const postId = editPostId || savedPost.id;
          const otherLocales = LOCALES.filter(
            (l) => l !== activeLocale && translations[l]?.title
          );
          for (const locale of otherLocales) {
            const t = translations[locale];
            try {
              await fetch('/api/admin/blog/translations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  blog_post_id: postId,
                  locale: t.locale,
                  title: t.title,
                  slug: t.slug,
                  excerpt: t.excerpt,
                  content: t.content,
                  seo_title: t.seo_title,
                  seo_description: t.seo_description,
                  seo_keywords: t.seo_keywords,
                  og_image_url: t.og_image_url,
                }),
              });
            } catch { /* additional translation save failed, but main save succeeded */ }
          }
        }

        setSaveMessage({ type: 'success', text: 'Post saved successfully.' });
        fetchPosts();
      } else {
        const err = await res.json().catch(() => ({ error: 'Save failed' }));
        setSaveMessage({ type: 'error', text: err.error || 'Save failed' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Save failed — network error.' });
    }
    setSaving(false);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (res.ok) {
        setDeleteTarget(null);
        fetchPosts();
      }
    } finally {
      setDeleting(false);
    }
  };

  const activeTrans = translations[activeLocale] || {
    locale: activeLocale,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_image_url: '',
  };

  // --- Editor View ---
  if (view === 'editor') {
    return (
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToList}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              &larr; Back to posts
            </button>
            <h1 className="text-2xl font-heading font-bold text-cm-slate-900">
              {editPostId ? 'Edit Post' : 'New Post'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <AiAssistant
              currentContent={activeTrans.content}
              currentLocale={activeLocale}
              targetLocales={[...LOCALES]}
              onInsertContent={(html) => {
                setTranslations((prev) => ({
                  ...prev,
                  [activeLocale]: { ...prev[activeLocale], content: html },
                }));
              }}
              onSuggestTags={(tags) => {
                tags.forEach((name) => {
                  const existing = allTags.find(
                    (t) => t.name.toLowerCase() === name.toLowerCase()
                  );
                  if (existing && !selectedTags.find((s) => s.id === existing.id)) {
                    setSelectedTags((prev) => [...prev, existing]);
                  }
                  if (!existing) {
                    fetch('/api/admin/blog/tags', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name }),
                    })
                      .then((r) => r.json())
                      .then((json) => {
                        if (json.tag) {
                          setAllTags((prev) => [...prev, json.tag]);
                          setSelectedTags((prev) => [...prev, json.tag]);
                        }
                      });
                  }
                });
              }}
              onSuggestSeo={(seo) => {
                setTranslations((prev) => ({
                  ...prev,
                  [activeLocale]: {
                    ...prev[activeLocale],
                    seo_title: seo.title,
                    seo_description: seo.description,
                    seo_keywords: seo.keywords || '',
                  },
                }));
              }}
              postId={editPostId || undefined}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#006d77] hover:bg-[#005a63] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>

        {/* Save notification toast */}
        {saveMessage && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              saveMessage.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {saveMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {saveMessage.text}
            <button
              onClick={() => setSaveMessage(null)}
              className="ml-auto text-current opacity-50 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Status row */}
        <div className="flex items-center gap-4 bg-white rounded-xl border border-[#E9ECEF] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
              className="text-sm border border-[#E9ECEF] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#006d77]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded accent-[#006d77]"
            />
            <Star
              size={14}
              className={isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}
            />
            Featured
          </label>
          <div className="flex-1" />
          {/* Featured image upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E9ECEF] bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <Upload size={12} />
            Feature Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Locale Tabs */}
        <div className="flex gap-1 border-b border-[#E9ECEF]">
          {LOCALES.map((locale) => {
            const hasContent = translations[locale]?.title?.trim().length > 0;
            return (
              <button
                key={locale}
                onClick={() => setActiveLocale(locale)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeLocale === locale
                    ? 'border-[#006d77] text-[#006d77]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {LOCALE_LABELS[locale]}
                {hasContent && (
                  <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-[#006d77]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder={`Title (${LOCALE_LABELS[activeLocale]})`}
            value={activeTrans.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-3 text-lg font-semibold border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006d77]"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Slug</label>
          <input
            type="text"
            placeholder="post-url-slug"
            value={activeTrans.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-[#E9ECEF] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#006d77]"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Excerpt</label>
          <textarea
            placeholder="Brief description for preview cards"
            value={activeTrans.excerpt}
            onChange={(e) =>
              setTranslations((prev) => ({
                ...prev,
                [activeLocale]: { ...prev[activeLocale], excerpt: e.target.value },
              }))
            }
            rows={2}
            className="w-full px-4 py-2 text-sm border border-[#E9ECEF] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#006d77]"
          />
        </div>

        {/* Editor */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Content</label>
          <BlogEditor
            content={activeTrans.content}
            onChange={(html, wordCount) => {
              setTranslations((prev) => ({
                ...prev,
                [activeLocale]: {
                  ...prev[activeLocale],
                  content: html,
                },
              }));
            }}
            postId={editPostId || undefined}
          />
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-[#E9ECEF] p-4 space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">Tags</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[#006d77]/10 text-[#006d77]"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search or create tags..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const existing = allTags.find(
                    (t) => t.name.toLowerCase() === tagInput.trim().toLowerCase()
                  );
                  if (existing) addTag(existing);
                  else createTag();
                }
              }}
              className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006d77]"
            />
            {tagInput && filteredTags.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E9ECEF] rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#006d77]/5 text-slate-700"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            {tagInput && filteredTags.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E9ECEF] rounded-lg shadow-lg z-20">
                <button
                  type="button"
                  onClick={createTag}
                  className="w-full text-left px-3 py-2 text-sm text-[#006d77] hover:bg-[#006d77]/5"
                >
                  Create &ldquo;{tagInput.trim()}&rdquo;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SEO Panel */}
        <div className="bg-white rounded-xl border border-[#E9ECEF] overflow-hidden">
          <button
            type="button"
            onClick={() => setSeoOpen(!seoOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              {seoOpen ? <EyeOff size={14} /> : <Eye size={14} />}
              SEO Settings ({LOCALE_LABELS[activeLocale]})
            </span>
            {seoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {seoOpen && (
            <div className="px-4 pb-4 space-y-3 border-t border-[#E9ECEF] pt-3">
              <div>
                <label className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>SEO Title</span>
                  <span className={activeTrans.seo_title.length > 60 ? 'text-red-500' : ''}>
                    {activeTrans.seo_title.length}/60
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="SEO-optimized title"
                  value={activeTrans.seo_title}
                  onChange={(e) =>
                    setTranslations((prev) => ({
                      ...prev,
                      [activeLocale]: { ...prev[activeLocale], seo_title: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006d77]"
                />
              </div>
              <div>
                <label className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>SEO Description</span>
                  <span
                    className={
                      activeTrans.seo_description.length > 160 ? 'text-red-500' : ''
                    }
                  >
                    {activeTrans.seo_description.length}/160
                  </span>
                </label>
                <textarea
                  placeholder="Compelling meta description"
                  value={activeTrans.seo_description}
                  onChange={(e) =>
                    setTranslations((prev) => ({
                      ...prev,
                      [activeLocale]: {
                        ...prev[activeLocale],
                        seo_description: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#006d77]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">SEO Keywords</label>
                <input
                  type="text"
                  placeholder="comma, separated, keywords"
                  value={activeTrans.seo_keywords}
                  onChange={(e) =>
                    setTranslations((prev) => ({
                      ...prev,
                      [activeLocale]: { ...prev[activeLocale], seo_keywords: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006d77]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">OG Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={activeTrans.og_image_url}
                  onChange={(e) =>
                    setTranslations((prev) => ({
                      ...prev,
                      [activeLocale]: {
                        ...prev[activeLocale],
                        og_image_url: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006d77]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-cm-slate-900">Blog Posts</h1>
          <p className="text-cm-slate-500 mt-1">Manage your content and publications.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#006d77] hover:bg-[#005a63] text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
        >
          <Plus size={16} />
          Create Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-cm-slate-200 overflow-hidden card-conseil">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cm-slate-600">
            <thead className="bg-cm-slate-50 border-b border-cm-slate-200 text-xs uppercase font-semibold text-cm-slate-500">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Locales</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-slate-200">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <Loader2 size={20} className="animate-spin inline text-slate-400" />
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-red-500">{error}</td>
                </tr>
              )}
              {!loading && posts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-cm-slate-500">
                    No blog posts found. Click &ldquo;Create Post&rdquo; to get started.
                  </td>
                </tr>
              )}
              {paginatedPosts.map((post) => {
                const enTranslation = post.translations?.find(
                  (t) => t.locale === 'en'
                ) || post.translations?.[0];
                return (
                  <tr key={post.id} className="hover:bg-cm-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-cm-slate-900 max-w-xs truncate">
                      {enTranslation?.title || 'Untitled'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Globe size={12} className="text-slate-400" />
                        <span className="text-xs">{post.translations?.length || 0}/5</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(post.tags || []).slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-0.5 text-xs rounded-full bg-[#006d77]/10 text-[#006d77]"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {(post.tags || []).length > 2 && (
                          <span className="text-xs text-slate-400">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          post.status === 'published'
                            ? 'bg-cm-eucalyptus-light text-cm-eucalyptus'
                            : 'bg-cm-slate-100 text-cm-slate-700'
                        }`}
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {post.is_featured && (
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => loadPostForEdit(post)}
                        className="text-[#006d77] hover:text-[#004d55] font-medium text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={posts.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deleteTarget?.translations?.[0]?.title || 'this post'}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}
