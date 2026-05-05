import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-cm-slate-900">
            User Management
          </h1>
          <p className="text-cm-slate-500 mt-1">
            View and manage all registered users.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cm-slate-600">
            <thead className="bg-cm-slate-50 border-b border-[#E9ECEF] text-xs uppercase font-semibold text-cm-slate-500">
              <tr>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Premium</th>
                <th className="px-6 py-4">Expires</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF]">
              {error && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-red-500">
                    Failed to load users
                  </td>
                </tr>
              )}
              {profiles?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-cm-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
              {profiles?.map((profile) => (
                <tr key={profile.id} className="hover:bg-cm-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{profile.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      profile.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-cm-slate-100 text-cm-slate-700'
                    }`}>
                      {profile.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      profile.tier === 'premium' ? 'bg-cm-gold-light text-cm-gold' :
                      profile.tier === 'pro' ? 'bg-cm-teal/10 text-cm-teal' :
                      profile.tier === 'sprint_pass' ? 'bg-purple-100 text-purple-700' :
                      'bg-cm-slate-100 text-cm-slate-600'
                    }`}>
                      {profile.tier || 'free'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {profile.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-cm-eucalyptus">
                        <span className="w-2 h-2 rounded-full bg-cm-eucalyptus" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-cm-slate-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {profile.premium_expires_at
                      ? new Date(profile.premium_expires_at).toLocaleDateString()
                      : <span className="text-cm-slate-400">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
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
