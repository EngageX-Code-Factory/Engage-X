"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Users, CheckCircle, XCircle, Download } from "lucide-react";

interface AttendeeRecord {
  id: string; name: string; email: string; registered_at: string; attended: boolean;
}

const DUMMY_ATTENDEES: AttendeeRecord[] = [
  { id: "1", name: "Ashan Perera", email: "ashan@nibm.lk", registered_at: "2025-04-01", attended: true },
  { id: "2", name: "Nimasha Silva", email: "nimasha@nibm.lk", registered_at: "2025-04-02", attended: true },
  { id: "3", name: "Ravindu Fernando", email: "ravindu@nibm.lk", registered_at: "2025-04-03", attended: false },
  { id: "4", name: "Shalomi Jayawardena", email: "shalomi@nibm.lk", registered_at: "2025-04-03", attended: false },
  { id: "5", name: "Dilshan Kumara", email: "dilshan@nibm.lk", registered_at: "2025-04-04", attended: true },
  { id: "6", name: "Kavya Mendis", email: "kavya@nibm.lk", registered_at: "2025-04-04", attended: false },
];

export default function AttendanceDetail() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "attended" | "absent">("all");

  const attended = DUMMY_ATTENDEES.filter(a => a.attended).length;
  const total = DUMMY_ATTENDEES.length;
  const rate = Math.round((attended / total) * 100);

  const filtered = DUMMY_ATTENDEES
    .filter(a => filter === "all" ? true : filter === "attended" ? a.attended : !a.attended)
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/organization/attendance" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Talk 2025</h2>
          <p className="text-sm mt-0.5 text-gray-500 dark:text-gray-400">Attendance report · 10 Apr 2025, 14:00 · Hall A</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Registered", value: total, color: "text-gray-900 dark:text-white" },
          { label: "Attended", value: attended, color: "text-green-600 dark:text-green-400" },
          { label: "Attendance Rate", value: `${rate}%`, color: "text-[#8b5cf6]", bar: true },
        ].map(({ label, value, color, bar }) => (
          <div key={label} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            {bar && <div className="mt-3 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: `${rate}%` }} />
            </div>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
          {(["all", "attended", "absent"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f ? "bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              }`}>{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] w-52" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              {["Student", "Registered", "Attendance"].map(h => (
                <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {filtered.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-16 text-center">
                <Users size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No records found.</p>
              </td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{a.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{a.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {new Date(a.registered_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  {a.attended
                    ? <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-medium text-xs bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-full w-fit"><CheckCircle size={13} /> Attended</span>
                    : <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium text-xs bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-full w-fit"><XCircle size={13} /> Absent</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}