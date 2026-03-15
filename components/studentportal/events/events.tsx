'use client';

import { useState, useMemo } from 'react';
import {
  Search, Clock, MapPin, ChevronLeft, ChevronRight,
  RefreshCw, Calendar, Users, Filter, LayoutGrid, List
} from 'lucide-react';
import Link from 'next/link';
import { 
  Event, allEvents, 
  CATEGORIES, STATUS_OPTIONS, 
  CATEGORY_COLORS, STATUS_STYLES, FACULTY_COLORS 
} from './data';

const ITEMS_PER_PAGE = 9;

// ── Event Card ─────────────────────────────────────────────────────────────
function EventCard({ event }: { event: Event }) {
  const catClass  = CATEGORY_COLORS[event.category] ?? 'bg-gray-500/20 text-gray-300';
  const facColor  = FACULTY_COLORS[event.organizerFaculty] ?? 'text-purple-400';

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* ── Image ── */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Date badge — top right */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center leading-none">
          <span className="block text-white text-lg font-bold">{event.date}</span>
          <span className="block text-gray-300 text-[10px] font-medium tracking-widest mt-0.5">{event.month}</span>
        </div>
        {/* Status badge — top left */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm ${STATUS_STYLES[event.status]}`}>
          {event.status}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category pill */}
        <span className={`self-start text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full ${catClass}`}>
          {event.category}
        </span>

        {/* Title */}
        <h3 className="mt-3 text-white font-semibold text-base leading-snug">{event.title}</h3>

        {/* Organizer */}
        <div className="flex items-center gap-1.5 mt-2">
          <Users className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <p className="text-xs">
            <span className="text-gray-400">By </span>
            <span className={`font-semibold ${facColor}`}>{event.organizer}</span>
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-sm">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs">{event.time}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-1 text-gray-400">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs">{event.location}</span>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-1.5 mt-1 text-gray-500">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs">{event.attendees} attending</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Register Button */}
        {event.status === 'FILLED' ? (
          <button disabled className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-sm font-medium cursor-not-allowed">
            Waitlist Only
          </button>
        ) : (
          <Link 
            href={`/student/events/register/${event.id}`}
            className="mt-4 w-full py-2.5 rounded-xl border border-purple-500 text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors text-center"
          >
            Register
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────
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
      <button onClick={() => onChange(current + 1)} disabled={current === totalPages}
        className="p-2 rounded-xl bg-white/3 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Events() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus]     = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return allEvents.filter((e) => {
      const matchSearch   = e.title.toLowerCase().includes(search.toLowerCase())
        || e.organizer.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || e.category === category;
      const matchStatus   = status  === 'All'  || e.status   === status;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [search, category, status]);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearch(''); setCategory('All'); setStatus('All'); setCurrentPage(1);
  };

  const isFiltered = search || category !== 'All' || status !== 'All';

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Campus <span className="text-purple-400">Events</span>
        </h1>
        <p className="text-gray-400 mt-2 text-base">
          Discover and register for upcoming events across all clubs and faculties.
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
            placeholder="Search events or organizer..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none w-full"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-sm text-gray-300 outline-none hover:border-purple-500/40 transition-colors cursor-pointer min-w-[170px]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0f0c29] text-white">
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
          <ChevronLeft className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-sm text-gray-300 outline-none hover:border-purple-500/40 transition-colors cursor-pointer min-w-[140px]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[#0f0c29] text-white">
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Reset */}
        <button
          onClick={resetFilters}
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
            Showing <span className="text-white font-semibold">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
            {isFiltered && <span className="text-purple-400"> (filtered)</span>}
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

      {/* ── Event Grid/List ── */}
      {paginated.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
          {paginated.map((event) => (
            view === 'grid' ? (
              <EventCard key={event.id} event={event} />
            ) : (
              /* List row view - No images, similar to myclubs list view */
              <div
                key={event.id}
                className="bg-white/3 border border-white/10 rounded-2xl p-4 flex items-center gap-5 hover:border-purple-500/30 transition-all"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-sm">{event.title}</h3>
                    <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_COLORS[event.category]}`}>
                      {event.category}
                    </span>
                    <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${STATUS_STYLES[event.status]}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-xs mt-1">
                    <span className="text-gray-400">By </span>
                    <span className={`font-semibold ${FACULTY_COLORS[event.organizerFaculty] ?? 'text-purple-400'}`}>{event.organizer}</span>
                  </p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.date} {event.month} • {event.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0 min-w-[120px]">
                  {event.status === 'FILLED' ? (
                    <button disabled className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-xs font-medium cursor-not-allowed">
                      Waitlist
                    </button>
                  ) : (
                    <Link 
                      href={`/student/events/register/${event.id}`}
                      className="w-full py-2 rounded-xl border border-purple-500 text-purple-400 text-xs font-medium hover:bg-purple-500/10 transition-colors text-center"
                    >
                      Register
                    </Link>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-white font-semibold text-lg">No events found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
          <button onClick={resetFilters}
            className="mt-4 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors">
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
    </div>
  );
}
