"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Mail, Tag, FileText, Save, Camera, Users, Calendar, Facebook, Twitter, Instagram, MessageCircle, ArrowLeft } from "lucide-react";

const CATEGORIES = [
  "Academic", "Arts & Culture", "Sports", "Technology",
  "Business", "Community Service", "Religious", "Other"
];

const MEETING_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ClubProfileEdit() {
  const [form, setForm] = useState({
    name: "", category: "", description: "", contact_email: "",
    about: "", faculty: "", president: "", meeting_day: "", meeting_time: "",
    facebook: "", twitter: "", instagram: "", discord: "",
  });
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition";
  const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2";
  const sectionClass = "bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-5";

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/organization/profile"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Club Profile</h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Update your club's public information.</p>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
          <Building2 size={32} className="text-gray-300 dark:text-white/20" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">Club Logo</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PNG or JPG, max 2MB</p>
          <label className="mt-3 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#8b5cf6] bg-purple-50 dark:bg-purple-500/10 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors cursor-pointer w-fit">
            <Camera size={14} /> Upload Logo
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Basic Details */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Basic Details</h3>

          <div className="space-y-1.5">
            <label className={labelClass}><Building2 size={15} className="text-gray-400" /> Club Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. IEEE Student Branch" required className={inputClass} />
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
            <label className={labelClass}><Mail size={15} className="text-gray-400" /> Contact Email</label>
            <input name="contact_email" type="email" value={form.contact_email} onChange={handleChange}
              placeholder="club@university.edu" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}><FileText size={15} className="text-gray-400" /> Short Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="One line summary of your club..." rows={2}
              className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* About */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">About the Club</h3>
          <div className="space-y-1.5">
            <label className={labelClass}><FileText size={15} className="text-gray-400" /> About Us</label>
            <textarea name="about" value={form.about} onChange={handleChange}
              placeholder="Tell students about your club's mission, activities, and achievements..."
              rows={5} className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Club Info */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Club Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}><Building2 size={15} className="text-gray-400" /> Faculty</label>
              <input name="faculty" value={form.faculty} onChange={handleChange}
                placeholder="e.g. Computing & Engineering" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Users size={15} className="text-gray-400" /> President</label>
              <input name="president" value={form.president} onChange={handleChange}
                placeholder="e.g. Sarah Connor" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}><Calendar size={15} className="text-gray-400" /> Meeting Day</label>
              <select name="meeting_day" value={form.meeting_day} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d] text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition">
                <option value="">Select day</option>
                {MEETING_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Calendar size={15} className="text-gray-400" /> Meeting Time</label>
              <input name="meeting_time" type="time" value={form.meeting_time} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Social Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}><Facebook size={15} className="text-gray-400" /> Facebook</label>
              <input name="facebook" value={form.facebook} onChange={handleChange}
                placeholder="https://facebook.com/..." className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Twitter size={15} className="text-gray-400" /> Twitter / X</label>
              <input name="twitter" value={form.twitter} onChange={handleChange}
                placeholder="https://twitter.com/..." className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Instagram size={15} className="text-gray-400" /> Instagram</label>
              <input name="instagram" value={form.instagram} onChange={handleChange}
                placeholder="https://instagram.com/..." className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><MessageCircle size={15} className="text-gray-400" /> Discord</label>
              <input name="discord" value={form.discord} onChange={handleChange}
                placeholder="https://discord.gg/..." className={inputClass} />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between pb-6">
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg">
              ✓ Profile saved successfully
            </span>
          )}
          <button type="submit"
            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-xl transition-colors">
            <Save size={16} /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}