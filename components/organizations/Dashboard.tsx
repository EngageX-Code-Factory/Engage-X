"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Users, Clock, TrendingUp, Calendar, 
  Send, UserCircle, Loader2, ArrowRight, CheckCircle2 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeMembers: 0,
    pendingRequests: 0,
    attendanceRate: 0,
  });
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: leader } = await supabase
        .from('my_clubs')
        .select('club_id')
        .eq('user_id', user.id)
        .eq('status', 'LEADER')
        .single();

      if (!leader) return setIsLoading(false);

      const clubId = leader.club_id;

      // 1. Fetch Stats & Recent Requests in parallel
      const [eventsRes, membersRes, pendingRes, attendanceRes, recentRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }).eq('club_id', clubId),
        supabase.from('my_clubs').select('id', { count: 'exact' }).eq('club_id', clubId).eq('status', 'ACTIVE'),
        supabase.from('my_clubs').select('id', { count: 'exact' }).eq('club_id', clubId).eq('status', 'PENDING'),
        supabase.from('my_events').select('attended').eq('club_id', clubId),
        supabase.from('my_clubs')
          .select('id, full_name, created_at, student_id')
          .eq('club_id', clubId)
          .eq('status', 'PENDING')
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // 2. Calculate Real Attendance Rate
      let rate = 0;
      if (attendanceRes.data && attendanceRes.data.length > 0) {
        const attendedCount = attendanceRes.data.filter(r => r.attended === true).length;
        rate = Math.round((attendedCount / attendanceRes.data.length) * 100);
      }

      setStats({
        totalEvents: eventsRes.count || 0,
        activeMembers: membersRes.count || 0,
        pendingRequests: pendingRes.count || 0,
        attendanceRate: rate,
      });

      setPendingRequests(recentRes.data || []);
      setIsLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#8b5cf6] h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Welcome back! 👋</h2>
          <p className="text-gray-400 mt-1">Here is what is happening with your club today.</p>
        </div>
        <Link href="/organization/events/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20">
          <Plus size={18} /> New Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Events" value={stats.totalEvents} icon={Calendar} color="bg-blue-600" />
        <StatCard label="Active Members" value={stats.activeMembers} icon={Users} color="bg-emerald-600" />
        <StatCard label="Pending Requests" value={stats.pendingRequests} icon={Clock} color="bg-amber-500" />
        <StatCard label="Attendance Rate" value={`${stats.attendanceRate}%`} icon={TrendingUp} color="bg-purple-600" />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard title="Create New Event" desc="Schedule and publish an event" icon={Plus} href="/organization/events/create" />
          <ActionCard title="Review Requests" desc="Approve or reject join requests" icon={Users} href="/organization/members" />
          <ActionCard title="Send Notification" desc="Alert members about updates" icon={Send} href="/organization/notifications" />
          <ActionCard title="Club Profile" desc="Edit your club details" icon={UserCircle} href="/organization/profile" />
        </div>
      </div>

      {/* Pending Registrations Section */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent Member Requests</h3>
          <Link href="/organization/members" className="text-[#8b5cf6] text-xs hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="p-8">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <Users size={40} className="mx-auto text-white/10 mb-3" />
              <p className="text-gray-400 font-medium">All caught up!</p>
              <p className="text-gray-600 text-sm mt-1">No pending student requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] font-bold">
                      {req.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{req.full_name}</p>
                      <p className="text-xs text-gray-500">{req.student_id} • {new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link href="/organization/members" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className={`${color} rounded-[24px] p-6 text-white shadow-xl shadow-black/20`}>
      <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
        <Icon size={20} />
      </div>
      <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-bold mt-1 tracking-tighter">{value}</p>
    </div>
  );
}

function ActionCard({ title, desc, icon: Icon, href }: any) {
  return (
    <Link href={href} className="bg-white/5 border border-white/10 p-6 rounded-[24px] hover:bg-white/10 transition-all group">
      <div className="bg-[#8b5cf6]/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-[#8b5cf6] group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <p className="text-white font-semibold text-sm">{title}</p>
      <p className="text-gray-500 text-[11px] mt-1 leading-tight">{desc}</p>
    </Link>
  );
}