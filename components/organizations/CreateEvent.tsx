"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Tag, FileText, Calendar, Clock, MapPin, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import EventForecast from "@/components/organizations/EventForecast";

const CATEGORIES = ["Academic", "Arts & Culture", "Sports", "Technology", "Business", "Community Service", "Religious", "Other"];

export default function CreateEvent() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  
  const [form, setForm] = useState({ title: "", date: "", time: "", venue: "", category: "", description: "" });

  // CONFLICT DETECTOR: Checks if other clubs are hosting on the same day
  useEffect(() => {
    async function checkConflicts() {
      if (!form.date) return setConflicts([]);
      setIsChecking(true);
      const { data } = await supabase.from('events').select('title, event_time, clubs(club_name)').eq('event_date', form.date);
      if (data) setConflicts(data);
      setIsChecking(false);
    }
    checkConflicts();
  }, [form.date]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: leader } = await supabase.from('my_clubs').select('club_id').eq('user_id', user?.id).single();
      
      const { error } = await supabase.from('events').insert({
        title: form.title, event_date: form.date, event_time: form.time,
        location: form.venue, category: form.category, club_id: leader?.club_id, status: 'OPEN'
      });

      if (error) throw error;
      router.push("/organization/events");
    } catch (err: any) { alert(err.message); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 text-white">
      <div className="flex items-center gap-4">
        <Link href="/organization/events" className="p-2 hover:bg-white/5 rounded-xl transition-all text-gray-400"><ArrowLeft size={20} /></Link>
        <h2 className="text-2xl font-bold">Launch New Event</h2>
      </div>

      <form onSubmit={handleCreate} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-7 space-y-6 backdrop-blur-xl shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Tag size={12} /> Category & Intelligence</label>
            <select 
              value={form.category} 
              onChange={(e) => setForm({...form, category: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all"
              required
            >
              <option value="" className="bg-gray-900">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
            </select>
            <EventForecast category={form.category} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><FileText size={12} /> Title</label>
            <input name="title" onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Event Name" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500 transition-all" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Calendar size={12} /> Date</label>
              <input name="date" type="date" onChange={(e) => setForm({...form, date: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Clock size={12} /> Time</label>
              <input name="time" type="time" onChange={(e) => setForm({...form, time: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500" required />
            </div>
          </div>

          {/* Conflict Warning */}
          {conflicts.length > 0 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-amber-200">
              <AlertTriangle size={18} className="shrink-0" />
              <div className="text-xs leading-relaxed">
                <b>University Schedule Conflict:</b> {conflicts.length} other event(s) already scheduled.
                <ul className="mt-1 opacity-70 list-disc list-inside">
                  {conflicts.map((c, i) => <li key={i}>{c.title} ({c.event_time})</li>)}
                </ul>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><MapPin size={12} /> Venue</label>
            <input name="venue" onChange={(e) => setForm({...form, venue: e.target.value})} placeholder="Location" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500" required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-purple-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {loading ? "Launching..." : "Confirm & Create Event"}
        </button>
      </form>
    </div>
  );
}