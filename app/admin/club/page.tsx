'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, Users, Plus, X, Trash2, Loader2, ChevronRight, Trophy
} from 'lucide-react';
import Link from 'next/link';

// --- INTERFACES mapped strictly to your SQL schema ---
interface Club {
  clubid: string;
  club_name: string;
  category: string;
  club_description: string;
  active_members: number; 
  createdate: string;     
  leader_name?: string; 
}

export default function ManageClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newClub, setNewClub] = useState({ 
    club_name: '', 
    club_description: '', 
    category: 'Academic' 
  });
  
  const supabase = createClient();

  // 1. Define the callback first
const fetchClubs = useCallback(async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*, my_clubs(full_name, status)')
      .order('createdate', { ascending: false });

    if (error) throw error;
    if (data) {
      const processed = data.map((club: any) => ({
        ...club,
        leader_name: club.my_clubs?.find((m: any) => m.status === 'LEADER')?.full_name || 'No Leader Assigned'
      }));
      setClubs(processed);
    }
  } catch (err: any) {
    console.error("Fetch Error:", err.message);
  } finally {
    setLoading(false);
  }
}, [supabase]); // fetchClubs depends on supabase

// 2. Then define the effect
useEffect(() => {
  fetchClubs();
}, [fetchClubs]); // useEffect depends ONLY on fetchClubs

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('clubs').insert([newClub]);
    
    if (error) {
      alert("Registration Error: " + error.message);
    } else {
      setIsModalOpen(false);
      setNewClub({ club_name: '', club_description: '', category: 'Academic' });
      fetchClubs();
    }
  };

  const deleteClub = async (id: string) => {
    if (!confirm("This will permanently remove the organization and all member records. Proceed?")) return;
    
    // Uses 'clubid' column as defined in your primary key constraint
    const { error } = await supabase.from('clubs').delete().eq('clubid', id);
    if (!error) fetchClubs();
    else alert(error.message);
  };

  const filteredClubs = clubs.filter(club => 
    club.club_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && clubs.length === 0) return (
    <div className="h-screen bg-[#080c14] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0] font-sans p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <Link href="/admin" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1 mb-4 group transition-colors">
              <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
              Back to Portal
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Organization Registry</h1>
            <p className="text-slate-500 font-medium">Monitoring <span className="text-blue-400 font-bold">{clubs.length}</span> verified entities.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" placeholder="Search system database..."
                className="pl-12 pr-6 py-4 bg-[#0d1320] border border-white/5 rounded-2xl focus:border-blue-500/50 outline-none w-full md:w-72 transition-all text-sm font-bold placeholder:text-slate-600"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Plus size={20} /> Register Club
            </button>
          </div>
        </div>

        {/* Custom Data Grid */}
        <div className="bg-[#0d1320] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Entity Identity & Leadership</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Registry Category</th>
                <th className="px-8 py-6 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">System Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredClubs.map((club) => (
                <tr key={club.clubid} className="group hover:bg-white/[0.01] transition-all">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                        <Trophy size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg mb-1">{club.club_name}</p>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                           <Users size={12}/> {club.leader_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border border-blue-500/20 bg-blue-500/10 text-blue-400 uppercase">
                      {club.category}
                    </span>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <button 
                      onClick={() => deleteClub(club.clubid)} 
                      className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClubs.length === 0 && !loading && (
            <div className="p-24 text-center text-slate-600 font-bold italic border-t border-white/5">
              No matching records found in university registry.
            </div>
          )}
        </div>
      </div>

      {/* Deploy Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-[#0d1320] w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl border border-white/10 relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter">Initialize Entity</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400"><X size={24} /></button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest ml-1">Club Name</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-white"
                  placeholder="E.g. IEEE Student Branch"
                  onChange={(e) => setNewClub({...newClub, club_name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest ml-1">Category</label>
                <select 
                  className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-white appearance-none"
                  value={newClub.category}
                  onChange={(e) => setNewClub({...newClub, category: e.target.value})}
                >
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Tech">Technology</option>
                  <option value="Arts">Arts & Culture</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest ml-1">Description</label>
                <textarea 
                  rows={3} required
                  className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-white"
                  placeholder="Official club purpose..."
                  onChange={(e) => setNewClub({...newClub, club_description: e.target.value})}
                ></textarea>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl mt-4 shadow-xl uppercase tracking-widest text-xs">
                Activate Entity Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}