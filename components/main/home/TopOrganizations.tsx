'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Users, Star, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Club {
  clubid: string;
  club_name: string;
  category: string;
  club_description: string;
  active_members: number;
  ratings: number;
  club_cover_image: string;
}

export default function TopOrganizations() {
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'members' | 'rating'>('members');

  useEffect(() => {
    async function fetchClubs() {
      try {
        const response = await fetch('/api/public/clubs');
        if (!response.ok) throw new Error('Failed to fetch clubs');
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  const getTopThree = () => {
    const sorted = [...clubs].sort((a, b) => {
      if (activeFilter === 'members') {
        return (b.active_members || 0) - (a.active_members || 0);
      }
      return (b.ratings || 0) - (a.ratings || 0);
    });

    const top3 = sorted.slice(0, 3);
    // Return in order: [Rank 2, Rank 1, Rank 3] for the grid layout
    return [top3[1], top3[0], top3[2]].filter(Boolean);
  };

  const topThree = getTopThree();

  if (loading) {
    return (
      <section className="relative py-32 bg-[#0b0515] overflow-hidden flex items-center justify-center min-h-[600px]">
         <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative py-32 bg-[#0b0515] overflow-hidden">
      {/* Creative Dynamic Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-1/4 -left-1/4 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000 delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0515]/80 to-[#0b0515]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Top <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-gradient-x">Organizations</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Discover the most active and highly rated student communities leading the way in innovation and engagement.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-2xl flex relative overflow-hidden">
              <div 
                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl transition-all duration-500 ease-out ${
                  activeFilter === 'members' ? 'left-1' : 'left-[calc(50%+2px)]'
                }`}
              ></div>
              <button 
                onClick={() => setActiveFilter('members')}
                className={`relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors duration-300 ${activeFilter === 'members' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Most Popular
              </button>
              <button 
                onClick={() => setActiveFilter('rating')}
                className={`relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors duration-300 ${activeFilter === 'rating' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Top Rated
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-20 items-center">
          {topThree.map((club, index) => {
             // Mapping visual ranks: Array is [Rank 2, Rank 1, Rank 3]
             const rank = index === 0 ? 2 : index === 1 ? 1 : 3;
             const isRank1 = rank === 1;
             
             return (
               <div 
                 key={club.clubid || index}
                 className={`group relative bg-[#130a21]/50 backdrop-blur-2xl border transition-all duration-700 hover:-translate-y-4 overflow-hidden rounded-3xl p-6 md:p-8
                   ${isRank1 
                     ? 'border-yellow-500/30 scale-100 md:scale-110 z-20 hover:border-yellow-500/60 shadow-[0_0_60px_rgba(234,179,8,0.1)]' 
                     : rank === 2 
                       ? 'border-white/[0.05] hover:border-gray-400/50 hover:shadow-[0_0_40px_rgba(156,163,175,0.15)]'
                       : 'border-white/[0.05] hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]'
                   }`}
               >
                 <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500
                   ${isRank1 ? 'from-yellow-500/10' : rank === 2 ? 'from-gray-400/5' : 'from-orange-500/5'}`}
                 ></div>

                 {/* Image Container */}
                 <div className={`relative overflow-hidden rounded-2xl mb-8 shadow-2xl border
                   ${isRank1 ? 'border-yellow-500/20' : 'border-white/5'}`}
                 >
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                   <Image
                     src={club.club_cover_image || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80"}
                     alt={club.club_name}
                     width={600}
                     height={400}
                     className={`w-full ${isRank1 ? 'h-64' : 'h-56'} object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out`}
                   />
                   <div className="absolute bottom-4 left-4 z-20">
                     <div className={`inline-flex items-center px-3 py-1 rounded-full backdrop-blur-md border text-xs font-bold mb-2
                       ${isRank1 
                         ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' 
                         : 'bg-white/10 border-white/20 text-gray-300'}`}
                     >
                       {club.category || 'General'}
                     </div>
                   </div>
                 </div>

                 {/* Content */}
                 <div className="relative z-20">
                   <h3 className={`font-bold mb-6 transition-colors line-clamp-1
                     ${isRank1 ? 'text-3xl text-white group-hover:text-yellow-300' : 'text-2xl text-white group-hover:text-gray-300'}`}
                   >
                     {club.club_name}
                   </h3>

                   <div className={`flex justify-between mb-8 p-5 rounded-2xl bg-white/[0.03] border
                     ${isRank1 ? 'border-yellow-500/20 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]' : 'border-white/5'}`}
                   >
                     <div className="text-center">
                       <div className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r 
                         ${isRank1 ? 'from-yellow-300 to-orange-500 text-3xl' : 'from-gray-300 to-white'}`}
                       >
                         {club.active_members}+
                       </div>
                       <div className={`text-[10px] uppercase tracking-widest mt-1 ${isRank1 ? 'text-yellow-500/80' : 'text-gray-400'}`}>Members</div>
                     </div>
                     <div className={`w-px ${isRank1 ? 'bg-yellow-500/20' : 'bg-white/10'}`}></div>
                     <div className="text-center">
                       <div className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r 
                         ${isRank1 ? 'from-yellow-300 to-orange-500 text-3xl' : 'from-gray-300 to-white'}`}
                       >
                         {club.ratings || 4.5}
                       </div>
                       <div className={`text-[10px] uppercase tracking-widest mt-1 ${isRank1 ? 'text-yellow-500/80' : 'text-gray-400'}`}>Rating</div>
                     </div>
                   </div>

                   <button 
                     onClick={() => router.push("/auth/sign-up")}
                     className={`w-full relative flex items-center justify-center gap-2 group/btn overflow-hidden rounded-xl py-4 font-bold transition-all
                       ${isRank1 
                         ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
                         : 'border border-white/20 bg-white/5 text-gray-200 hover:bg-white/10 hover:border-white/40 hover:text-white'}`}
                   >
                     <span className="relative z-10">View Club</span>
                     <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1.5 transition-transform relative z-10" />
                     {isRank1 && <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>}
                   </button>
                 </div>

                 {/* Rank Badge */}
                 <div className={`absolute flex items-center justify-center font-black shadow-2xl border z-30 transform transition-transform duration-500
                   ${isRank1 
                     ? '-top-2 -right-2 w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 rounded-3xl rotate-12 group-hover:rotate-0 border-yellow-200/50' 
                     : rank === 2
                       ? '-top-2 -left-2 w-14 h-14 bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 rounded-2xl -rotate-12 group-hover:rotate-0 border-gray-300/30'
                       : '-top-2 -right-2 w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl rotate-12 group-hover:rotate-0 border-orange-300/30'
                   }`}
                 >
                   <span className={`text-white drop-shadow-md ${isRank1 ? 'text-4xl' : 'text-2xl'}`}>{rank}</span>
                   <div className="absolute inset-0 rounded-2xl bg-white/20 filter blur-sm"></div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
}
