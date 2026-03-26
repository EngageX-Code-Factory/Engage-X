"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, Mail, Tag, FileText, Save, 
  ArrowLeft, Loader2, Globe, Users, Calendar, 
  Clock, Instagram, Facebook, Twitter, MessageCircle,
  GraduationCap
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Academic", "Arts & Culture", "Sports", "Technology", "Business", "Community Service", "Religious", "Other"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ClubProfileEdit() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: leader } = await supabase.from('my_clubs').select('club_id').eq('user_id', user?.id).eq('status', 'LEADER').single();
      
      if (leader) {
        const { data: club } = await supabase.from('clubs').select('*').eq('clubid', leader.club_id).single();
        if (club) {
          setForm({
            name: club.club_name || "",
            category: club.category || "",
            description: club.club_description || "",
            about: club.aboutus || "",
            contact_email: club.contact_email || "",
            faculty: club.faculty || "",
            president: club.president || "",
            meeting_day: club.meeting_day || "",
            meeting_time: club.meeting_time || "",
            facebook: club.facebook || "",
            instagram: club.instagram || "",
            twitter: club.twitter || "",
            discord: club.discord || ""
          });
        }
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await fetch('/api/organization/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) router.push('/organization/profile');
    setIsSaving(false);
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#8b5cf6] h-10 w-10" /></div>;

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-[#8b5cf6] outline-none transition";
  const labelStyle = "text-xs font-bold uppercase tracking-widest text-gray-500 ml-1 mb-2 block";

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/organization/profile" className="p-2 rounded-lg text-gray-400 hover:bg-white/5"><ArrowLeft size={24} /></Link>
        <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: IDENTITY */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
          <h3 className="text-lg font-semibold text-[#8b5cf6] flex items-center gap-2 mb-4">
            <Building2 size={20} /> Identity & Description
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Club Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0f0c29]">{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelStyle}>Tagline / Short Description</label>
            <input name="description" value={form.description} onChange={handleChange} className={inputStyle} placeholder="E.g. The premier club for Robotics at NIBM" />
          </div>
          <div>
            <label className={labelStyle}>About Us (Long Bio)</label>
            <textarea name="about" value={form.about} onChange={handleChange} rows={5} className={`${inputStyle} resize-none`} />
          </div>
        </div>

        {/* SECTION 2: LEADERSHIP & SCHEDULE */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
          <h3 className="text-lg font-semibold text-[#8b5cf6] flex items-center gap-2 mb-4">
            <Users size={20} /> Leadership & Logistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>President Name</label>
              <input name="president" value={form.president} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Faculty</label>
              <input name="faculty" value={form.faculty} onChange={handleChange} placeholder="E.g. School of Computing" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Meeting Day</label>
              <select name="meeting_day" value={form.meeting_day} onChange={handleChange} className={inputStyle}>
                <option value="">Select a day</option>
                {DAYS.map(d => <option key={d} value={d} className="bg-[#0f0c29]">{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Meeting Time</label>
              <input name="meeting_time" type="time" value={form.meeting_time} onChange={handleChange} className={inputStyle} />
            </div>
          </div>
        </div>

        {/* SECTION 3: CONTACT & SOCIALS */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
          <h3 className="text-lg font-semibold text-[#8b5cf6] flex items-center gap-2 mb-4">
            <Globe size={20} /> Digital Presence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Public Contact Email</label>
              <input name="contact_email" value={form.contact_email} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Instagram URL</label>
              <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://..." className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Facebook URL</label>
              <input name="facebook" value={form.facebook} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Discord / WhatsApp Link</label>
              <input name="discord" value={form.discord} onChange={handleChange} className={inputStyle} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/organization/profile" className="px-8 py-3 rounded-xl text-gray-400 hover:text-white transition-all font-semibold">Cancel</Link>
          <button type="submit" disabled={isSaving} className="px-10 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20">
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {isSaving ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}