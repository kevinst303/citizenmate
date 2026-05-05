'use client';

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', content: '', published: false });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { data, error: err } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSave = async () => {
    const res = await fetch('/api/admin/blog', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm({ title: '', slug: '', content: '', published: false });
      fetchPosts();
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({ title: post.title, slug: post.slug, content: post.content, published: post.published });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm({ title: '', slug: '', content: '', published: false });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-cm-slate-900">Blog Posts</h1>
          <p className="text-cm-slate-500 mt-1">Manage your content and publications.</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-5 py-2.5 bg-cm-navy hover:bg-cm-navy-light text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
        >
          Create Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 space-y-4" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
          <h3 className="text-lg font-heading font-bold text-cm-slate-900">
            {editingId ? 'Edit Post' : 'New Post'}
          </h3>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border border-cm-slate-200 rounded-xl text-sm"
          />
          <input
            type="text"
            placeholder="slug-url"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-4 py-2 border border-cm-slate-200 rounded-xl text-sm"
          />
          <textarea
            placeholder="Content (HTML supported)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-cm-slate-200 rounded-xl text-sm font-mono"
          />
          <label className="flex items-center gap-2 text-sm text-cm-slate-600">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-cm-teal text-white font-semibold rounded-xl text-sm"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 bg-cm-slate-100 text-cm-slate-700 font-medium rounded-xl text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cm-slate-600">
            <thead className="bg-cm-slate-50 border-b border-[#E9ECEF] text-xs uppercase font-semibold text-cm-slate-500">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF]">
              {error && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-red-500">Failed to load posts</td>
                </tr>
              )}
              {!loading && posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-cm-slate-500">
                    No blog posts found. Click &ldquo;Create Post&rdquo; to get started.
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-cm-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-cm-slate-900">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      post.published ? 'bg-cm-eucalyptus-light text-cm-eucalyptus' : 'bg-cm-slate-100 text-cm-slate-700'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-cm-sky hover:text-cm-navy font-medium text-sm transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
