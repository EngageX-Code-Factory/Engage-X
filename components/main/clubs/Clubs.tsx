"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, RotateCcw, Users, Calendar, Megaphone, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Clubs() {
  const router = useRouter();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/public/clubs');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        const mapped = data.map((c: any) => ({
          id: c.clubid,
          title: c.club_name,
          faculty: c.faculty || "Faculty of Excellence",
          description: c.club_description,
          members: `${c.active_members || 0} Members`,
          eventsText: "Upcoming Events",
          eventsIcon: Calendar,
          image: c.club_cover_image || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600",
          badge: c.category?.toUpperCase() || "CLUB",
          badgeColor: "bg-[#181a1f]/80 text-white",
        }));
        setClubs(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const filteredClubs = useMemo(() => {
    return clubs.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All Categories' || c.badge === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [clubs, search, categoryFilter]);

  const categories = ['All Categories', ...new Set(clubs.map(c => c.badge))];
  
  // Calculate pagination data
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClubs = filteredClubs.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen text-white pb-20 pt-10 px-4 md:px-8 lg:px-16">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Explore <span className="text-[#a855f7]">Clubs</span></h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Find your tribe. Join communities that share your passion and build lifelong<br className="hidden md:block" />
          connections on campus.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center max-w-6xl mx-auto items-stretch">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search clubs by name..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
          />
        </div>
        
        <div className="relative w-full md:w-56">
          <select 
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3.5 pl-4 pr-10 text-gray-300 text-sm appearance-none focus:outline-none focus:border-[#8b5cf6] transition-colors"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>

        <button 
          onClick={() => { setSearch(''); setCategoryFilter('All Categories'); setCurrentPage(1); }}
          className="bg-[#1e1b38] border border-[#2d2a4a] rounded-xl w-12 flex items-center justify-center shrink-0 hover:bg-[#2d2a4a] transition-colors"
        >
          <RotateCcw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-[#a855f7] animate-spin mb-4" />
          <p className="text-gray-500 font-medium italic animate-pulse">Scanning the network for clubs...</p>
        </div>
      ) : currentClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {currentClubs.map((club) => {
            const Icon = club.eventsIcon;
            return (
              <div key={club.id} className="bg-[#17152b] rounded-2xl overflow-hidden border border-[#2d2a4a] flex flex-col hover:border-[#8b5cf6]/50 transition-colors duration-300">
                {/* Image Header */}
                <div className="relative h-56 w-full">
                  <img 
                    src={club.image} 
                    alt={club.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1.5 text-[0.65rem] font-bold tracking-widest rounded-full uppercase shadow-lg ${club.badgeColor}`}>
                    {club.badge}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 relative">
                  <h3 className="text-xl font-bold text-white mb-4 italic tracking-tight">{club.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1 pr-2 line-clamp-3">
                    {club.description}
                  </p>

                  {/* Info row */}
                  <div className="flex items-center gap-6 mb-6 text-xs font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#8b5cf6]" />
                      <span>{club.members}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button 
                      onClick={() => router.push('/auth/sign-up')}
                      className="bg-[#9333ea] hover:bg-[#7e22ce] text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    >
                      Join Club
                    </button>
                    <button 
                      onClick={() => router.push('/auth/sign-up')}
                      className="bg-transparent border border-[#2d2a4a] hover:bg-[#2d2a4a] text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1e1b38] flex items-center justify-center mb-6 border border-[#2d2a4a]">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 italic tracking-tight">No Clubs Match Your Search</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
            Try adjusting your search keywords or broadening your category selection.
          </p>
          <button 
            onClick={() => { setSearch(''); setCategoryFilter('All Categories'); }}
            className="px-8 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1e1a33] border border-[#2d2a4a] text-gray-400 hover:text-white hover:bg-[#2d2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              currentPage === page 
                ? "bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-[#a855f7]" 
                : "bg-[#1e1a33] border border-[#2d2a4a] text-gray-400 hover:text-white hover:bg-[#2d2a4a]"
            }`}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1e1a33] border border-[#2d2a4a] text-gray-400 hover:text-white hover:bg-[#2d2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
