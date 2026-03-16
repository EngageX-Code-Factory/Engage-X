"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Tag, FileText, Save } from "lucide-react";

const CATEGORIES = ["Academic", "Arts & Culture", "Sports", "Technology", "Business", "Community Service", "Religious", "Other"];

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition";
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2";
const sectionClass = "bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-5";

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", date: "",
    time: "", venue: "", capacity: "", registration_deadline: "", is_published: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/organization/events"), 1500);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/organization/events" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Event</h2>
          <p className="text-sm mt-0.5 text-gray-500 dark:text-gray-400">Fill in the details to schedule a new event.</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium px-4 py-3 rounded-xl">
          ✓ Event created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic Info */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Basic Information</h3>

          <div className="space-y-1.5">
            <label className={labelClass}><FileText size={15} className="text-gray-400" /> Event Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Annual Tech Talk 2025" required className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}><Tag size={15} className="text-gray-400" /> Category</label>
            <select name="category" value={form.category} onChange={handleChange} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d] text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition">
              <option value="">Select a category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}><FileText size={15} className="text-gray-400" /> Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the event..." rows={4} className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Schedule */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Schedule & Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}><Calendar size={15} className="text-gray-400" /> Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Clock size={15} className="text-gray-400" /> Time</label>
              <input name="time" type="time" value={form.time} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}><MapPin size={15} className="text-gray-400" /> Venue</label>
            <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. Main Auditorium" required className={inputClass} />
          </div>
        </div>

        {/* Registration */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Registration Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}><Users size={15} className="text-gray-400" /> Capacity</label>
              <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} placeholder="e.g. 100" required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Clock size={15} className="text-gray-400" /> Registration Deadline</label>
              <input name="registration_deadline" type="datetime-local" value={form.registration_deadline} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Publish immediately</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Students can see and register right away</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 peer-checked:bg-[#8b5cf6] rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <Link href="/organization/events" className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors">
            <Save size={16} />
            {loading ? "Saving..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}