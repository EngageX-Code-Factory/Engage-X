'use client';

import { useState, useMemo } from 'react';
import { Search, Users, Calendar, ChevronLeft, ChevronRight, RefreshCw, ExternalLink, UserPlus, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import JoinClubModal from './JoinClubModal';

// ── Types ──────────────────────────────────────────────────────────────────
interface Club {
  id: number;
  name: string;
  faculty: string;
  category: string;
  description: string;
  members: number;
  events: number;
  status?: string; // e.g., 'Auditions Open'
  image: string;
}

// ── Data ──────────────────────────────────────────────────────────────────
const allClubs: Club[] = [
  {
    id: 1, name: 'Robotics & AI Club', faculty: 'Faculty of Computing', category: 'TECHNOLOGY',
    description: 'Building the future with code and gears. Join us for weekly workshops, hackathons, and robot wars.',
    members: 150, events: 3,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=280&fit=crop',
  },
  {
    id: 2, name: 'Rhythm Music Society', faculty: 'Faculty of Arts', category: 'MUSIC',
    description: 'For those who live and breathe music. Jam sessions every Friday and annual campus concerts.',
    members: 85, events: 1,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=280&fit=crop',
  },
  {
    id: 3, name: 'Extreme Sports Club', faculty: 'Sports Department', category: 'SPORTS',
    description: 'Pushing limits together. From rock climbing to surfing, we organize monthly trips for adrenaline seekers.',
    members: 120, events: 2,
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&h=280&fit=crop',
  },
  {
    id: 4, name: 'Drama & Theatre', faculty: 'Faculty of Arts', category: 'ARTS',
    description: 'Express yourself on stage. We produce two major plays a year and host weekly improv workshops.',
    members: 60, events: 0, status: 'Auditions Open',
    image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&h=280&fit=crop',
  },
  {
    id: 5, name: 'Science Research Hub', faculty: 'Faculty of Science', category: 'ACADEMIC',
    description: 'Collaborate on cutting-edge research projects. Connect with professors and publish your findings.',
    members: 45, events: 1,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=280&fit=crop',
  },
  {
    id: 6, name: 'Photography Society', faculty: 'Faculty of Arts', category: 'ARTS',
    description: 'Capturing moments, creating memories. Weekly shoots, exhibitions, and darkroom access.',
    members: 48, events: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=280&fit=crop',
  },
  {
    id: 7, name: 'Coding Club', faculty: 'Faculty of Engineering', category: 'TECHNOLOGY',
    description: 'Building the future, one line at a time. Join us for weekly hackathons, CTFs and open-source contributions.',
    members: 120, events: 4,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=280&fit=crop',
  },
  {
    id: 8, name: 'Debate Society', faculty: 'Faculty of Humanities', category: 'ACADEMIC',
    description: 'Sharpen argumentation and public speaking in competitive, collegiate-level environments.',
    members: 34, events: 2,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=280&fit=crop',
  },
  {
    id: 9, name: 'Football Club', faculty: 'Sports Department', category: 'SPORTS',
    description: 'Train and compete with the best. We participate in inter-university leagues and friendly tournaments.',
    members: 200, events: 5,
    image: 'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?w=600&h=280&fit=crop',
  },
  {
    id: 10, name: 'Entrepreneurship Cell', faculty: 'Faculty of Business', category: 'BUSINESS',
    description: 'Connect ideas with execution. Mentorship, pitch competitions, and startup ecosystem access.',
    members: 73, events: 3,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=280&fit=crop',
  },
  {
    id: 11, name: 'Film Society', faculty: 'Faculty of Arts', category: 'ARTS',
    description: 'Cinephiles unite! Weekly screenings, discussions, and short film production projects.',
    members: 52, events: 2,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=280&fit=crop',
  },
  {
    id: 12, name: 'Environmental Club', faculty: 'Faculty of Science', category: 'ACADEMIC',
    description: 'Sustainability initiatives, campus clean-ups, and environmental awareness campaigns for a greener future.',
    members: 41, events: 1,
    image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&h=280&fit=crop',
  },
];

const CATEGORIES = ['All', 'TECHNOLOGY', 'ARTS', 'MUSIC', 'SPORTS', 'ACADEMIC', 'BUSINESS'];
const FACULTIES = ['All Faculties', 'Faculty of Computing', 'Faculty of Arts', 'Faculty of Engineering',
  'Faculty of Science', 'Faculty of Humanities', 'Faculty of Business', 'Sports Department'];

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
  const facultyColor = club.faculty === 'Faculty of Arts' ? 'text-amber-400'
    : club.faculty === 'Faculty of Computing' ? 'text-indigo-400'
    : club.faculty === 'Faculty of Science' ? 'text-emerald-400'
    : club.faculty === 'Faculty of Engineering' ? 'text-sky-400'
    : club.faculty === 'Faculty of Humanities' ? 'text-orange-400'
    : club.faculty === 'Faculty of Business' ? 'text-violet-400'
    : 'text-pink-400';

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Club Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={club.image}
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
        <p className={`text-[11px] font-semibold tracking-wide uppercase mt-0.5 ${facultyColor}`}>
          {club.faculty}
        </p>

        <p className="text-gray-400 text-sm mt-2.5 leading-relaxed flex-1 line-clamp-3">
          {club.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span className="text-gray-300 font-medium">{club.members}+ Members</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-gray-300 font-medium">
              {club.events} Upcoming Event{club.events !== 1 ? 's' : ''}
            </span>
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
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [faculty, setFaculty] = useState('All Faculties');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleJoinClick = (club: Club) => {
    setSelectedClub(club);
    setShowJoinModal(true);
  };

  const filtered = useMemo(() => {
    return allClubs.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || c.category === category;
      const matchFaculty = faculty === 'All Faculties' || c.faculty === faculty;
      return matchSearch && matchCategory && matchFaculty;
    });
  }, [search, category, faculty]);

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (setter: (v: string) => void) => (val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setFaculty('All Faculties');
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

        {/* Faculty Dropdown */}
        <div className="relative">
          <select
            value={faculty}
            onChange={(e) => handleFilterChange(setFaculty)(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-sm text-gray-300 outline-none hover:border-purple-500/40 transition-colors cursor-pointer min-w-[180px]"
          >
            {FACULTIES.map((f) => (
              <option key={f} value={f} className="bg-[#0f0c29] text-white">{f}</option>
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
            {(category !== 'All' || faculty !== 'All Faculties' || search) && (
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
      {paginated.length > 0 ? (
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
                  <p className="text-amber-400 text-[11px] font-semibold tracking-wide uppercase mt-0.5">{club.faculty}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {club.members}+ members</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {club.events} upcoming events</span>
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
