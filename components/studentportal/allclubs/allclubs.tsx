'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Users, ChevronLeft, ChevronRight, RefreshCw, ExternalLink, UserPlus, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import JoinClubModal from './JoinClubModal';

// ── Types ──────────────────────────────────────────────────────────────────
interface Club {
  id: string; // Changed from number to string for UUID
  name: string;
  category: string;
  description: string;
  members_count: number; // Mapped from members
  events_count: number; // Mapped from events
  status?: string; // e.g., 'Auditions Open'
  image_url: string; // Mapped from image
}

interface DbClub {
  clubid: string;
  club_name: string;
  category: string;
  club_description: string;
  active_members: number;
  club_cover_image: string;
}

// ── Data ──────────────────────────────────────────────────────────────────
// Initial empty state, will fetch from API
const initialClubs: Club[] = [];

const CATEGORIES = ['All', 'TECHNOLOGY', 'ARTS', 'MUSIC', 'SPORTS', 'ACADEMIC', 'BUSINESS'];

const CATEGORY_COLORS: Record<string, string> = {
  TECHNOLOGY: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/20',
  ARTS: 'bg-pink-500/20 text-pink-300 border-pink-500/20',
  MUSIC: 'bg-purple-500/20 text-purple-300 border-purple-500/20',
  SPORTS: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  ACADEMIC: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
  BUSINESS: 'bg-violet-500/20 text-violet-300 border-violet-500/20',
};

const ITEMS_PER_PAGE = 6;

// ── Club Card ─────────────────────────────────────────────────────────────
function ClubCard({ club, onJoin }: { club: Club; onJoin: (club: Club) => void }) {
  const catClass = CATEGORY_COLORS[club.category] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/20';

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Club Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={club.image_url}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge */}
        <span className={`absolute top-3 right-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${catClass} backdrop-blur-sm`}>
          {club.category}
        </span>
        {/* Status badge */}
        {club.status && (
          <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full bg-purple-600/80 text-white backdrop-blur-sm">
            {club.status}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-base leading-tight">{club.name}</h3>

        <p className="text-gray-400 text-sm mt-2.5 leading-relaxed flex-1 line-clamp-3">
          {club.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span className="text-gray-300 font-medium">{club.members_count}+ Members</span>
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link
            href={`/student/all-clubs/${club.id}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Details
          </Link>
          <button 
            onClick={() => onJoin(club)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-gray-300 text-sm font-medium transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> Join Club
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────
function Pagination({ total, perPage, current, onChange }: {
  total: number; perPage: number; current: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="p-2 rounded-xl bg-white/3 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button key={page} onClick={() => onChange(page)}
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
            page === current
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-white/3 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40'
          }`}>
          {page}
        </button>
      ))}
      <button onClick={() => onChange(current + 1)} disabled={current === Math.ceil(total / perPage)}
        className="p-2 rounded-xl bg-white/3 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function AllClubs() {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/student/clubs');
        if (response.ok) {
          const data = await response.json();
          const mappedClubs = data.map((club: DbClub) => ({
            id: club.clubid,
            name: club.club_name,
            category: club.category,
            description: club.club_description,
            members_count: club.active_members,
            events_count: 0,
            image_url: club.club_cover_image,
          }));
          setClubs(mappedClubs);
        }
      } catch (error) {
        console.error('Failed to fetch clubs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleJoinClick = (club: Club) => {
    setSelectedClub(club);
    setShowJoinModal(true);
  };

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || c.category === category;
      return matchSearch && matchCategory;
    });
  }, [clubs, search, category]);

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (setter: (v: string) => void) => (val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          All <span className="text-purple-400">Clubs</span>
        </h1>
        <p className="text-gray-400 mt-2 text-base">
          Discover clubs that match your interests and passions.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-3 mb-8 bg-white/3 border border-white/10 rounded-2xl p-3">
        {/* Search */}
        <div className="flex items-center gap-2.5 flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search clubs by name..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none w-full"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-sm text-gray-300 outline-none hover:border-purple-500/40 transition-colors cursor-pointer min-w-[160px]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0f0c29] text-white">
                {c === 'All' ? 'Select Category' : c}
              </option>
            ))}
          </select>
          <ChevronLeft className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          title="Reset filters"
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Result count & View Toggle ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
          <p className="text-sm text-gray-400">
            Showing <span className="text-white font-semibold">{filtered.length}</span> club{filtered.length !== 1 ? 's' : ''}
            {(category !== 'All' || search) && (
              <span className="text-purple-400"> (filtered)</span>
            )}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Result Grid/List ── */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <RefreshCw className="w-10 h-10 text-purple-500 animate-spin" />
        </div>
      ) : paginated.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
          {paginated.map((club) => (
            view === 'grid' ? (
              <ClubCard key={club.id} club={club} onJoin={handleJoinClick} />
            ) : (
              /* List row view - No images, similar to myclubs list view */
              <div
                key={club.id}
                className="bg-white/3 border border-white/10 rounded-2xl p-4 flex items-center gap-5 hover:border-purple-500/30 transition-all"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 border border-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-sm">{club.name}</h3>
                    <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_COLORS[club.category]}`}>
                      {club.category}
                    </span>
                    {club.status && (
                      <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-600/80 text-white">
                        {club.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {club.members_count}+ members</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/student/all-clubs/${club.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Details
                  </Link>
                  <button 
                    onClick={() => handleJoinClick(club)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Join
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-white font-semibold text-lg">No clubs found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
          <button
            onClick={handleReset}
            className="mt-4 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ── Pagination ── */}
      <Pagination
        total={filtered.length}
        perPage={ITEMS_PER_PAGE}
        current={currentPage}
        onChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />

      <JoinClubModal 
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        clubName={selectedClub?.name || ''}
        category={selectedClub?.category || ''}
      />
    </div>
  );
}
