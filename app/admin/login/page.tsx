'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, Users, Search, Plus, X, ChevronDown,
  LogOut, ArrowLeft, Mail, Phone, MapPin, Hash,
  CheckCircle2, AlertCircle, Loader2,
  RefreshCw, Eye, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// ─── TYPES mapped to your public.profiles schema ────────────────────────────
type Role = 'student' | 'organization' | 'admin';
type Status = 'active' | 'inactive' | 'suspended';

interface Member {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  student_id: string | null;
  mobile: string | null;
  address: string | null;
  role: Role;
  status: Status;
  created_at: string;
}

const ROLE_META: Record<Role, { label: string; color: string; bg: string; border: string }> = {
  admin:        { label: 'Admin',        color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)' },
  organization: { label: 'Organization', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)' },
  student:      { label: 'Student',      color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
};

const STATUS_META: Record<Status, { color: string; dot: string }> = {
  active:    { color: '#10b981', dot: '#10b981' },
  inactive:  { color: '#64748b', dot: '#64748b' },
  suspended: { color: '#ef4444', dot: '#ef4444' },
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [members, setMembers]   = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  
  // UI States
  const [showAdd, setShowAdd]   = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);
  const [viewMember, setViewMember] = useState<Member | null>(null);

  const [addForm, setAddForm] = useState({
    email: '', password: '', first_name: '', last_name: '',
    student_id: '', mobile: '', role: 'student' as Role,
  });

  const router = useRouter();
  const supabase = createClient();

  // ── Database: Fetch ────────────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setMembers(data as Member[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  // ── Database: Change Role (PERSISTENT) ─────────────────────────────────────
  const changeRole = async (memberId: string, newRole: Role) => {
    setRoleChanging(memberId);
    setOpenMenu(null);
    
    // 1. Database Update
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', memberId);

    if (error) {
      alert("Database error: " + error.message);
    } else {
      // 2. State Update
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    }
    setRoleChanging(null);
  };

  // ── Database: Add Member ───────────────────────────────────────────────────
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    
    // This uses your custom 'handle_new_user' trigger logic
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: addForm.email,
      password: addForm.password,
      options: { data: { first_name: addForm.first_name, last_name: addForm.last_name } }
    });

    if (authError) {
      alert(authError.message);
    } else if (authData.user) {
      // Force the role in the profile table (Trigger might set default to student)
      await supabase.from('profiles').update({ 
        role: addForm.role,
        student_id: addForm.student_id,
        mobile: addForm.mobile 
      }).eq('id', authData.user.id);
      
      setShowAdd(false);
      fetchMembers();
    }
    setAddLoading(false);
  };

  // ── Filtering Logic ────────────────────────────────────────────────────────
  useEffect(() => {
    let list = [...members];
    if (roleFilter !== 'all') list = list.filter(m => m.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.student_id?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [members, search, roleFilter]);

  if (loading && members.length === 0) return (
    <div className="h-screen bg-[#080c14] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0] font-sans p-8 md:p-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <Link href="/admin" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1 mb-4">
              <ArrowLeft size={14} /> Back to Overview
            </Link>
            <h1 className="text-4xl font-extrabold text-white mb-2 italic uppercase">User Registry</h1>
            <p className="text-slate-500">Managing <span className="text-blue-400 font-bold">{members.length}</span> platform identities.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                placeholder="Search registry..."
                className="pl-12 pr-6 py-4 bg-[#0d1320] border border-white/5 rounded-2xl focus:border-blue-500/50 outline-none w-full md:w-72 transition-all text-sm font-bold"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAdd(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"
            >
              <Plus size={20} /> Add Member
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
           {['all', 'student', 'organization', 'admin'].map((r) => (
             <button 
               key={r}
               onClick={() => setRoleFilter(r as any)}
               className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                 roleFilter === r ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#0d1320] border-white/5 text-slate-500'
               }`}
             >
               {r}
             </button>
           ))}
        </div>

        {/* Table Container */}
        <div className="bg-[#0d1320] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Identity</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Student ID</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Access Role</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filtered.map((m) => {
                const meta = ROLE_META[m.role] || ROLE_META.student;
                return (
                  <tr key={m.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {m.first_name?.[0]}{m.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">{m.first_name} {m.last_name}</p>
                          <p className="text-xs text-slate-500 font-mono">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">{m.student_id || 'N/A'}</td>
                    <td className="px-8 py-6">
                      <div className="relative">
                        {roleChanging === m.id ? (
                          <Loader2 size={16} className="animate-spin text-blue-500" />
                        ) : (
                          <button 
                            onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                            style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
                            className="px-4 py-2 rounded-xl text-[10px] font-bold border flex items-center gap-2 uppercase tracking-widest"
                          >
                            {m.role} <ChevronDown size={12} />
                          </button>
                        )}
                        {openMenu === m.id && (
                          <div className="absolute top-full mt-2 left-0 w-48 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                            {['student', 'organization', 'admin'].map((role) => (
                              <button
                                key={role}
                                onClick={() => changeRole(m.id, role as Role)}
                                className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-white/5 text-slate-300 transition-colors uppercase"
                              >
                                Set as {role}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button onClick={() => setViewMember(m)} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-all">
                          <Eye size={18} />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD MEMBER */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-[#0d1320] w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl border border-white/10 relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-white italic uppercase">Initialize Account</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 text-white text-sm" placeholder="First Name" required onChange={e => setAddForm({...addForm, first_name: e.target.value})} />
                <input className="p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 text-white text-sm" placeholder="Last Name" required onChange={e => setAddForm({...addForm, last_name: e.target.value})} />
              </div>
              <input className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 text-white text-sm" placeholder="Email Address" type="email" required onChange={e => setAddForm({...addForm, email: e.target.value})} />
              <input className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 text-white text-sm" placeholder="Password (Min 8 characters)" type="password" required minLength={8} onChange={e => setAddForm({...addForm, password: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 text-white text-sm" placeholder="Student ID" onChange={e => setAddForm({...addForm, student_id: e.target.value})} />
                <select className="p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 text-white text-sm appearance-none" onChange={e => setAddForm({...addForm, role: e.target.value as Role})}>
                  <option value="student">Student</option>
                  <option value="organization">Organization</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl mt-4 uppercase tracking-widest text-xs">
                {addLoading ? <Loader2 className="animate-spin mx-auto" /> : "Deploy Identity"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}