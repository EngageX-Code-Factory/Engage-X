import Link from "next/link";
import { Eye, QrCode } from "lucide-react";

const DUMMY_EVENTS = [
  { id: "1", title: "Tech Talk 2025", date: "2025-04-10", venue: "Hall A", registered: 6, attended: 3 },
  { id: "2", title: "Leadership Workshop", date: "2025-04-18", venue: "Room 201", registered: 12, attended: 10 },
  { id: "3", title: "Annual Sports Meet", date: "2025-05-02", venue: "Main Ground", registered: 45, attended: 38 },
];

export default function AttendanceIndex() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">View attendance records for each event.</p>
        </div>
        <Link href="/organization/attendance/scan"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-xl transition-colors">
          <QrCode size={16} /> Scan QR
        </Link>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              {["Event", "Date", "Venue", "Registered", "Attended", "Rate", "View"].map((h, i) => (
                <th key={h} className={`px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${i === 6 ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {DUMMY_EVENTS.map(e => {
              const rate = Math.round((e.attended / e.registered) * 100);
              return (
                <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{e.title}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{e.venue}</td>
                  <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{e.registered}</td>
                  <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">{e.attended}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/organization/attendance/${e.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8b5cf6] bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-lg transition-colors">
                      <Eye size={13} /> View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}