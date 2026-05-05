"use client";

import { Search, CheckCircle2, Clock, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import type { ReferralActivityItem } from "./referral-dashboard";
import { Pagination } from "./pagination";

const PAGE_SIZE = 15;

interface Props {
  activity: ReferralActivityItem[];
}

type SortField = "created_at" | "referrer_name" | "referee_name" | "qualified";
type FilterStatus = "all" | "qualified" | "pending";

export function ReferralActivity({ activity }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...activity];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.referrer_name?.toLowerCase().includes(q) ||
          r.referee_name?.toLowerCase().includes(q) ||
          r.referrer_email?.toLowerCase().includes(q) ||
          r.referee_email?.toLowerCase().includes(q)
      );
    }

    if (filter === "qualified") {
      result = result.filter((r) => r.qualified);
    } else if (filter === "pending") {
      result = result.filter((r) => !r.qualified);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "created_at":
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "referrer_name":
          cmp = (a.referrer_name || "").localeCompare(b.referrer_name || "");
          break;
        case "referee_name":
          cmp = (a.referee_name || "").localeCompare(b.referee_name || "");
          break;
        case "qualified":
          cmp = (a.qualified ? 1 : 0) - (b.qualified ? 1 : 0);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [activity, search, filter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cm-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-cm-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cm-sky/20 focus:border-cm-sky transition-colors"
          />
        </div>
        <div className="flex gap-1.5 bg-cm-slate-50 rounded-xl p-1">
          {(["all", "qualified", "pending"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === f
                  ? "bg-white text-cm-navy shadow-sm"
                  : "text-cm-slate-500 hover:text-cm-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border border-cm-slate-200 overflow-hidden card-conseil"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cm-slate-600">
            <thead className="bg-cm-slate-50 border-b border-cm-slate-200 text-xs uppercase font-semibold text-cm-slate-500">
              <tr>
                <SortableHeader label="Referrer" field="referrer_name" active={sortField} asc={sortAsc} onSort={handleSort} />
                <SortableHeader label="Referee" field="referee_name" active={sortField} asc={sortAsc} onSort={handleSort} />
                <SortableHeader label="Status" field="qualified" active={sortField} asc={sortAsc} onSort={handleSort} />
                <th className="px-5 py-3.5">Reward</th>
                <SortableHeader label="Date" field="created_at" active={sortField} asc={sortAsc} onSort={handleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-slate-200">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-cm-slate-400">
                    {search || filter !== "all"
                      ? "No matching referrals found"
                      : "No referral activity yet"}
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.id} className="hover:bg-cm-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-cm-slate-800 text-sm">{item.referrer_name}</p>
                        <p className="text-xs text-cm-slate-400">{item.referrer_email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-cm-slate-800 text-sm">{item.referee_name}</p>
                        <p className="text-xs text-cm-slate-400">{item.referee_email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.qualified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {item.qualified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.qualified ? "Qualified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-cm-teal">+{item.reward_days} days</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                      {new Date(item.created_at).toLocaleDateString("en-AU", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

function SortableHeader({
  label, field, active, asc, onSort,
}: {
  label: string;
  field: SortField;
  active: SortField;
  asc: boolean;
  onSort: (field: SortField) => void;
}) {
  return (
    <th className="px-5 py-3.5">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:text-cm-slate-700 transition-colors"
      >
        {label}
        <ArrowUpDown className={`w-3 h-3 ${active === field ? "text-cm-sky" : "text-cm-slate-300"}`} />
      </button>
    </th>
  );
}
