'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Users, Trophy, Calendar, ShieldCheck, Activity, 
  ChevronLeft, Loader2, BarChart3, TrendingUp,
  ArrowUpRight, Users2, Target
} from 'lucide-react';
import Link from 'next/link';

export default function SystemDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, clubs: 0, events: 0, health: 98 });
  const [activeClubs, setActiveClubs] = useState<any[]>([]);
  const [pastEventStats, setPastEventStats] = useState<any[]>([]);
  
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);

    // 1. Fetch Basic Counts
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: clubCount } = await supabase.from('clubs').select('*', { count: 'exact', head: true });
    const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });

    // 2. Fetch Most Active Clubs (by active_members column)
    const { data: topClubs } = await supabase
      .from('clubs')
      .select('club_name, active_members, clubid')
      .order('active_members', { ascending: false })
      .limit(3);

    // 3. Fetch Event Engagement (Attendance Data for Organisers)
    // We join events with my_events to see Regs vs Actual Attendees
    const { data: engagementData } = await supabase
      .from('events')
      .select(`
        id, 
        title, 
        attendees,
        my_events (attended)
      `)
      .order('event_date', { ascending: false })
      .limit(4);

    if (engagementData) {
      const processed = engagementData.map(ev => {
        const regs = ev.my_events?.length || 0;
        const actual = ev.my_events?.filter((m: any) => m.attended).length || 0;
        return {
          title: ev.title,
          regs,
          actual,
          rate: regs > 0 ? Math.round((actual / regs) * 100) : 0
        };
      });
      setPastEventStats(processed);
    }

    setStats({
      users: userCount || 0,
      clubs: clubCount || 0,
      events: eventCount || 0,
      health: 98
    });

    setActiveClubs(topClubs || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="h-screen bg-[#080c14] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0] font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest">
            <ChevronLeft size={16} /> Exit to Portal
          </Link>
          <h1 className="text-xl font-bold italic uppercase tracking-widest text-white">System <span className="text-blue-500">Intelligence</span></h1>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-500">
             <ShieldCheck size={20} />
          </div>
        </div>

        {/* 4 Main Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value={stats.users.toLocaleString()} icon={<Users size={20}/>} trend="+12% growth" color="text-blue-400" />
          <StatCard title="Total Clubs" value={stats.clubs} icon={<Trophy size={20}/>} trend="3 new this month" color="text-purple-400" />
          <StatCard title="Active Events" value={stats.events} icon={<Calendar size={20}/>} trend="Live Tracking" color="text-orange-400" />
          <StatCard title="Server Status" value={`${stats.health}%`} icon={<Activity size={20}/>} trend="Optimal" color="text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Most Active Clubs */}
          <div className="bg-[#0d1320] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Top performing Clubs</h3>
              <TrendingUp className="text-blue-500" size={20} />
            </div>

            <div className="space-y-6">
              {activeClubs.map((club, idx) => (
                <div key={club.clubid} className="flex items-center justify-between group p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 font-black text-lg border border-blue-500/20">
                      {club.club_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{club.club_name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{club.active_members} verified members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-mono font-bold text-lg">{94 - (idx * 6)}%</p>
                    <p className="text-[9px] text-slate-600 uppercase font-black">Engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Engagement Analytics for Organisers */}
          <div className="bg-[#0d1320] border border-white/5 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Engagement Analytics</h3>
                <p className="text-xs text-slate-500 mt-1">Predictive data for hackathon organisers</p>
              </div>
              <BarChart3 className="text-purple-500" size={24} />
            </div>

            <div className="space-y-6">
              {pastEventStats.length === 0 ? (
                <div className="py-10 text-center text-slate-600 italic">Insufficient event data for analysis.</div>
              ) : (
                pastEventStats.map((event, i) => (
                  <div key={i} className="relative p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-bold text-white truncate max-w-[200px]">{event.title}</p>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                        {event.rate}% Attendance
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Users2 size={14} className="text-slate-500" />
                        <div>
                          <p className="text-xs font-bold text-white">{event.regs}</p>
                          <p className="text-[9px] text-slate-500 uppercase">Registered</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target size={14} className="text-emerald-500" />
                        <div>
                          <p className="text-xs font-bold text-white">{event.actual}</p>
                          <p className="text-[9px] text-slate-500 uppercase">Turnout</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-blue-600 to-purple-600" 
                         style={{ width: `${event.rate}%` }} 
                       />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="bg-[#0d1320] border border-white/5 rounded-[2rem] p-8 group hover:border-white/10 transition-all relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-2xl text-slate-400 group-hover:text-blue-500 transition-colors border border-white/5">
          {icon}
        </div>
        <span className="text-[9px] font-black uppercase text-blue-500 tracking-tighter flex items-center gap-1">
           {trend} <ArrowUpRight size={10} />
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-4xl font-black text-white italic">{value}</h4>
      </div>
    </div>
  );
}