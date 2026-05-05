"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, Filter, ChevronDown } from "lucide-react";
import { Pagination } from "@/components/admin/pagination";
import { UserEditModal } from "@/components/admin/user-edit-modal";

interface UserProfile {
  id: string;
  display_name: string | null;
  email: string | null;
  is_admin: boolean;
  tier: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  suspended: boolean | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const pageSize = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: UserProfile) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-cm-slate-900">User Management</h1>
          <p className="text-cm-slate-500 mt-1">View and manage all registered users.</p>
        </div>
      </div>

      <div className="card-conseil">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cm-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-cm-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="appearance-none pl-10 pr-8 py-2.5 text-sm border border-cm-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cm-teal/20 focus:border-cm-teal transition-colors"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cm-slate-400 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cm-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin text-cm-slate-400" />
            <span className="ml-2 text-cm-slate-500 text-sm">Loading users...</span>
          </div>
        ) : error ? (
          <div className="bg-cm-red-light border border-cm-red/20 rounded-xl p-6 text-center">
            <p className="text-cm-red font-medium">{error}</p>
            <button onClick={fetchUsers} className="mt-3 text-sm text-cm-red underline hover:no-underline">Try again</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-cm-slate-600">
                <thead className="bg-cm-slate-50 border-b border-cm-slate-100 text-xs uppercase font-semibold text-cm-slate-500">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Tier</th>
                    <th className="px-6 py-4">Premium</th>
                    <th className="px-6 py-4">Expires</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cm-slate-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-cm-slate-500">No users found.</td>
                    </tr>
                  ) : (
                    users.map((profile) => (
                      <tr key={profile.id} className="hover:bg-cm-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-cm-slate-800 text-sm">{profile.display_name || "Unnamed"}</p>
                            <p className="text-xs text-cm-slate-400">{profile.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-cm-slate-500">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            profile.is_admin ? "bg-purple-100 text-purple-700" : "bg-cm-slate-100 text-cm-slate-700"
                          }`}>
                            {profile.is_admin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            profile.tier === "premium" ? "bg-cm-gold-light text-cm-gold" :
                            profile.tier === "pro" ? "bg-cm-teal/10 text-cm-teal" :
                            profile.tier === "sprint_pass" ? "bg-purple-100 text-purple-700" :
                            "bg-cm-slate-100 text-cm-slate-600"
                          }`}>
                            {profile.tier || "free"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {profile.is_premium ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-cm-eucalyptus">
                              <span className="w-2 h-2 rounded-full bg-cm-eucalyptus" /> Yes
                            </span>
                          ) : (
                            <span className="text-xs text-cm-slate-400">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          {profile.premium_expires_at
                            ? new Date(profile.premium_expires_at).toLocaleDateString()
                            : <span className="text-cm-slate-400">&mdash;</span>}
                        </td>
                        <td className="px-6 py-4">
                          {profile.suspended ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-cm-red">
                              <span className="w-2 h-2 rounded-full bg-cm-red" /> Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-cm-eucalyptus">
                              <span className="w-2 h-2 rounded-full bg-cm-eucalyptus" /> Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEdit(profile)}
                            className="text-cm-teal hover:text-cm-teal-dark font-medium text-sm transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
          </>
        )}
      </div>

      <UserEditModal
        open={showEditModal}
        user={editUser}
        onSave={fetchUsers}
        onClose={() => { setShowEditModal(false); setEditUser(null); }}
      />
    </div>
  );
}
