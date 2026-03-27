"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
// --- THE CRITICAL FIX IS IN THIS IMPORT BLOCK ---
import { 
  Pencil, Mail, Building2, ImagePlus, X, Loader2, 
  Facebook, Instagram, Twitter, MessageCircle, Users, Calendar 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ClubProfileView() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsLoading(false);
      return;
    }

    // 1. Find the Bridge record
    const { data: leader } = await supabase
      .from('my_clubs')
      .select('club_id')
      .eq('user_id', user.id)
      .eq('status', 'LEADER')
      .single();

    if (leader) {
      // 2. Fetch club details (using 'clubid' to match your SQL)
      const { data: club } = await supabase
        .from('clubs')
        .select('*')
        .eq('clubid', leader.club_id)
        .single();
      
      if (club) setProfile(club);
    }
    
    setIsLoading(false);
  }

  const getClubId = () => profile?.clubid;

  // --- CLOUDINARY LOGIC ---
  async function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; 
    if (!file || !profile) return;
    setIsUploadingAvatar(true); 
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload/cloudinary', { method: 'POST', body: formData });
      const data = await res.json();
      await supabase.from('clubs').update({ club_cover_image: data.url }).eq('clubid', getClubId());
      setProfile({ ...profile, club_cover_image: data.url });
    } catch (err) { console.error(err); }
    setIsUploadingAvatar(false);
  }

  async function handleGalleryUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !profile) return;
    setIsUploadingGallery(true);
    const newUrls = [...(profile.club_gallery || [])];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/cloudinary', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) newUrls.push(data.url);
    }

    await supabase.from('clubs').update({ club_gallery: newUrls }).eq('clubid', getClubId());
    setProfile({ ...profile, club_gallery: newUrls });
    setIsUploadingGallery(false);
  }

  if (isLoading) return <div className="flex h-60 items-center justify-center"><Loader2 className="animate-spin text-[#8b5cf6]" /></div>;
  if (!profile) return <div className="p-10 text-white text-center bg-white/5 border border-white/10 rounded-3xl">No profile found. Ensure you are a 'LEADER' in my_clubs.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Organization Profile</h2>
        <Link href="/organization/profile/edit" className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-black uppercase rounded-xl transition-all shadow-lg shadow-purple-500/20">
          <Pencil size={15} /> Edit Details
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 items-center backdrop-blur-xl">
        <div className="relative w-36 h-36 group">
          <div className="w-full h-full rounded-3xl bg-purple-500/10 flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl">
            {profile.club_cover_image ? <img src={profile.club_cover_image} className="w-full h-full object-cover" /> : <Building2 size={48} className="text-purple-500/30" />}
            {isUploadingAvatar && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}
          </div>
          <label className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-[#8b5cf6] cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
            <Pencil size={16} /><input type="file" hidden onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
          </label>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-4xl font-black">{profile.club_name}</h3>
          <p className="text-gray-400 mt-4 text-sm max-w-2xl">{profile.club_description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white/5 border border-white/10 rounded-3xl p-7">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 text-[#8b5cf6]">About Us</h4>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{profile.aboutus || "Update your info in settings."}</p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-3xl p-7">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-black uppercase tracking-widest">Gallery</h4>
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all">
                {isUploadingGallery ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Add Photos
                <input type="file" multiple hidden onChange={handleGalleryUpload} disabled={isUploadingGallery} />
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {profile.club_gallery?.map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/20 group"><img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-7 space-y-6">
             <h4 className="font-black text-gray-500 text-[10px] uppercase tracking-widest">Leadership</h4>
             <SidebarItem icon={Users} label="President" value={profile.president} />
             <SidebarItem icon={Mail} label="Contact" value={profile.contact_email} />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
            <h4 className="font-black text-gray-500 text-[10px] uppercase tracking-widest mb-4">Socials</h4>
            <div className="flex gap-3">
              {/* --- THIS IS THE LINE THAT WAS CRASHING --- */}
              {[Facebook, Instagram, Twitter, MessageCircle].map((Icon, i) => (
                <div key={i} className="p-3 bg-white/5 hover:bg-purple-500/20 rounded-xl border border-white/10 cursor-pointer text-gray-400 hover:text-purple-400">
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-purple-500/10 rounded-xl"><Icon size={16} className="text-purple-400" /></div>
      <div>
        <p className="text-[9px] text-gray-500 font-black uppercase">{label}</p>
        <p className="text-sm font-bold text-gray-200">{value || "Not set"}</p>
      </div>
    </div>
  );
}