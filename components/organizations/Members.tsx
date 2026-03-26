"use client";

import { useState, useEffect } from "react";
import { Users, Check, X, Search, Mail, Hash, Loader2, UserMinus, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Members() {
  const [pending, setPending] = useState<any[]>([]);
  const [active, setActive] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: leader } = await supabase.from('my_clubs').select('club_id').eq('user_id', user?.id).eq('status', 'LEADER').single();

    if (leader) {
      const { data } = await supabase
        .from('my_clubs')
        .select('*')
        .eq('club_id', leader.club_id)
        .neq('status', 'LEADER') // Don't show the leader in the member list
        .order('created_at', { ascending: false });

      if (data) {
        setPending(data.filter(m => m.status === 'PENDING'));
        setActive(data.filter(m => m.status === 'ACTIVE'));
      }
    }
    setIsLoading(false);
  }

  async function updateStatus(id: string, newStatus: 'ACTIVE' | 'REJECTED') {
    const { error } = await supabase
      .from('my_clubs')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      // Refresh the local lists
      fetchMembers();
    }
  }

  const filteredActive = active.filter(m => 
    m.full_name.toLowerCase().includes(search.toLowerCase()) || 
    m.student_id.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="flex h-60 items-center justify-center"><Loader2 className="animate-spin text-[#8b5cf6]" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-white">
      <div>
        <h2 className="text-2xl font-bold">Members & Requests</h2>
        <p className="text-sm text-gray-400 mt-1">Review join requests and manage your club roster.</p>
      </div>

      {/* PENDING REQUESTS */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#8b5cf6] flex items-center gap-2">
          <Clock size={16} /> Pending Requests ({pending.length})
        </h3>
        
        {pending.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-gray-500 text-sm">No new requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map(req => (
              <div key={req.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-lg">
                    {req.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{req.full_name}</p>
                    <p className="text-xs text-gray-500">{req.student_id} • {req.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(req.id, 'REJECTED')} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <X size={18} />
                  </button>
                  <button onClick={() => updateStatus(req.id, 'ACTIVE')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">
                    <Check size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ACTIVE MEMBERS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
            <Users size={16} /> Active Members ({active.length})
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..." 
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:border-[#8b5cf6] transition-all"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredActive.map(member => (
                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold">
                        {member.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{member.full_name}</p>
                        <p className="text-[10px] text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{member.student_id}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(member.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => updateStatus(member.id, 'REJECTED')} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                      <UserMinus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}