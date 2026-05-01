import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminBlogPage() {
  const supabase = await createSupabaseServerClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-cm-slate-900">
            Blog Posts
          </h1>
          <p className="text-cm-slate-500 mt-1">
            Manage your content and publications.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-cm-navy hover:bg-cm-navy-light text-white font-semibold rounded-xl shadow-sm transition-colors text-sm">
          Create Post
        </button>
      </div>

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
                  <td colSpan={4} className="px-6 py-8 text-center text-red-500">
                    Failed to load posts
                  </td>
                </tr>
              )}
              {posts?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-cm-slate-500">
                    No blog posts found. Click "Create Post" to get started.
                  </td>
                </tr>
              )}
              {posts?.map((post) => (
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
                    <button className="text-cm-slate-500 hover:text-cm-navy font-medium text-sm transition-colors">
                      View
                    </button>
                    <button className="text-cm-sky hover:text-cm-navy font-medium text-sm transition-colors">
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
