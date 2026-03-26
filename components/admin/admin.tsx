'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard, Users, Trophy, Calendar,
  LogOut, Shield, Mail, CheckCheck, Loader2,
  ChevronUp, ChevronDown, MessageSquare,
  ArrowUpRight, Inbox, Clock, RefreshCcw, User
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContactRequest {
  id:          string;
  name:        string;
  email:       string;
  subject:     string;
  message:     string;
  status:      string;
  created_at: string;
}

interface AdminProfile {
  first_name: string | null;
  avatar_url: string | null;
}

const modules = [
  { title: 'System Analytics', desc: 'Real-time platform performance metrics.', icon: LayoutDashboard, accent: '#3b82f6', href: '/admin/stats', tag: 'Analytics' },
  { title: 'User Registry', desc: 'Manage identities and access roles.', icon: Users, accent: '#a855f7', href: '/admin/users', tag: 'Security' },
  { title: 'Club Directory', desc: 'Oversee verified campus organizations.', icon: Trophy, accent: '#f97316', href: '/admin/club', tag: 'Clubs' },
  { title: 'Event Monitor', desc: 'Schedule and track live engagements.', icon: Calendar, accent: '#10b981', href: '/admin/events', tag: 'Events' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, clubs: 0, events: 0 });
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch Admin Profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('first_name, avatar_url')
        .eq('id', user.id)
        .single();
      setAdmin(prof);
    }

    const [{ count: uCount }, { count: cCount }, { count: eCount }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('clubs').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
    ]);
    setStats({ users: uCount ?? 0, clubs: cCount ?? 0, events: eCount ?? 0 });

    const { data: contactData } = await supabase
      .from('contact_us')
      .select('*')
      .order('created_at', { ascending: false });

    setContacts((contactData as ContactRequest[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
    const channel = supabase.channel('global-contact-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_us' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData, supabase]);

  const markAsRead = async (id: string) => {
    setMarkingId(id);
    const { error } = await supabase
      .from('contact_us')
      .update({ status: 'read' })
      .eq('id', id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'read' } : c));
    }
    setMarkingId(null);
  };

  const hasUnread = contacts.some(c => c.status !== 'read');

  if (loading && contacts.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0] font-sans pb-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap');
        .bottom-inbox {
          position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 100%; max-width: 900px;
          background: #0d1320; border: 1px solid rgba(255,255,255,0.1); border-bottom: none;
          border-radius: 24px 24px 0 0; z-index: 100; box-shadow: 0 -20px 50px rgba(0,0,0,0.7);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .inbox-minimized { height: 70px; }
        .inbox-expanded { height: 650px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>

      <div className="max-w-7xl mx-auto p-8 md:p-12">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tight">System Core</h1>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">Operational Console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* NEW: PROFESSIONAL SMALL ADMIN SQUARE */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-xl pr-4">
               <div className="h-8 w-8 bg-blue-600/20 rounded-lg border border-blue-500/30 flex items-center justify-center overflow-hidden">
                  {admin?.avatar_url ? (
                    <img src={admin.avatar_url} alt="admin" className="h-full w-full object-cover" />
                  ) : (
                    <User size={16} className="text-blue-400" />
                  )}
               </div>
               <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white tracking-tight uppercase">{admin?.first_name || 'Admin'}</span>
                  <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Operator</span>
               </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={fetchData} 
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all group"
                title="Refresh System Data"
              >
                <RefreshCcw size={18} className="group-active:rotate-180 transition-transform duration-500" />
              </button>
              
              <button onClick={() => supabase.auth.signOut().then(() => router.push('/admin/login'))} className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Total Registry" val={stats.users} color="text-blue-400" icon={Users} />
          <StatCard label="Verified Clubs" val={stats.clubs} color="text-purple-400" icon={Trophy} />
          <StatCard label="Platform Events" val={stats.events} color="text-emerald-400" icon={Calendar} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map(m => (
            <Link href={m.href} key={m.title} className="group bg-[#0d1320] border border-white/5 rounded-[2.5rem] p-10 hover:border-blue-500/20 transition-all relative overflow-hidden">
               <m.icon size={40} style={{ color: m.accent }} className="mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
               <h3 className="text-2xl font-bold text-white mb-2">{m.title}</h3>
               <p className="text-slate-500 text-sm mb-8 leading-relaxed">{m.desc}</p>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-white transition-colors">
                 Execute Protocol <ArrowUpRight size={14} />
               </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={`bottom-inbox ${isInboxOpen ? 'inbox-expanded' : 'inbox-minimized'}`}>
        <div 
          className="h-[70px] px-8 flex items-center justify-between cursor-pointer border-b border-white/5" 
          onClick={() => setIsInboxOpen(!isInboxOpen)}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Inbox size={20} className={hasUnread ? "text-blue-500" : "text-slate-600"} />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0d1320] animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-200">Intelligence Feed</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase">
                {hasUnread ? `${contacts.filter(c => c.status !== 'read').length} pending transmissions` : 'Protocol Status: Secure'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {isInboxOpen ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronUp size={20} className="text-slate-500" />}
          </div>
        </div>

        <div className="p-6 h-[570px] overflow-y-auto custom-scrollbar">
          <div className="space-y-4 pb-10">
            {contacts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                    <MessageSquare size={48} />
                    <p className="mt-4 font-bold tracking-widest uppercase text-xs">No Messages Found</p>
                </div>
            ) : (
              contacts.map((c) => (
                <div 
                  key={c.id} 
                  className={`border rounded-3xl p-6 transition-all ${c.status === 'read' ? 'bg-white/[0.01] border-white/5 opacity-60' : 'bg-white/[0.03] border-blue-500/20 shadow-lg shadow-blue-500/5'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold border ${c.status === 'read' ? 'bg-white/5 border-white/5 text-slate-600' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${c.status === 'read' ? 'text-slate-500' : 'text-white'}`}>{c.name}</h4>
                        <p className="text-[10px] font-mono text-blue-400/60 uppercase">{c.email}</p>
                      </div>
                    </div>
                    
                    {c.status !== 'read' ? (
                      <button 
                        onClick={() => markAsRead(c.id)}
                        disabled={markingId === c.id}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                      >
                        {markingId === c.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={14} />}
                        Resolve
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-500 rounded-xl text-[10px] font-black uppercase border border-white/5 cursor-default">
                        <CheckCheck size={14} />
                        Completed
                      </div>
                    )}
                  </div>

                  <div className={`rounded-2xl p-5 border ${c.status === 'read' ? 'bg-black/10 border-white/5' : 'bg-black/30 border-white/5'}`}>
                    <p className={`text-[10px] font-black uppercase mb-2 tracking-widest ${c.status === 'read' ? 'text-slate-600' : 'text-blue-500'}`}>Subject: {c.subject}</p>
                    <p className={`text-sm leading-relaxed ${c.status === 'read' ? 'text-slate-500 italic' : 'text-slate-300'}`}>"{c.message}"</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                      <span className="text-[9px] font-mono text-slate-600 uppercase flex items-center gap-1">
                        <Clock size={10} /> {new Date(c.created_at).toLocaleString()}
                      </span>
                      <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">ID: {c.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, val, color, icon: Icon }: any) {
  return (
    <div className="bg-[#0d1320] border border-white/5 rounded-[2rem] p-8 flex items-center justify-between group">
      <div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">{label}</p>
        <p className={`text-4xl font-bold font-mono ${color}`}>{val}</p>
      </div>
      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-all">
        <Icon size={24} />
      </div>
    </div>
  );
}