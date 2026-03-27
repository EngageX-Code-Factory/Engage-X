'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Calendar, Users, CheckCircle2, Clock, Search, 
  ChevronLeft, Loader2, Plus, X, Trash2, MapPin, 
  Activity, ShieldAlert, BarChart3, Edit3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- TYPES mapped to your specific DB schema ---
interface ClubEvent {
  id: string;
  title: string;
  event_date: string;
  event_time: string;      // Start Time
  event_end_time: string;  // End Time
  location: string;
  attendees: number;
  status: 'OPEN' | 'FILLED' | 'SOON' | 'CLOSED';
  category: string;
  clubs?: { club_name: string; clubid: string };
  real_attendance?: number;
}

export default function EventMonitoring() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [clubs, setClubs] = useState<{clubid: string, club_name: string}[]>([]);
  const [stats, setStats] = useState({ total: 0, regs: 0, attendance: 0, open: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // Form State for new creation
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    club_id: '', 
    event_date: '', 
    location: '',
    event_time: '10:00',
    event_end_time: '12:00',
    status: 'OPEN' as const,
    category: 'General',
    attendees: 50 
  });

  const fetchData = useCallback(async () => {
    const { data: eventData } = await supabase
      .from('events')
      .select(`*, clubs(clubid, club_name)`)
      .order('event_date', { ascending: false });

    const { data: clubData } = await supabase.from('clubs').select('clubid, club_name');
    const { data: attendeeData } = await supabase.from('my_events').select('event_id, attended');

    if (eventData) {
      const processedEvents = eventData.map((ev: any) => {
        const eventRegs = attendeeData?.filter(a => a.event_id === ev.id) || [];
        const actualAttendees = eventRegs.filter(a => a.attended === true).length;
        return { ...ev, real_attendance: actualAttendees };
      });

      setEvents(processedEvents);
      setClubs(clubData || []);

      const totalRegs = attendeeData?.length || 0;
      const openCount = processedEvents.filter(e => e.status === 'OPEN').length;
      const totalAttended = attendeeData?.filter(a => a.attended).length || 0;

      setStats({
        total: processedEvents.length,
        regs: totalRegs,
        attendance: totalRegs > 0 ? Math.round((totalAttended / totalRegs) * 100) : 0,
        open: openCount
      });
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- PERSISTENT DATABASE UPDATES ---
  const updateEventDetails = async (eventId: string, updates: Partial<ClubEvent>) => {
    setUpdatingId(eventId);
    const { error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId);

    if (error) {
      alert("Database error: " + error.message);
      fetchData(); // Reset on failure
    } else {
      setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, ...updates } : ev));
    }
    setUpdatingId(null);
  };

  const updateStatus = async (eventId: string, newStatus: string) => {
    const { error } = await supabase.from('events').update({ status: newStatus }).eq('id', eventId);
    if (!error) fetchData();
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('events').insert([newEvent]);
    if (!error) {
      setIsModalOpen(false);
      fetchData();
    } else {
      alert(error.message);
    }
  };

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (
    <div className="h-screen bg-[#080c14] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0] font-sans p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <Link href="/admin" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1 mb-4 group transition-colors">
              <ChevronLeft size={16} /> Back to Overview
            </Link>
            <h1 className="text-4xl font-extrabold text-white mb-2 italic uppercase">Event Monitoring</h1>
            <p className="text-slate-500 font-medium">Synchronized with Supabase Cloud</p>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2">
            <Plus size={20} /> Add Event
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Ledger Total" value={stats.total} icon={<Calendar size={20}/>} color="text-blue-400" bg="bg-blue-500/10" />
          <StatCard title="Total Regs" value={stats.regs} icon={<Users size={20}/>} color="text-purple-400" bg="bg-purple-500/10" />
          <StatCard title="Avg Attendance" value={`${stats.attendance}%`} icon={<Activity size={20}/>} color="text-emerald-400" bg="bg-emerald-500/10" />
          <StatCard title="Open Slots" value={stats.open} icon={<ShieldAlert size={20}/>} color="text-amber-400" bg="bg-amber-500/10" />
        </div>

        {/* Data Table */}
        <div className="bg-[#0d1320] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Event & Host</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Schedule (Start - End)</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Capacity Range</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="px-8 py-6">
                    <p className="font-bold text-white text-md">{event.title}</p>
                    <p className="text-xs text-blue-400 font-bold uppercase">{event.clubs?.club_name}</p>
                  </td>
                  
                  {/* --- REAL-TIME TIME UPDATER --- */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <input 
                        type="time"
                        defaultValue={event.event_time}
                        onBlur={(e) => updateEventDetails(event.id, { event_time: e.target.value })}
                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-blue-400 focus:border-blue-500 outline-none"
                        title="Start Time"
                      />
                      <span className="text-slate-600">—</span>
                      <input 
                        type="time"
                        defaultValue={event.event_end_time}
                        onBlur={(e) => updateEventDetails(event.id, { event_end_time: e.target.value })}
                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-purple-400 focus:border-purple-500 outline-none"
                        title="End Time"
                      />
                    </div>
                    <p className="text-[10px] font-mono text-slate-600 mt-2 uppercase">{event.event_date}</p>
                  </td>

                  <td className="px-8 py-6">
                    <div className="relative w-28">
                      <input 
                        type="number"
                        defaultValue={event.attendees}
                        onBlur={(e) => updateEventDetails(event.id, { attendees: parseInt(e.target.value) })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-blue-500 outline-none"
                      />
                      {updatingId === event.id && <Loader2 size={12} className="absolute right-2 top-3 animate-spin text-blue-500" />}
                    </div>
                  </td>

                  <td className="px-8 py-6"><StatusBadge status={event.status} /></td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {['OPEN', 'CLOSED', 'SOON'].filter(s => s !== event.status).map(s => (
                        <button key={s} onClick={() => updateStatus(event.id, s)} className="px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg text-[9px] font-black uppercase hover:bg-white/10 hover:text-white transition-all">
                          Set {s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-[#0d1320] w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl border border-white/10 relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter">Initialize Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input required className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-white" placeholder="Event Title" onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select required className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-white text-sm" onChange={(e) => setNewEvent({...newEvent, club_id: e.target.value})}>
                  <option value="">Select Identity</option>
                  {clubs.map(c => <option key={c.clubid} value={c.clubid}>{c.club_name}</option>)}
                </select>
                <input type="date" required className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-white text-sm" onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="time" required className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-white text-sm" title="Start Time" onChange={(e) => setNewEvent({...newEvent, event_time: e.target.value})} />
                <input type="time" required className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-white text-sm" title="End Time" onChange={(e) => setNewEvent({...newEvent, event_end_time: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-white" placeholder="Location" onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} />
                <input type="number" required className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-white" placeholder="Capacity" onChange={(e) => setNewEvent({...newEvent, attendees: parseInt(e.target.value)})} />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl mt-6 uppercase tracking-widest text-xs transition-all">Authorize Event Launch</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ... StatCard and StatusBadge sub-components remain consistent ...
function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="bg-[#0d1320] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
      <div className={`absolute right-6 top-6 p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{title}</p>
      <h4 className="text-4xl font-extrabold text-white italic">{value}</h4>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    OPEN: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    SOON: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    FILLED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    CLOSED: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  return <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>● {status}</span>;
}
