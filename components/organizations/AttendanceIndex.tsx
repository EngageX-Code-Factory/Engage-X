"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, Calendar, QrCode, Users, 
  Search, Eye, Loader2, Clock 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AttendanceIndex() {
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegs: 0, totalAttended: 0 });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  async function fetchAttendanceData() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: leader } = await supabase.from('my_clubs').select('club_id').eq('user_id', user?.id).eq('status', 'LEADER').single();

    if (leader) {
      const { data: evs } = await supabase
        .from('events')
        .select('id, title, event_date, location')
        .eq('club_id', leader.club_id)
        .order('event_date', { ascending: false });

      if (evs) {
        const eventIds = evs.map(e => e.id);
        const { data: regs } = await supabase.from('my_events').select('event_id').in('event_id', eventIds);
        const { data: qrs } = await supabase.from('qr_tokens').select('event_id').in('event_id', eventIds).eq('is_used', true);
        
        const combined = evs.map(ev => {
          const rCount = regs?.filter(r => r.event_id === ev.id).length || 0;
          const aCount = qrs?.filter(q => q.event_id === ev.id).length || 0;
          return { 
            ...ev, 
            registered: rCount, 
            attended: aCount, 
            rate: rCount > 0 ? Math.round((aCount / rCount) * 100) : 0 
          };
        });

        setEvents(combined);
        setStats({
          totalEvents: evs.length,
          totalRegs: regs?.length || 0,
          totalAttended: qrs?.length || 0
        });
      }
    }
    setIsLoading(false);
  }

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="flex h-60 items-center justify-center"><Loader2 className="animate-spin text-[#8b5cf6]" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-white">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold">Attendance Tracking</h2>
        <p className="text-sm text-gray-400 mt-1">Monitor event turnout and verify presence via QR scan data.</p>
      </div>

      {/* STATS SECTION */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#8b5cf6] flex items-center gap-2">
          <BarChart3 size={16} /> Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Live Events" val={stats.totalEvents} icon={Calendar} color="text-purple-500" />
          <SummaryCard label="Total Interest" val={stats.totalRegs} icon={Users} color="text-blue-500" />
          <SummaryCard label="Verified Scans" val={stats.totalAttended} icon={QrCode} color="text-emerald-500" />
        </div>
      </section>

      {/* TABLE SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
            <Clock size={16} /> Event Roster ({events.length})
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events..." 
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:border-[#8b5cf6] transition-all w-64"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Event Identity</th>
                <th className="px-6 py-4 font-semibold text-center">Registrations</th>
                <th className="px-6 py-4 font-semibold text-center">QR Scans</th>
                <th className="px-6 py-4 font-semibold text-center">Turnout</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvents.map(event => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex flex-col items-center justify-center text-purple-400 border border-purple-500/20">
                        <span className="text-[10px] font-bold leading-none">{new Date(event.event_date).getDate()}</span>
                        <span className="text-[7px] uppercase font-black">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-[#8b5cf6] transition-colors">{event.title}</p>
                        <p className="text-[10px] text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400 font-medium">{event.registered}</td>
                  <td className="px-6 py-4 text-center text-emerald-400 font-bold">{event.attended}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[9px] font-bold text-gray-500">{event.rate}%</span>
                      <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${event.rate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/organization/attendance/${event.id}`} className="p-2 text-gray-500 hover:text-[#8b5cf6] transition-colors">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, val, icon: Icon, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${color}/20 bg-opacity-20 flex items-center justify-center ${color} font-bold`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
        <p className="text-xl font-bold">{val}</p>
      </div>
    </div>
  );
}