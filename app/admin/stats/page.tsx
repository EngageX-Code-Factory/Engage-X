'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users, Trophy, Calendar, ShieldCheck, Activity,
  ChevronLeft, Loader2, TrendingUp, ArrowUpRight,
  MapPin, Clock, Users2, CheckCircle2, Timer,
  AlertCircle, Circle, BarChart3, RefreshCw, Search, X
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface EventRow {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  event_end_time: string | null;
  location: string;
  status: 'OPEN' | 'FILLED' | 'SOON' | 'CLOSED';
  attendees: number;
  registrations: number;
  club_name: string | null;
}

interface ClubRow {
  clubid: string;
  club_name: string;
  category: string;
  active_members: number;
  member_count: number;
}

interface Stats {
  users: number;
  clubs: number;
  events: number;
  totalRegistrations: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtTime(t: string | null) {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getEventPhase(event: EventRow): 'upcoming' | 'ongoing' | 'ended' | 'pending' {
  const now   = new Date();
  const start = new Date(`${event.event_date}T${event.event_time}`);
  const end   = event.event_end_time
    ? new Date(`${event.event_date}T${event.event_end_time}`)
    : null;

  if (event.status === 'CLOSED') return 'ended';
  if (now < start) {
    const diffH = (start.getTime() - now.getTime()) / 3600000;
    return diffH <= 24 ? 'pending' : 'upcoming';
  }
  if (end && now > end) return 'ended';
  return 'ongoing';
}

const PHASE_META = {
  upcoming: { label: 'Upcoming',  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.22)', icon: Circle },
  pending:  { label: 'Starting Soon', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: Timer },
  ongoing:  { label: 'Ongoing',   color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.22)', icon: Activity },
  ended:    { label: 'Ended',     color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.18)', icon: CheckCircle2 },
};

export default function SystemDashboard() {
  const [loading,  setLoading]  = useState(true);
  const [stats,    setStats]    = useState<Stats>({ users: 0, clubs: 0, events: 0, totalRegistrations: 0 });
  const [events,   setEvents]   = useState<EventRow[]>([]);
  const [clubs,    setClubs]    = useState<ClubRow[]>([]);
  const [filter,   setFilter]   = useState<'all' | 'upcoming' | 'pending' | 'ongoing' | 'ended'>('all');
  
  // NEW: Search state for clubs
  const [clubSearch, setClubSearch] = useState('');

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [
      { count: userCount },
      { count: clubCount },
      { count: eventCount },
      { count: regCount },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('clubs').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('my_events').select('*', { count: 'exact', head: true }),
    ]);

    const { data: eventsRaw } = await supabase
      .from('events')
      .select(`
        id, title, event_date, event_time, event_end_time,
        location, status, attendees,
        clubs ( club_name ),
        my_events ( id )
      `)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true });

    const processedEvents: EventRow[] = (eventsRaw ?? []).map((e: any) => ({
      id:            e.id,
      title:         e.title,
      event_date:    e.event_date,
      event_time:    e.event_time,
      event_end_time: e.event_end_time,
      location:      e.location,
      status:        e.status,
      attendees:     e.attendees ?? 0,
      registrations: Array.isArray(e.my_events) ? e.my_events.length : 0,
      club_name:     e.clubs?.club_name ?? null,
    }));

    const { data: clubsRaw } = await supabase
      .from('clubs')
      .select(`
        clubid, club_name, category, active_members,
        my_clubs ( id, status )
      `)
      .order('active_members', { ascending: false });

    const processedClubs: ClubRow[] = (clubsRaw ?? []).map((c: any) => ({
      clubid:        c.clubid,
      club_name:     c.club_name,
      category:      c.category,
      active_members: c.active_members ?? 0,
      member_count:  Array.isArray(c.my_clubs)
        ? c.my_clubs.filter((m: any) => ['ACTIVE', 'LEADER'].includes(m.status)).length
        : 0,
    }));

    setStats({
      users:              userCount  ?? 0,
      clubs:              clubCount  ?? 0,
      events:             eventCount ?? 0,
      totalRegistrations: regCount   ?? 0,
    });
    setEvents(processedEvents);
    setClubs(processedClubs);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => getEventPhase(e) === filter);

  // NEW: Filtered clubs based on search input
  const filteredClubs = clubs.filter(c => 
    c.club_name.toLowerCase().includes(clubSearch.toLowerCase())
  );

  const phaseCounts = {
    upcoming: events.filter(e => getEventPhase(e) === 'upcoming').length,
    pending:  events.filter(e => getEventPhase(e) === 'pending').length,
    ongoing:  events.filter(e => getEventPhase(e) === 'ongoing').length,
    ended:    events.filter(e => getEventPhase(e) === 'ended').length,
  };

  if (loading) return (
    <div style={{ height: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={36} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080c14; }
        .sd-root { min-height:100vh; background:#080c14; color:#e2e8f0; font-family:'Sora',sans-serif; padding:32px; }
        .sd-inner { max-width:1400px; margin:0 auto; }
        .sd-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:36px; }
        .sd-back { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:#475569; text-decoration:none; letter-spacing:.5px; text-transform:uppercase; transition:color .2s; }
        .sd-back:hover { color:#f1f5f9; }
        .sd-heading { font-size:18px; font-weight:800; color:#f1f5f9; letter-spacing:-0.3px; }
        .sd-heading span { color:#3b82f6; }
        .stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
        .stat-card { background:#0d1320; border:1px solid rgba(255,255,255,.06); border-radius:16px; padding:22px; }
        .stat-val { font-size:32px; font-weight:800; color:#f1f5f9; font-family:'JetBrains Mono',monospace; }
        .sd-cols { display:grid; grid-template-columns:1fr 420px; gap:20px; }
        .panel { background:#0d1320; border:1px solid rgba(255,255,255,.06); border-radius:16px; overflow:hidden; display:flex; flex-direction:column; }
        .panel-header { padding:20px 22px 16px; border-bottom:1px solid rgba(255,255,255,.05); }
        .panel-title { font-size:14px; font-weight:700; color:#f1f5f9; display:flex; align-items:center; gap:8px; }
        
        /* Search Bar UI */
        .club-search-wrap { margin-top: 12px; position: relative; }
        .club-search-input { width: 100%; background: rgba(8,12,20,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px 10px 36px; color: white; font-size: 12px; font-family: 'Sora', sans-serif; outline: none; transition: border-color 0.2s; }
        .club-search-input:focus { border-color: #a855f7; }
        .search-icon-inner { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #475569; }
        .search-clear-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #475569; background: none; border: none; cursor: pointer; display: flex; }
        
        .event-list, .club-list { max-height:580px; overflow-y:auto; }
        .club-row { display:flex; align-items:center; gap:12px; padding:11px 20px; border-bottom:1px solid rgba(255,255,255,.03); }
        .club-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:white; }
        .club-bar-wrap { width:100%; height:2px; background:rgba(255,255,255,.05); border-radius:2px; overflow:hidden; margin-top:6px; }
        .club-bar { height:100%; border-radius:2px; }
      `}</style>

      <div className="sd-root">
        <div className="sd-inner">
          <div className="sd-topbar">
            <Link href="/admin" className="sd-back"><ChevronLeft size={14} /> Back to Portal</Link>
            <div className="sd-heading">System <span>Intelligence</span></div>
            <button className="sd-refresh" onClick={fetchData} title="Refresh"><RefreshCw size={14} /></button>
          </div>

          {/* Stat cards (Simplified loop for code brevity) */}
          <div className="stat-grid">
             <div className="stat-card">
                <div className="stat-val">{stats.users.toLocaleString()}</div>
                <div style={{fontSize: '11px', color: '#475569', textTransform: 'uppercase', marginTop: '4px'}}>Total Users</div>
             </div>
             <div className="stat-card">
                <div className="stat-val">{stats.clubs}</div>
                <div style={{fontSize: '11px', color: '#475569', textTransform: 'uppercase', marginTop: '4px'}}>Total Clubs</div>
             </div>
             <div className="stat-card">
                <div className="stat-val">{stats.events}</div>
                <div style={{fontSize: '11px', color: '#475569', textTransform: 'uppercase', marginTop: '4px'}}>Total Events</div>
             </div>
             <div className="stat-card">
                <div className="stat-val">{stats.totalRegistrations.toLocaleString()}</div>
                <div style={{fontSize: '11px', color: '#475569', textTransform: 'uppercase', marginTop: '4px'}}>Event Regs</div>
             </div>
          </div>

          <div className="sd-cols">
            {/* LEFT: Events (Keep your existing logic) */}
            <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><Calendar size={15} color="#3b82f6" /> Event Schedule</div>
                </div>
                <div className="event-list">
                    {filteredEvents.map(ev => (
                        <div className="club-row" key={ev.id} style={{padding: '16px 20px'}}>
                            <div style={{flex: 1}}>
                                <div style={{fontWeight: 700, fontSize: '13px'}}>{ev.title}</div>
                                <div style={{fontSize: '10px', color: '#475569'}}>{ev.location} • {fmtDate(ev.event_date)}</div>
                            </div>
                            <div style={{textAlign: 'right', fontSize: '11px', color: '#3b82f6', fontWeight: 600}}>
                                {ev.registrations} registered
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Clubs with SEARCH */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">
                    <Trophy size={15} color="#a855f7" />
                    Club Registry
                  </div>
                  <div style={{fontSize: '11px', color: '#475569', marginTop: '2px'}}>Live member analytics</div>
                </div>
                
                {/* NEW: Club Search Bar */}
                <div className="club-search-wrap">
                    <Search size={14} className="search-icon-inner" />
                    <input 
                        type="text" 
                        className="club-search-input" 
                        placeholder="Search club name..." 
                        value={clubSearch}
                        onChange={(e) => setClubSearch(e.target.value)}
                    />
                    {clubSearch && (
                        <button className="search-clear-btn" onClick={() => setClubSearch('')}>
                            <X size={14} />
                        </button>
                    )}
                </div>
              </div>

              <div className="club-list">
                {filteredClubs.length === 0 ? (
                  <div style={{padding: '40px', textAlign: 'center', color: '#475569'}}>
                    <Search size={24} style={{margin: '0 auto 10px'}} />
                    <p style={{fontSize: '12px'}}>No clubs match "{clubSearch}"</p>
                  </div>
                ) : (() => {
                  const maxMembers = Math.max(...clubs.map(c => c.member_count), 1);
                  const GRAD = [['#1d4ed8','#3b82f6'], ['#7c3aed','#a855f7'], ['#0f766e','#14b8a6'], ['#c2410c','#f97316']];
                  
                  return filteredClubs.map((club, idx) => {
                    const [g1, g2] = GRAD[idx % GRAD.length];
                    const barPct = Math.round((club.member_count / maxMembers) * 100);
                    return (
                      <div className="club-row" key={club.clubid}>
                        <div className="club-icon" style={{ background: `linear-gradient(135deg,${g1},${g2})` }}>
                          {club.club_name[0].toUpperCase()}
                        </div>
                        <div style={{flex: 1, minWidth: 0}}>
                          <div style={{fontSize: '13px', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{club.club_name}</div>
                          <div style={{fontSize: '10px', color: '#475569', fontFamily: 'JetBrains Mono'}}>{club.category}</div>
                          <div className="club-bar-wrap">
                            <div className="club-bar" style={{ width: `${barPct}%`, background: `linear-gradient(90deg,${g1},${g2})` }} />
                          </div>
                        </div>
                        <div style={{textAlign: 'right'}}>
                          <div style={{fontSize: '14px', fontWeight: 700, color: g2, fontFamily: 'JetBrains Mono'}}>{club.member_count}</div>
                          <div style={{fontSize: '9px', color: '#334155', textTransform: 'uppercase'}}>active</div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}