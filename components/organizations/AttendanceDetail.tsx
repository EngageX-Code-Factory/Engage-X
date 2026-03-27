"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, CheckCircle2, XCircle, ShieldCheck, Mail, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AttendanceDetails() {
  const params = useParams();
  const eventId = params?.id as string;
  const supabase = createClient();

  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoster() {
      if (!eventId) return;
      
      const { data: ev } = await supabase.from('events').select('*').eq('id', eventId).single();
      setEvent(ev);

      // Get registrations AND QR status
      const { data: regs } = await supabase.from('my_events').select('*').eq('event_id', eventId);
      const { data: qrs } = await supabase.from('qr_tokens').select('user_id, is_used').eq('event_id', eventId);

      if (regs) {
        const roster = regs.map(r => ({
          user_id: r.user_id,
          name: r.full_name,
          email: r.email,
          student_id: r.student_id,
          is_verified: qrs?.find(q => q.user_id === r.user_id)?.is_used || false
        }));
        setAttendees(roster);
      }
      setIsLoading(false);
    }
    fetchRoster();
  }, [eventId]);

  async function toggleVerification(userId: string, currentStatus: boolean) {
    // Optimistic UI Update
    setAttendees(prev => prev.map(a => a.user_id === userId ? { ...a, is_verified: !currentStatus } : a));

    const { data: token } = await supabase.from('qr_tokens').select('id').eq('user_id', userId).eq('event_id', eventId).single();

    if (token) {
      await supabase.from('qr_tokens').update({ is_used: !currentStatus }).eq('id', token.id);
    } else if (!currentStatus === true) {
      // Create manual entry if they don't have a token row yet
      await supabase.from('qr_tokens').insert({
        user_id: userId,
        event_id: eventId,
        token: `MANUAL-${userId}`,
        is_used: true,
        expires_at: new Date(Date.now() + 86400000).toISOString()
      });
    }
  }

  const filtered = attendees.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.student_id.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 text-white">
      <div className="flex items-center gap-6">
        <Link href="/organization/attendance" className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 transition-all"><ArrowLeft size={20}/></Link>
        <div>
          <h2 className="text-3xl font-black">{event?.title}</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{new Date(event?.event_date).toDateString()} • {event?.location}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
           <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                placeholder="Search by name or student ID..."
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-purple-500 transition-all text-sm"
                value={search} onChange={e => setSearch(e.target.value)}
              />
           </div>
           <div className="flex gap-4">
              <StatBox label="Registered" val={attendees.length} color="text-white" />
              <StatBox label="Verified" val={attendees.filter(a => a.is_verified).length} color="text-emerald-400" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                <th className="pb-4 px-4">Student Identity</th>
                <th className="pb-4 px-4">Student ID</th>
                <th className="pb-4 px-4 text-right">QR Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((a, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 font-bold uppercase">{a.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-bold">{a.name}</p>
                        <p className="text-[10px] text-gray-500">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-sm font-medium text-gray-400">{a.student_id}</td>
                  <td className="py-5 px-4 text-right">
                    <button 
                      onClick={() => toggleVerification(a.user_id, a.is_verified)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${a.is_verified ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-gray-500 border border-white/10 hover:border-purple-500/40'}`}
                    >
                      {a.is_verified ? <ShieldCheck size={14}/> : <XCircle size={14}/>}
                      {a.is_verified ? 'Verified' : 'Unverified'}
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

function StatBox({ label, val, color }: any) {
  return (
    <div className="px-6 py-3 bg-black/20 rounded-2xl border border-white/5 text-center min-w-[100px]">
      <p className="text-[9px] font-black text-gray-500 uppercase mb-1">{label}</p>
      <p className={`text-xl font-black ${color}`}>{val}</p>
    </div>
  );
}