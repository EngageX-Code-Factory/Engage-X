"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Users, Calendar, Clock, MapPin, Tag, FileText, Pencil } from "lucide-react";

const CATEGORIES = ["Academic", "Arts & Culture", "Sports", "Technology", "Business", "Community Service", "Religious", "Other"];

const ALL_EVENTS = [
  { id: "1", title: "Tech Talk 2025", description: "An exciting talk on modern web technologies.", category: "Technology", date: "2025-04-10", time: "14:00", venue: "Hall A", capacity: "100", registration_deadline: "2025-04-08T12:00", is_published: true },
  { id: "2", title: "Leadership Workshop", description: "A workshop on leadership skills.", category: "Academic", date: "2025-04-18", time: "10:00", venue: "Room 201", capacity: "40", registration_deadline: "2025-04-16T12:00", is_published: false },
  { id: "3", title: "Annual Sports Meet", description: "Annual sports competition for all students.", category: "Sports", date: "2025-05-02", time: "09:00", venue: "Main Ground", capacity: "200", registration_deadline: "2025-04-30T12:00", is_published: true },
];

const ALL_REGISTRATIONS: Record<string, { id: string; name: string; email: string; registered_at: string }[]> = {
  "1": [
    { id: "1", name: "Ashan Perera", email: "ashan@nibm.lk", registered_at: "2025-04-01" },
    { id: "2", name: "Nimasha Silva", email: "nimasha@nibm.lk", registered_at: "2025-04-02" },
    { id: "3", name: "Ravindu Fernando", email: "ravindu@nibm.lk", registered_at: "2025-04-03" },
    { id: "4", name: "Kavya Mendis", email: "kavya@nibm.lk", registered_at: "2025-04-04" },
  ],
  "2": [
    { id: "1", name: "Dilshan Kumara", email: "dilshan@nibm.lk", registered_at: "2025-04-10" },
    { id: "2", name: "Shalomi Jayawardena", email: "shalomi@nibm.lk", registered_at: "2025-04-11" },
  ],
  "3": [
    { id: "1", name: "Ashan Perera", email: "ashan@nibm.lk", registered_at: "2025-04-20" },
  ],
};

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition";
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2";
const sectionClass = "bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-5";

export default function EditEvent({ id }: { id: string }) {
  const event = ALL_EVENTS.find(e => e.id === id) ?? ALL_EVENTS[0];
  const registrations = ALL_REGISTRATIONS[id] ?? [];

  const [tab, setTab] = useState<"details" | "registrations">("details");
  const [form, setForm] = useState(event);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

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
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          form.is_published
            ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
        }`}>
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
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-white dark:bg-white/10 shadow-sm text-gray-800 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            }`}>
            <Icon size={14} />
            {label}
            {key === "registrations" && (
              <span className="bg-[#8b5cf6] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {registrations.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Edit Details Tab */}
      {tab === "details" && (
        <form onSubmit={handleSave} className="space-y-5">
          {saved && (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium px-4 py-3 rounded-xl">
              ✓ Event updated successfully
            </div>
          )}

          {/* Basic Info */}
          <div className={sectionClass}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Basic Information</h3>
            <div className="space-y-1.5">
              <label className={labelClass}><FileText size={14} className="text-gray-400" /> Event Title</label>
              <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Tag size={14} className="text-gray-400" /> Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d] text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><FileText size={14} className="text-gray-400" /> Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className={`${inputClass} resize-none`} />
            </div>
          </div>

          {/* Schedule */}
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

          {/* Registration Settings */}
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
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-60 transition-colors">
              <Save size={15} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Registrations Tab */}
      {tab === "registrations" && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Registered Students</h3>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-50 dark:bg-purple-500/10 text-[#8b5cf6]">
              {registrations.length} registered
            </span>
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
                      <div className="w-9 h-9 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{r.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(r.registered_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}