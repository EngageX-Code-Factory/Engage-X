"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Users, Calendar, Clock, MapPin, Tag, FileText, Pencil, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Academic", "Arts & Culture", "Sports", "Technology", "Business", "Community Service", "Religious", "Other"];

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition";
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2";
const sectionClass = "bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-5";

export default function EditEvent({ id }: { id: string }) {
  const [tab, setTab] = useState<"details" | "registrations">("details");
  const [form, setForm] = useState<any>({});
  const [registrations, setRegistrations] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch Event Data
      const { data: ev } = await supabase.from('events').select('*').eq('id', id).single();
      if (ev) {
        setForm({
          title: ev.title, date: ev.event_date, time: ev.event_time,
          venue: ev.location, is_published: ev.status === 'OPEN',
          category: "", capacity: "", description: "", registration_deadline: ""
        });
      }
      // Fetch Registrations
      const { data: regs } = await supabase.from('my_events').select('id, full_name, email, created_at').eq('event_id', id);
      if (regs) setRegistrations(regs);
      
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    await supabase.from('events').update({
      title: form.title,
      event_date: form.date,
      event_time: form.time,
      location: form.venue,
      status: form.is_published ? 'OPEN' : 'SOON'
    }).eq('id', id);

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#8b5cf6]" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/organization/events"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{form.title}</h2>
          <p className="text-sm mt-0.5 text-gray-500 dark:text-gray-400">Event details and registrations</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${form.is_published ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"}`}>
          {form.is_published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit">
        {[
          { key: "details", label: "Edit Details", icon: Pencil },
          { key: "registrations", label: "Registrations", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as "details" | "registrations")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "bg-white dark:bg-white/10 shadow-sm text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"}`}>
            <Icon size={14} /> {label}
            {key === "registrations" && (
              <span className="bg-[#8b5cf6] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{registrations.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {tab === "details" && (
        <form onSubmit={handleSave} className="space-y-5">
          {saved && <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium px-4 py-3 rounded-xl">✓ Event updated successfully</div>}

          <div className={sectionClass}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Basic Information</h3>
            <div className="space-y-1.5">
              <label className={labelClass}><FileText size={14} className="text-gray-400" /> Event Title</label>
              <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Tag size={14} className="text-gray-400" /> Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d] text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><FileText size={14} className="text-gray-400" /> Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Schedule & Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}><Calendar size={14} className="text-gray-400" /> Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}><Clock size={14} className="text-gray-400" /> Time</label>
                <input name="time" type="time" value={form.time} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><MapPin size={14} className="text-gray-400" /> Venue</label>
              <input name="venue" value={form.venue} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Registration Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}><Users size={14} className="text-gray-400" /> Capacity</label>
                <input name="capacity" type="number" value={form.capacity} onChange={handleChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}><Clock size={14} className="text-gray-400" /> Registration Deadline</label>
                <input name="registration_deadline" type="datetime-local" value={form.registration_deadline} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Published</p>
                <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">Students can see and register for this event</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 peer-checked:bg-[#8b5cf6] rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>

          <div className="flex justify-end pb-6">
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-60 transition-colors">
              <Save size={15} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Registrations Tab */}
      {tab === "registrations" && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Registered Students</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Student</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {registrations.length === 0 ? (
                <tr><td colSpan={2} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No registrations yet.</td></tr>
              ) : registrations.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white text-sm font-bold shrink-0">{r.full_name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{r.full_name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{r.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}