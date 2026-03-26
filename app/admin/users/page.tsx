'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, Users, Search, Plus, X, ChevronDown,
  LogOut, ArrowLeft, Mail, Phone, MapPin, Hash,
  CheckCircle2, AlertCircle, Loader2, Eye, RefreshCw, Check
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────
type Role   = 'student' | 'organization' | 'admin';
type Status = 'active'  | 'inactive'     | 'suspended';

interface Member {
  id: string;
  first_name: string | null;
  last_name:  string | null;
  email:      string | null;
  avatar_url: string | null;
  student_id: string | null;
  mobile:     string | null;
  address:    string | null;
  role:       Role;
  status:     Status;
  created_at: string;
}

interface AddMemberForm {
  email: string; password: string;
  first_name: string; last_name: string;
  student_id: string; mobile: string;
  role: Role;
}

interface Toast { id: number; msg: string; type: 'success' | 'error' }
let _toastId = 0;

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLE_META: Record<Role, { label: string; color: string; bg: string; border: string }> = {
  admin:        { label: 'Admin',        color: '#f97316', bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.28)' },
  organization: { label: 'Organization', color: '#a855f7', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.28)' },
  student:      { label: 'Student',      color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.28)' },
};
const STATUS_META: Record<Status, { color: string }> = {
  active:    { color: '#10b981' },
  inactive:  { color: '#64748b' },
  suspended: { color: '#ef4444' },
};
const ROLES: Role[] = ['student', 'organization', 'admin'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (m: Member) =>
  `${m.first_name?.[0] ?? ''}${m.last_name?.[0] ?? ''}`.toUpperCase() || '??';

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── RoleCell: dropdown select + Apply confirm button ────────────────────────
function RoleCell({
  member,
  onCommit,
}: {
  member: Member;
  onCommit: (id: string, role: Role) => Promise<void>;
}) {
  const [selected, setSelected] = useState<Role>(member.role);
  const [open,     setOpen]     = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const isDirty = selected !== member.role;
  const rm      = ROLE_META[selected];

  const handleCommit = async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      await onCommit(member.id, selected);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      // onCommit surfaces the error via toast; just reset
      setSelected(member.role);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>

      {/* ── Badge / dropdown trigger ── */}
      <div style={{ position: 'relative' }}>
        <button
          className="role-badge"
          style={{ color: rm.color, background: rm.bg, borderColor: rm.border }}
          onClick={() => !saving && setOpen(o => !o)}
          disabled={saving}
        >
          {rm.label}
          {saving
            ? <Loader2 size={9} style={{ animation: 'spin .8s linear infinite' }} />
            : <ChevronDown size={9} style={{ opacity: .65 }} />
          }
        </button>

        {open && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 98 }}
              onClick={() => setOpen(false)}
            />
            <div className="role-dropdown">
              {ROLES.map(r => {
                const meta = ROLE_META[r];
                return (
                  <button
                    key={r}
                    className="role-option"
                    style={{ color: meta.color }}
                    onClick={() => { setSelected(r); setOpen(false); }}
                  >
                    <span className="role-dot" style={{ background: meta.color }} />
                    {meta.label}
                    {selected === r && (
                      <Check size={11} style={{ marginLeft: 'auto', opacity: .7 }} />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Apply / Saved confirm button — only shown when dirty or just saved ── */}
      {(isDirty || saved) && (
        <button
          className={`confirm-btn ${saved ? 'confirm-saved' : 'confirm-pending'}`}
          onClick={handleCommit}
          disabled={saving || saved}
          title={saved ? 'Saved!' : `Apply role: ${ROLE_META[selected].label}`}
        >
          {saving ? (
            <Loader2 size={11} style={{ animation: 'spin .8s linear infinite' }} />
          ) : saved ? (
            <>
              <CheckCircle2 size={11} />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Check size={11} />
              <span>Apply</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [members,    setMembers]    = useState<Member[]>([]);
  const [filtered,   setFiltered]   = useState<Member[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [toasts,     setToasts]     = useState<Toast[]>([]);
  const [showAdd,    setShowAdd]    = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [addForm,    setAddForm]    = useState<AddMemberForm>({
    email: '', password: '', first_name: '', last_name: '',
    student_id: '', mobile: '', role: 'student',
  });

  const router   = useRouter();
  const supabase = createClient();

  // ── Toast helper ────────────────────────────────────────────────────────────
  const toast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = ++_toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  // ── Fetch all profiles ──────────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id,first_name,last_name,email,avatar_url,student_id,mobile,address,role,status,created_at')
      .order('created_at', { ascending: false });
    if (error) toast('Failed to load members.', 'error');
    else       setMembers((data as Member[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  // ── Search + role filter ────────────────────────────────────────────────────
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

  // ── THE role-change writer: talks directly to Supabase ─────────────────────
  const commitRoleChange = async (memberId: string, newRole: Role): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', memberId);

    if (error) {
      // Show the exact DB / RLS error so you can diagnose quickly
      toast(`Role update failed: ${error.message}`, 'error');
      console.error('[commitRoleChange]', error);
      throw error; // let RoleCell know to reset its local state
    }

    // On success: sync local state so the badge reflects the new role immediately
    setMembers(prev =>
      prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    );
    toast('Role updated successfully.');
  };

  // ── Add member ──────────────────────────────────────────────────────────────
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: addForm.email,
        password: addForm.password,
        options: { data: { first_name: addForm.first_name, last_name: addForm.last_name } },
      });
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('User creation failed.');

      const { error: profError } = await supabase.from('profiles').upsert({
        id:         authData.user.id,
        first_name: addForm.first_name,
        last_name:  addForm.last_name,
        email:      addForm.email,
        student_id: addForm.student_id || null,
        mobile:     addForm.mobile     || null,
        role:       addForm.role,
        status:     'active',
      });
      if (profError) throw new Error(profError.message);

      toast(`${addForm.first_name} added successfully.`);
      setShowAdd(false);
      setAddForm({ email:'', password:'', first_name:'', last_name:'', student_id:'', mobile:'', role:'student' });
      fetchMembers();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Failed to add member.', 'error');
    } finally {
      setAddLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const counts = {
    all:          members.length,
    admin:        members.filter(m => m.role === 'admin').length,
    organization: members.filter(m => m.role === 'organization').length,
    student:      members.filter(m => m.role === 'student').length,
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080c14; }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes fadein   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideup  { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes toast-in { from { transform: translateX(16px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes popin    { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .um-root { min-height: 100vh; background: #080c14; color: #e2e8f0; font-family: 'Sora', sans-serif; }

        /* NAV */
        .um-nav {
          position: sticky; top: 0; z-index: 50; height: 62px;
          background: rgba(8,12,20,.93); border-bottom: 1px solid rgba(255,255,255,.05);
          backdrop-filter: blur(20px); display: flex; align-items: center; padding: 0 32px; gap: 14px;
        }
        .nav-logo { display:flex; align-items:center; gap:9px; font-size:15px; font-weight:700; color:#f1f5f9; text-decoration:none; }
        .nav-logo-icon { width:32px; height:32px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius:9px; display:flex; align-items:center; justify-content:center; }
        .nav-sep { flex:1; }
        .nav-back { display:flex; align-items:center; gap:6px; font-size:13px; color:#64748b; text-decoration:none; padding:5px 11px; border-radius:8px; transition:all .18s; }
        .nav-back:hover { color:#f1f5f9; background:rgba(255,255,255,.05); }
        .nav-logout { padding:6px 9px; border-radius:8px; border:none; cursor:pointer; background:transparent; color:#64748b; display:flex; align-items:center; transition:all .18s; }
        .nav-logout:hover { color:#ef4444; background:rgba(239,68,68,.08); }

        /* MAIN */
        .um-main { max-width:1280px; margin:0 auto; padding:32px 32px 60px; }
        .um-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:26px; gap:16px; flex-wrap:wrap; }
        .um-title { font-size:24px; font-weight:800; color:#f1f5f9; letter-spacing:-.5px; }
        .um-subtitle { font-size:13px; color:#475569; margin-top:3px; }

        .add-btn {
          display:flex; align-items:center; gap:7px; padding:9px 16px;
          background:linear-gradient(135deg,#1d4ed8,#2563eb); border:none; border-radius:10px;
          color:white; font-family:'Sora',sans-serif; font-size:13px; font-weight:600;
          cursor:pointer; box-shadow:0 4px 14px rgba(37,99,235,.28); transition:all .2s; white-space:nowrap;
        }
        .add-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(37,99,235,.42); }

        /* TOOLBAR */
        .um-toolbar { display:flex; align-items:center; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
        .search-wrap {
          display:flex; align-items:center; gap:9px; height:38px;
          background:#0d1320; border:1px solid rgba(255,255,255,.07); border-radius:9px;
          padding:0 13px; flex:1; min-width:200px; max-width:340px; transition:border-color .2s;
        }
        .search-wrap:focus-within { border-color:rgba(59,130,246,.38); }
        .search-input { flex:1; background:transparent; border:none; outline:none; font-family:'Sora',sans-serif; font-size:13px; color:#e2e8f0; }
        .search-input::placeholder { color:#2d3f55; }
        .filter-tabs { display:flex; gap:3px; background:#0d1320; border:1px solid rgba(255,255,255,.06); border-radius:9px; padding:3px; }
        .filter-tab { padding:4px 12px; border-radius:6px; border:none; cursor:pointer; font-family:'Sora',sans-serif; font-size:12px; font-weight:600; color:#475569; background:transparent; transition:all .16s; display:flex; align-items:center; gap:5px; }
        .filter-tab.active { background:rgba(59,130,246,.14); color:#60a5fa; }
        .filter-tab:hover:not(.active) { color:#94a3b8; background:rgba(255,255,255,.03); }
        .tab-count { font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(255,255,255,.06); padding:1px 5px; border-radius:4px; }
        .refresh-btn { width:38px; height:38px; background:#0d1320; border:1px solid rgba(255,255,255,.07); border-radius:9px; display:flex; align-items:center; justify-content:center; color:#64748b; cursor:pointer; transition:all .18s; }
        .refresh-btn:hover { color:#f1f5f9; border-color:rgba(255,255,255,.12); }

        /* TABLE */
        .um-table-wrap { background:#0d1320; border:1px solid rgba(255,255,255,.06); border-radius:14px; overflow:hidden; }
        .um-table { width:100%; border-collapse:collapse; }
        .um-table thead tr { background:rgba(255,255,255,.02); border-bottom:1px solid rgba(255,255,255,.05); }
        .um-table th { padding:10px 16px; text-align:left; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:600; color:#2d3f55; letter-spacing:1.2px; text-transform:uppercase; white-space:nowrap; }
        .um-table td { padding:9px 16px; border-bottom:1px solid rgba(255,255,255,.03); vertical-align:middle; font-size:13px; color:#94a3b8; }
        .um-table tbody tr:last-child td { border-bottom:none; }
        .um-table tbody tr:hover td { background:rgba(255,255,255,.018); }

        /* MEMBER CELL */
        .member-cell { display:flex; align-items:center; gap:9px; }
        .member-avatar { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,#1d4ed8,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:white; flex-shrink:0; overflow:hidden; }
        .member-avatar img { width:100%; height:100%; object-fit:cover; }
        .member-name { font-size:13px; font-weight:600; color:#e2e8f0; }
        .member-email { font-size:11px; color:#3d4f65; margin-top:1px; }

        /* ROLE BADGE */
        .role-badge {
          display:inline-flex; align-items:center; gap:4px; padding:3px 8px 3px 8px;
          border-radius:6px; font-size:11px; font-weight:600; font-family:'JetBrains Mono',monospace;
          border:1px solid; cursor:pointer; transition:opacity .18s, transform .15s; background:none; white-space:nowrap;
          user-select:none;
        }
        .role-badge:not(:disabled):hover { opacity:.75; transform:translateY(-1px); }
        .role-badge:disabled { cursor:default; opacity:.5; }

        /* ROLE DROPDOWN */
        .role-dropdown {
          position:absolute; top:calc(100% + 5px); left:0;
          background:#111827; border:1px solid rgba(255,255,255,.09); border-radius:10px;
          overflow:hidden; z-index:200; min-width:148px;
          box-shadow:0 14px 36px rgba(0,0,0,.55);
          animation:popin .14s ease;
        }
        .role-option { display:flex; align-items:center; gap:8px; padding:8px 13px; font-size:12px; font-weight:600; cursor:pointer; font-family:'Sora',sans-serif; transition:background .13s; border:none; background:transparent; width:100%; text-align:left; }
        .role-option:hover { background:rgba(255,255,255,.05); }
        .role-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }

        /* CONFIRM BUTTON */
        .confirm-btn {
          display:inline-flex; align-items:center; gap:4px; height:24px; padding:0 9px;
          border-radius:6px; border:1px solid; cursor:pointer; font-family:'Sora',sans-serif;
          font-size:11px; font-weight:700; transition:all .18s; white-space:nowrap;
          animation:fadein .15s ease;
        }
        .confirm-pending { background:rgba(16,185,129,.1); border-color:rgba(16,185,129,.3); color:#34d399; }
        .confirm-pending:not(:disabled):hover { background:rgba(16,185,129,.2); border-color:rgba(16,185,129,.5); transform:translateY(-1px); box-shadow:0 4px 10px rgba(16,185,129,.18); }
        .confirm-saved   { background:rgba(99,102,241,.1); border-color:rgba(99,102,241,.25); color:#818cf8; cursor:default; }
        .confirm-btn:disabled { cursor:default; }

        /* STATUS */
        .status-cell { display:flex; align-items:center; gap:6px; font-size:12px; }
        .st-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

        /* ACTION */
        .act-btn { width:28px; height:28px; border-radius:7px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#3d4f65; transition:all .14s; }
        .act-btn:hover { background:rgba(255,255,255,.05); color:#94a3b8; }

        /* EMPTY */
        .um-empty { text-align:center; padding:56px 20px; color:#2d3f55; }
        .um-empty p { font-size:13px; margin-top:10px; }

        /* MODAL */
        .modal-backdrop { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,.78); backdrop-filter:blur(7px); display:flex; align-items:center; justify-content:center; padding:20px; animation:fadein .18s ease; }
        .add-modal { background:#0d1320; border:1px solid rgba(255,255,255,.08); border-radius:18px; width:100%; max-width:500px; padding:28px; animation:slideup .2s ease; }
        .view-modal { background:#0d1320; border:1px solid rgba(255,255,255,.08); border-radius:18px; width:100%; max-width:420px; padding:26px; animation:slideup .2s ease; }
        .modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
        .modal-title { font-size:17px; font-weight:700; color:#f1f5f9; }
        .modal-close { width:30px; height:30px; border-radius:8px; border:none; background:rgba(255,255,255,.05); color:#64748b; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .modal-close:hover { background:rgba(255,255,255,.09); color:#f1f5f9; }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .form-full { grid-column:1/-1; }
        .form-field { display:flex; flex-direction:column; gap:5px; }
        .form-label { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:600; color:#3d4f65; letter-spacing:1px; text-transform:uppercase; }
        .form-input,.form-select { height:40px; background:rgba(15,23,42,.85); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:0 11px; font-family:'Sora',sans-serif; font-size:13px; color:#e2e8f0; outline:none; transition:border-color .2s,box-shadow .2s; }
        .form-input:focus,.form-select:focus { border-color:rgba(59,130,246,.44); box-shadow:0 0 0 3px rgba(59,130,246,.07); }
        .form-input::placeholder { color:#1e2d42; }
        .form-select { cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 11px center; }
        .form-select option { background:#111827; }
        .modal-footer { display:flex; gap:9px; justify-content:flex-end; margin-top:22px; padding-top:18px; border-top:1px solid rgba(255,255,255,.05); }
        .btn-cancel { padding:9px 16px; border-radius:8px; border:1px solid rgba(255,255,255,.08); background:transparent; color:#64748b; font-family:'Sora',sans-serif; font-size:13px; cursor:pointer; transition:all .15s; }
        .btn-cancel:hover { color:#f1f5f9; border-color:rgba(255,255,255,.14); }
        .btn-submit { padding:9px 20px; border-radius:8px; border:none; background:linear-gradient(135deg,#1d4ed8,#2563eb); color:white; font-family:'Sora',sans-serif; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(37,99,235,.28); transition:all .2s; }
        .btn-submit:hover { box-shadow:0 6px 18px rgba(37,99,235,.42); }
        .btn-submit:disabled { opacity:.6; cursor:not-allowed; }

        /* VIEW */
        .view-avatar { width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,#1d4ed8,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; color:white; margin-bottom:12px; overflow:hidden; }
        .view-name { font-size:19px; font-weight:700; color:#f1f5f9; }
        .view-details { margin-top:18px; display:flex; flex-direction:column; gap:8px; }
        .view-row { display:flex; align-items:center; gap:10px; padding:9px 11px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.04); border-radius:8px; }
        .view-row-label { color:#3d4f65; font-family:'JetBrains Mono',monospace; font-size:10px; min-width:76px; }
        .view-row-val { color:#e2e8f0; font-size:12.5px; font-weight:500; }

        /* TOASTS */
        .toast-stack { position:fixed; bottom:22px; right:22px; display:flex; flex-direction:column; gap:7px; z-index:9999; }
        .toast-item { display:flex; align-items:center; gap:9px; padding:11px 15px; border-radius:10px; font-size:13px; font-weight:500; backdrop-filter:blur(12px); animation:toast-in .22s ease; box-shadow:0 8px 22px rgba(0,0,0,.38); max-width:310px; }
        .toast-success { background:rgba(16,185,129,.11); border:1px solid rgba(16,185,129,.24); color:#34d399; }
        .toast-error   { background:rgba(239,68,68,.09);  border:1px solid rgba(239,68,68,.2);  color:#f87171; }

        .mono { font-family:'JetBrains Mono',monospace; }
      `}</style>

      <div className="um-root">

        {/* NAV */}
        <nav className="um-nav">
          <div className="nav-logo">
            <div className="nav-logo-icon"><Shield size={17} color="white" /></div>
            Admin<span style={{ color: '#3b82f6' }}>Portal</span>
          </div>
          <div className="nav-sep" />
          <Link href="/admin" className="nav-back"><ArrowLeft size={13} /> Dashboard</Link>
          <button className="nav-logout" onClick={handleLogout}><LogOut size={16} /></button>
        </nav>

        {/* MAIN */}
        <main className="um-main">

          {/* Header */}
          <div className="um-header">
            <div>
              <div className="um-title">User Management</div>
              <div className="um-subtitle">Manage accounts, assign roles and control platform access.</div>
            </div>
            <button className="add-btn" onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Add Member
            </button>
          </div>

          {/* Toolbar */}
          <div className="um-toolbar">
            <div className="search-wrap">
              <Search size={13} color="#2d3f55" />
              <input className="search-input" placeholder="Search name, email or student ID…"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}
                  onClick={() => setSearch('')}><X size={12} /></button>
              )}
            </div>

            <div className="filter-tabs">
              {(['all', 'student', 'organization', 'admin'] as const).map(r => (
                <button key={r}
                  className={`filter-tab${roleFilter === r ? ' active' : ''}`}
                  onClick={() => setRoleFilter(r)}
                >
                  {r === 'all' ? 'All' : ROLE_META[r].label}
                  <span className="tab-count">{counts[r]}</span>
                </button>
              ))}
            </div>

            <button className="refresh-btn" onClick={fetchMembers} title="Refresh">
              <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
            </button>
          </div>

          {/* Table */}
          <div className="um-table-wrap">
            {loading ? (
              <div className="um-empty">
                <Loader2 size={26} color="#1d4ed8" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                <p>Loading members…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="um-empty">
                <Users size={30} color="#1e293b" style={{ margin: '0 auto' }} />
                <p>No members found.</p>
              </div>
            ) : (
              <table className="um-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Student ID</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => {
                    const sm = STATUS_META[m.status] ?? STATUS_META.active;
                    return (
                      <tr key={m.id}>

                        {/* Member */}
                        <td>
                          <div className="member-cell">
                            <div className="member-avatar">
                              {m.avatar_url ? <img src={m.avatar_url} alt="" /> : getInitials(m)}
                            </div>
                            <div>
                              <div className="member-name">{m.first_name} {m.last_name}</div>
                              <div className="member-email">{m.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Student ID */}
                        <td>
                          <span className="mono" style={{ fontSize: 11, color: '#3d4f65' }}>
                            {m.student_id ?? '—'}
                          </span>
                        </td>

                        {/* Role — RoleCell handles select + confirm */}
                        <td style={{ minWidth: 200 }}>
                          <RoleCell member={m} onCommit={commitRoleChange} />
                        </td>

                        {/* Status */}
                        <td>
                          <div className="status-cell" style={{ color: sm.color }}>
                            <span className="st-dot" style={{ background: sm.color }} />
                            {m.status ?? 'active'}
                          </div>
                        </td>

                        {/* Joined */}
                        <td>
                          <span className="mono" style={{ fontSize: 11, color: '#2d3f55' }}>
                            {fmtDate(m.created_at)}
                          </span>
                        </td>

                        {/* View */}
                        <td>
                          <button className="act-btn" title="View profile" onClick={() => setViewMember(m)}>
                            <Eye size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!loading && (
            <div style={{ marginTop: 10, fontSize: 11, color: '#2d3f55', fontFamily: 'JetBrains Mono,monospace' }}>
              {filtered.length} / {members.length} members
            </div>
          )}
        </main>
      </div>

      {/* ── ADD MEMBER MODAL ── */}
      {showAdd && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div className="add-modal">
            <div className="modal-header">
              <div className="modal-title">Add New Member</div>
              <button className="modal-close" onClick={() => setShowAdd(false)}><X size={15} /></button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="John" required
                    value={addForm.first_name} onChange={e => setAddForm(f => ({ ...f, first_name: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Doe" required
                    value={addForm.last_name} onChange={e => setAddForm(f => ({ ...f, last_name: e.target.value }))} />
                </div>
                <div className="form-field form-full">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="john@engagex.lk" required
                    value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-field form-full">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="Min. 8 characters" required minLength={8}
                    value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">Student ID</label>
                  <input className="form-input" placeholder="COHND…"
                    value={addForm.student_id} onChange={e => setAddForm(f => ({ ...f, student_id: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">Mobile</label>
                  <input className="form-input" placeholder="+94 7X XXX XXXX"
                    value={addForm.mobile} onChange={e => setAddForm(f => ({ ...f, mobile: e.target.value }))} />
                </div>
                <div className="form-field form-full">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={addForm.role}
                    onChange={e => setAddForm(f => ({ ...f, role: e.target.value as Role }))}>
                    <option value="student">Student</option>
                    <option value="organization">Organization</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={addLoading}>
                  {addLoading
                    ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Creating…</>
                    : <><Plus size={13} /> Create Member</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW MEMBER MODAL ── */}
      {viewMember && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setViewMember(null); }}>
          <div className="view-modal">
            <div className="modal-header">
              <div className="modal-title">Member Profile</div>
              <button className="modal-close" onClick={() => setViewMember(null)}><X size={15} /></button>
            </div>
            <div className="view-avatar">
              {viewMember.avatar_url
                ? <img src={viewMember.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                : getInitials(viewMember)}
            </div>
            <div className="view-name">{viewMember.first_name} {viewMember.last_name}</div>
            <div style={{ marginTop: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 5,
                fontSize: 11, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600,
                color: ROLE_META[viewMember.role]?.color,
                background: ROLE_META[viewMember.role]?.bg,
                border: `1px solid ${ROLE_META[viewMember.role]?.border}`,
              }}>
                {ROLE_META[viewMember.role]?.label}
              </span>
            </div>
            <div className="view-details">
              {[
                { icon: <Mail size={12} />,         label: 'Email',      val: viewMember.email      ?? '—' },
                { icon: <Hash size={12} />,         label: 'Student ID', val: viewMember.student_id ?? '—' },
                { icon: <Phone size={12} />,        label: 'Mobile',     val: viewMember.mobile     ?? '—' },
                { icon: <MapPin size={12} />,       label: 'Address',    val: viewMember.address    ?? '—' },
                { icon: <CheckCircle2 size={12} />, label: 'Status',     val: viewMember.status     ?? 'active' },
                { icon: <Shield size={12} />,       label: 'Joined',     val: fmtDate(viewMember.created_at) },
              ].map(row => (
                <div key={row.label} className="view-row">
                  <span style={{ color: '#2d3f55' }}>{row.icon}</span>
                  <span className="view-row-label">{row.label}</span>
                  <span className="view-row-val">{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOASTS ── */}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            {t.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}