'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard, Users, Trophy, Calendar,
  LogOut, ChevronRight, Settings, Shield, Activity, Bell
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';


// --- INTERFACES ---
interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

const modules = [
  {
    title: 'System Dashboard',
    desc: 'Monitor system health and real-time analytics.',
    icon: LayoutDashboard,
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.15)',
    href: '/admin/stats',
    tag: 'Analytics',
  },
  {
    title: 'User Management',
    desc: 'Manage student accounts and assign roles.',
    icon: Users,
    accent: '#a855f7',
    glow: 'rgba(168,85,247,0.15)',
    href: '/admin/users',
    tag: 'Users',
  },
  {
    title: 'Club Management',
    desc: 'Oversee clubs, approve requests and memberships.',
    icon: Trophy,
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.15)',
    href: '/admin/club',
    tag: 'Clubs',
  },
  {
    title: 'Event Monitoring',
    desc: 'Track live events, scheduling and attendance.',
    icon: Calendar,
    accent: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
    href: '/admin/events',
    tag: 'Events',
  },
];

export default function AdminDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ users: 0, clubs: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    if (!mounted) return;
    // 1. Get Logged-in User from Real Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if ( !user) {
     window.location.href = '/admin/login'; // Redirect if not logged in
      return;
    } 

    // 2. Fetch Real Profile
    const { data: prof } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url, role')
      .eq('id', user.id)
      .single();

    if (prof) setProfile(prof);

    // 3. Fetch Real Stats
    const [{ count: uCount }, { count: cCount }, { count: eCount }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('clubs').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
    ]);

    setStats({ users: uCount ?? 0, clubs: cCount ?? 0, events: eCount ?? 0 });
    setLoading(false);
  }, [mounted, router, supabase]);

  useEffect(() => { init(); }, [init]);

  if (!mounted) return null; // Render nothing until mounted
  // ... rest of return
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0] font-sans selection:bg-blue-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap');
        body { background: #080c14; }
      `}</style>

      {/* Modern Top Navigation (Replaces Sidebar) */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080c14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight uppercase italic">Admin<span className="text-blue-500">Portal</span></span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">{profile?.role || 'Admin'}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold border border-white/20">
                 {profile?.avatar_url ? <img src={profile.avatar_url} className="h-full w-full object-cover rounded-xl" /> : profile?.first_name?.[0]}
              </div>
            </div>
            <button onClick={handleLogout} className="p-3 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Platform Overview</h1>
          <p className="text-slate-500 text-lg">Real-time control center for EngageX university network.</p>
        </header>

        {/* Real Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats.users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: Users },
            { label: 'Active Clubs', value: stats.clubs, color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: Trophy },
            { label: 'Live Events', value: stats.events, color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: Calendar },
          ].map((s) => (
            <div key={s.label} className="bg-[#0d1320] border border-white/5 rounded-[2rem] p-8 flex items-center gap-6 hover:border-white/10 transition-colors">
              <div style={{ background: s.bg }} className="h-14 w-14 rounded-2xl flex items-center justify-center">
                <s.icon size={28} color={s.color} />
              </div>
              <div>
                <p className="text-3xl font-bold font-mono text-white">{loading ? '...' : s.value}</p>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((m) => (
            <Link
              href={m.href}
              key={m.title}
              className="group relative bg-[#0d1320] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden transition-all hover:-translate-y-2"
              style={{ '--glow': m.glow } as React.CSSProperties}
            >
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 h-32 w-32 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: m.accent }} />
              
              <div className="flex justify-between items-start mb-8">
                <div style={{ background: m.glow }} className="h-16 w-16 rounded-2xl flex items-center justify-center border border-white/5">
                  <m.icon size={32} color={m.accent} />
                </div>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ borderColor: `${m.accent}30`, color: m.accent, background: `${m.accent}10` }}>
                  {m.tag}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{m.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-8 text-lg">{m.desc}</p>
              
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest" style={{ color: m.accent }}>
                Management Console <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}