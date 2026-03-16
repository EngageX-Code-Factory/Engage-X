"use client";

import { useState } from "react";
import { Building2, Mail, Tag, FileText, Save, Camera } from "lucide-react";

const CATEGORIES = [
  "Academic", "Arts & Culture", "Sports", "Technology",
  "Business", "Community Service", "Religious", "Other"
];

export default function ClubProfile() {
  const [form, setForm] = useState({ name: "", category: "", description: "", contact_email: "" });
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Club Profile</h2>
        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Manage your club is public information.</p>
      </div>

      {/* Logo Upload */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
          <Building2 size={32} className="text-gray-300 dark:text-white/20" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">Club Logo</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PNG or JPG, max 2MB</p>
          <button className="mt-3 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#8b5cf6] bg-purple-50 dark:bg-purple-500/10 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
            <Camera size={14} /> Upload Logo
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">Club Details</h3>

        {/* Club Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Building2 size={15} className="text-gray-400" /> Club Name
          </label>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="e.g. IEEE Student Branch"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Tag size={15} className="text-gray-400" /> Category
          </label>
          <select
            name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d] text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Contact Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Mail size={15} className="text-gray-400" /> Contact Email
          </label>
          <input
            name="contact_email" type="email" value={form.contact_email} onChange={handleChange}
            placeholder="club@university.edu"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText size={15} className="text-gray-400" /> Description
          </label>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="Tell students what your club is about..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition resize-none"
          />
        </div>

        {/* Save */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg">
              ✓ Profile saved successfully
            </span>
          )}
          <button
            type="submit"
            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Save size={16} /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}