"use client";

import { useState } from "react";
import { Users, Check, X, Trash2, Search } from "lucide-react";

type MemberStatus = "approved" | "pending" | "rejected";
interface Member {
  id: string; name: string; email: string;
  role: string; status: MemberStatus; joined_at: string;
}

const DUMMY_MEMBERS: Member[] = [
  { id: "1", name: "Ashan Perera", email: "ashan@nibm.lk", role: "member", status: "approved", joined_at: "2025-03-01" },
  { id: "2", name: "Nimasha Silva", email: "nimasha@nibm.lk", role: "member", status: "approved", joined_at: "2025-03-05" },
  { id: "3", name: "Ravindu Fernando", email: "ravindu@nibm.lk", role: "member", status: "pending", joined_at: "2025-04-10" },
  { id: "4", name: "Shalomi Jayawardena", email: "shalomi@nibm.lk", role: "member", status: "pending", joined_at: "2025-04-11" },
];

const STATUS_STYLES: Record<MemberStatus, string> = {
  approved: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  rejected: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

type Tab = "all" | "pending";

export default function Members() {
  const [members, setMembers] = useState<Member[]>(DUMMY_MEMBERS);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const pendingCount = members.filter(m => m.status === "pending").length;
  const filtered = members
    .filter(m => tab === "pending" ? m.status === "pending" : m.status !== "rejected")
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  function approve(id: string) { setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "approved" } : m)); }
  function reject(id: string) { setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "rejected" } : m)); }
  function remove(id: string) { if (confirm("Remove this member?")) setMembers(prev => prev.filter(m => m.id !== id)); }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Members & Requests</h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Manage club members and approve join requests.</p>
        </div>
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <Users size={18} className="text-[#8b5cf6]" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active members</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-none mt-0.5">
              {members.filter(m => m.status === "approved").length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
          {(["all", "pending"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? "bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              }`}>
              {t === "pending" ? "Pending Requests" : "All Members"}
              {t === "pending" && pendingCount > 0 && (
                <span className="bg-[#8b5cf6] text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]" />
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              {["Member", "Joined", "Status", "Actions"].map(h => (
                <th key={h} className={`px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-16 text-center">
                <Users size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">{tab === "pending" ? "No pending requests." : "No members found."}</p>
              </td></tr>
            ) : filtered.map(member => (
              <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(member.joined_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[member.status]}`}>{member.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {member.status === "pending" && (<>
                      <button onClick={() => approve(member.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                        <Check size={13} /> Approve
                      </button>
                      <button onClick={() => reject(member.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                        <X size={13} /> Reject
                      </button>
                    </>)}
                    {member.status === "approved" && (
                      <button onClick={() => remove(member.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}