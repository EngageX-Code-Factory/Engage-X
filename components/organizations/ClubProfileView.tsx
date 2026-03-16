"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Mail, Calendar, Users, Facebook, Twitter, Instagram, MessageCircle, ImageIcon, Building2, ImagePlus, X, Camera } from "lucide-react";

const DUMMY_PROFILE = {
  name: "IEEE Student Branch",
  category: "Technology",
  contact_email: "ieee@university.edu",
  description: "Premier technology club for engineering students.",
  about: "The IEEE Student Branch is the premier student organization for technology enthusiasts at EngageX University. We bring together students from Computing, Engineering, and Design faculties to collaborate on innovative projects.",
  faculty: "Computing & Engineering",
  president: "Sarah Connor",
  meeting_day: "Wednesday",
  meeting_time: "16:00",
  facebook: "https://facebook.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  discord: "https://discord.gg",
};

export default function ClubProfileView() {
  const p = DUMMY_PROFILE;
  const [logoPhoto, setLogoPhoto] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
  ]);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPhoto(URL.createObjectURL(file));
  }

  function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      setGallery(prev => [...prev, URL.createObjectURL(file)]);
    });
  }

  function removePhoto(index: number) {
    setGallery(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Club Profile</h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Your club's public profile as seen by students.</p>
        </div>
        <Link href="/organization/profile/edit"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-xl transition-colors">
          <Pencil size={15} /> Edit Profile
        </Link>
      </div>

      {/* Club Card */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <div className="flex items-center gap-5">
          {/* Logo — uploadable */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-purple-50 dark:bg-purple-500/20 border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
              {logoPhoto
                ? <img src={logoPhoto} alt="Logo" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-[#8b5cf6]">{p.name.charAt(0)}</span>
              }
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={14} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{p.name}</h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-[#8b5cf6] inline-block mt-1">{p.category}</span>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{p.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">

        {/* Left — About + Gallery */}
        <div className="col-span-2 space-y-5">

          {/* About */}
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#8b5cf6]" /> About Us
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{p.about}</p>
          </div>

          {/* Gallery */}
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <ImageIcon size={16} className="text-[#8b5cf6]" /> Club Gallery
              </h4>
              <label className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#8b5cf6] bg-purple-50 dark:bg-purple-500/10 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors cursor-pointer">
                <ImagePlus size={14} /> Add Photos
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
              </label>
            </div>

            {gallery.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                <ImagePlus size={28} className="text-gray-300 dark:text-white/20 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No photos yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Upload photos to showcase your club</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden">
                    <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => removePhoto(index)}
                        className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors">
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#8b5cf6] transition-colors group">
                  <ImagePlus size={22} className="text-gray-300 dark:text-white/20 group-hover:text-[#8b5cf6] transition-colors" />
                  <span className="text-xs text-gray-400 dark:text-gray-600 mt-1 group-hover:text-[#8b5cf6] transition-colors">Add more</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right — Club Info + Social */}
        <div className="space-y-5">

          {/* Club Info */}
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Club Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Faculty</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{p.faculty || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">President</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{p.president || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Meeting</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {p.meeting_day && p.meeting_time ? `${p.meeting_day}s, ${p.meeting_time}` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Contact</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white break-all">{p.contact_email || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Social Links</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {p.facebook && (
                <a href={p.facebook} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#8b5cf6] hover:border-[#8b5cf6] transition-colors">
                  <Facebook size={15} />
                </a>
              )}
              {p.twitter && (
                <a href={p.twitter} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#8b5cf6] hover:border-[#8b5cf6] transition-colors">
                  <Twitter size={15} />
                </a>
              )}
              {p.instagram && (
                <a href={p.instagram} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#8b5cf6] hover:border-[#8b5cf6] transition-colors">
                  <Instagram size={15} />
                </a>
              )}
              {p.discord && (
                <a href={p.discord} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#8b5cf6] hover:border-[#8b5cf6] transition-colors">
                  <MessageCircle size={15} />
                </a>
              )}
              {!p.facebook && !p.twitter && !p.instagram && !p.discord && (
                <p className="text-xs text-gray-400 dark:text-gray-500">No social links added.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}