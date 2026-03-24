'use client';

import { useState, useEffect } from 'react';
import {
  Users, Calendar, Award, LayoutGrid, List,
  ChevronLeft, ChevronRight, ExternalLink, LogOut,
  Clock, MapPin
} from 'lucide-react';
import Link from 'next/link';
import ConfirmationModal from '../layout/ConfirmationModal';

// ── Types ──────────────────────────────────────────────────────────────────
interface Club {
  id: string; // UUID
  name: string;
  category: string;
  description: string;
  nextMeet: string;
  status: 'Active' | 'Inactive' | 'Leader' | 'Pending' | 'Rejected';
  members: number;
  bannerGradient: string;
  iconBg: string;
}

interface MyEvent {
  id: string; // UUID
  title: string;
  clubName: string;
  category: string;
  date: string;
  month: string;
  time: string;
  location: string;
  status: 'Registered' | 'Waitlist' | 'Confirmed' | 'Pending';
  image: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

const statusConfig: Record<string, { label: string; class: string }> = {
  Active: { label: 'Active Member', class: 'bg-purple-600/80 text-white' },
  Leader: { label: 'Leader', class: 'bg-amber-500/80 text-white' },
  Inactive: { label: 'Inactive', class: 'bg-white/10 text-gray-300' },
  Pending: { label: 'Pending', class: 'bg-blue-500/80 text-white' },
  Rejected: { label: 'Rejected', class: 'bg-red-500/80 text-white' },
};

const categoryColor: Record<string, string> = {
  ARTS: 'bg-pink-500/20 text-pink-300',
  TECHNOLOGY: 'bg-indigo-500/20 text-indigo-300',
  MUSIC: 'bg-purple-500/20 text-purple-300',
  RHETORIC: 'bg-amber-500/20 text-amber-300',
  BUSINESS: 'bg-violet-500/20 text-violet-300',
  SCIENCE: 'bg-emerald-500/20 text-emerald-300',
};

// Gradient mapping helpers
const getGradient = (category: string) => {
  switch (category?.toUpperCase()) {
    case 'TECHNOLOGY': return 'from-indigo-900 via-purple-800 to-indigo-700';
    case 'ARTS': return 'from-slate-700 via-slate-600 to-slate-500';
    case 'MUSIC': return 'from-pink-900 via-rose-800 to-pink-700';
    case 'BUSINESS': return 'from-violet-900 via-purple-800 to-fuchsia-700';
    case 'SCIENCE': return 'from-green-900 via-emerald-800 to-green-700';
    default: return 'from-slate-700 via-slate-600 to-slate-500';
  }
};

const getIconBg = (category: string) => {
  switch (category?.toUpperCase()) {
    case 'TECHNOLOGY': return 'bg-indigo-500/30';
    case 'ARTS': return 'bg-slate-500/30';
    case 'MUSIC': return 'bg-pink-500/30';
    case 'BUSINESS': return 'bg-violet-500/30';
    case 'SCIENCE': return 'bg-green-500/30';
    default: return 'bg-slate-500/30';
  }
};

// ── Sub-components ────────────────────────────────────────────────────────
function SummaryStat({
  icon,
  value,
  label,
  onClick,
  active
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all cursor-pointer group ${
        active 
          ? 'bg-purple-500/10 border-purple-500/50' 
          : 'bg-white/3 border-white/10 hover:border-purple-500/30'
      }`}
    >
      <div className="shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className={`text-2xl font-bold leading-tight ${active ? 'text-purple-400' : 'text-white'}`}>{value}</p>
        <p className="text-sm text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function MyEventCard({ event }: { event: MyEvent }) {
  const catClass = categoryColor[event.category] ?? 'bg-gray-500/20 text-gray-300';
  const statusStyle = event.status === 'Registered' || event.status === 'Confirmed' 
    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    : event.status === 'Waitlist'
    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30';

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* ── Image ── */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <img
          src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Date badge — top right */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center leading-none">
          <span className="block text-white text-lg font-bold">{event.date}</span>
          <span className="block text-gray-300 text-[10px] font-medium tracking-widest mt-0.5">{event.month}</span>
        </div>
        {/* Status badge — top left */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm ${statusStyle}`}>
          {event.status.toUpperCase()}
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
            <span className="font-semibold text-purple-400">{event.clubName}</span>
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

        {/* Spacer */}
        <div className="flex-1" />
      </div>
    </div>
  );
}

function ClubCard({ club, onLeave }: { club: Club; onLeave: (club: Club) => void }) {
  const { label: statusLabel, class: statusClass } = statusConfig[club.status];
  const catClass = categoryColor[club.category] ?? 'bg-gray-500/20 text-gray-300';

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group flex flex-col">
      {/* Banner */}
      <div className={`relative h-32 bg-gradient-to-br ${club.bannerGradient}`}>
        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full ${statusClass}`}>
          {statusLabel}
        </span>
        {/* Category badge */}
        <span className={`absolute top-3 right-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full ${catClass}`}>
          {club.category}
        </span>
        {/* Icon */}
        <div className={`absolute bottom-0 translate-y-1/2 left-5 w-14 h-14 rounded-xl ${club.iconBg} border border-white/10 backdrop-blur-sm flex items-center justify-center`}>
          <Users className="w-6 h-6 text-white/70" />
        </div>
      </div>

      {/* Body */}
      <div className="pt-10 px-5 pb-5 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-base leading-tight">{club.name}</h3>

        <p className="text-gray-400 text-sm mt-3 leading-relaxed flex-1">{club.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Next Meet: <span className="text-gray-300 font-medium">{club.nextMeet}</span>
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <Users className="w-3.5 h-3.5" />
            <span className="text-gray-300 font-medium">{club.members}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link
            href={`/student/all-clubs/${club.id}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Dashboard
          </Link>
          <button 
            onClick={() => onLeave(club)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave Club
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  total,
  perPage,
  current,
  onChange,
}: {
  total: number;
  perPage: number;
  current: number;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="p-2 rounded-xl bg-white/3 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
            page === current
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-white/3 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
        className="p-2 rounded-xl bg-white/3 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function MyClubs() {
  const [activeTab, setActiveTab] = useState<'clubs' | 'events'>('clubs');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  
  // Data State
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // GET My Clubs
        const clubsRes = await fetch('/api/student/my-clubs');
        if (clubsRes.ok) {
          const data = await clubsRes.json();
          // Map DB response to UI state
          const mapped: Club[] = data.map((item: any) => ({
            id: item.clubs.clubid,
            name: item.clubs.club_name,
            category: item.clubs.category || 'General',
            description: item.clubs.club_description || 'No description available',
            nextMeet: item.clubs.meeting_day || 'TBA',
            status: mapClubStatus(item.status),
            members: item.clubs.active_members || 0,
            bannerGradient: getGradient(item.clubs.category),
            iconBg: getIconBg(item.clubs.category)
          }));
          setClubs(mapped);
        } else {
             const errText = await clubsRes.text();
             console.error("Failed to fetch clubs:", clubsRes.status, errText);
        }
        
        // GET My Events
        const eventsRes = await fetch('/api/student/my-events');
        if (eventsRes.ok) {
           const data = await eventsRes.json();
           const mapped: MyEvent[] = data.map((item: any) => {
             const d = new Date(item.events.event_date);
             return {
               id: item.events.id,
               title: item.events.title,
               clubName: item.events.clubs?.club_name || 'Unknown',
               category: item.events.clubs?.category || 'General',
               date: d.getDate().toString(),
               month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
               time: item.events.event_time,
               location: item.events.location,
               status: mapEventStatus(item.status),
               image: item.events.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
             };
           });
           setEvents(mapped);
        } else {
            const errText = await eventsRes.text();
            console.error("Failed to fetch events:", eventsRes.status, errText);
        }

      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function mapClubStatus(s: string): Club['status'] {
    switch (s?.toUpperCase()) {
      case 'ACTIVE': return 'Active';
      case 'PENDING': return 'Pending';
      case 'REJECTED': return 'Rejected';
      case 'LEADER': return 'Leader';
      default: return 'Inactive';
    }
  }

  function mapEventStatus(s: string): MyEvent['status'] {
    switch (s?.toUpperCase()) {
      case 'CONFIRMED': return 'Confirmed';
      case 'WAITLISTED': return 'Waitlist';
      case 'PENDING': return 'Pending';
      default: return 'Registered';
    }
  }

  const handleLeaveClick = (club: Club) => {
    setSelectedClub(club);
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    if (selectedClub) {
      console.log(`Leaving club: ${selectedClub.name}`);
      // Actual leave logic would go here
       setShowLeaveModal(false);
    }
  };

  const activeClubs = clubs.filter((c) => c.status === 'Active' || c.status === 'Leader');
  const upcomingEventsCount = events.length;

  const displayedItems = activeTab === 'clubs' ? clubs : events;
  const totalPages = Math.ceil(displayedItems.length / ITEMS_PER_PAGE);

  const paginatedItems = displayedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <div className="text-white text-center py-20">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          My <span className="text-purple-400">Dashboard</span>
        </h1>
        <p className="text-gray-400 mt-2 text-base">
          Manage your memberships and stay on top of your upcoming activities.
        </p>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div onClick={() => { setActiveTab('clubs'); setCurrentPage(1); }} className="cursor-pointer transition-transform hover:scale-[1.01]">
          <SummaryStat
            icon={
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            }
            value={activeClubs.length}
            label="Active Memberships"
            active={activeTab === 'clubs'}
          />
        </div>
        <div onClick={() => { setActiveTab('events'); setCurrentPage(1); }} className="cursor-pointer transition-transform hover:scale-[1.01]">
          <SummaryStat
            icon={
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-400" />
              </div>
            }
            value={upcomingEventsCount}
            label="Upcoming Events"
            active={activeTab === 'events'}
          />
        </div>
        <SummaryStat
          icon={
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          }
          value="Gold"
          label="Member Status"
        />
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className={`w-1 h-5 ${activeTab === 'clubs' ? 'bg-purple-500' : 'bg-indigo-500'} rounded-full inline-block`} />
            {activeTab === 'clubs' ? 'My Clubs' : 'My Upcoming Events'}
          </h2>
          <span className="text-xs text-gray-500 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 font-medium">
            {displayedItems.length} {activeTab === 'clubs' ? 'joined' : 'registered'}
          </span>
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

      {/* ── Content Grid ── */}
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'flex flex-col gap-4'
        }
      >
        {activeTab === 'clubs' ? (
          paginatedItems.map((item) => (
             view === 'grid' ? (
              <ClubCard key={(item as Club).id} club={item as Club} onLeave={handleLeaveClick} />
            ) : (
              /* List row view for clubs */
              <div
                key={(item as Club).id}
                className="bg-white/3 border border-white/10 rounded-2xl p-4 flex items-center gap-5 hover:border-purple-500/30 transition-all"
              >
                <div className={`w-12 h-12 shrink-0 rounded-xl ${(item as Club).iconBg} border border-white/10 flex items-center justify-center`}>
                  <Users className="w-5 h-5 text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-bold text-base leading-tight">{(item as Club).name}</h3>
                    <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full ${statusConfig[(item as Club).status]?.class || 'bg-gray-500'}`}>
                        {(item as Club).status}
                    </span>
                  </div>
                  {/* <p className="text-amber-400 text-[11px] font-semibold tracking-wide uppercase mt-0.5">{(item as Club).faculty}</p> */}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Next Meet: <span className="text-gray-300 font-medium">{(item as Club).nextMeet}</span>
                    </span>
                    <span className="flex items-center gap-1.5 ml-auto">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-gray-300 font-medium">{(item as Club).members}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/student/all-clubs/${(item as Club).id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </Link>
                  <button 
                    onClick={() => handleLeaveClick(item as Club)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Leave
                  </button>
                </div>
              </div>
            )
          ))
        ) : (
          paginatedItems.map((item) => {
            const evt = item as MyEvent; // Type assertion since we know it's MyEvent in this branch
            return view === 'grid' ? (
                <MyEventCard key={evt.id} event={evt} />
            ) : (
                /* List View for Events */
                <div key={evt.id} className="bg-white/3 border border-white/10 rounded-2xl p-4 flex items-center gap-5 hover:border-purple-500/30 transition-all">
                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden">
                       <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full ${categoryColor[evt.category]}`}>
                                {evt.category}
                             </span>
                         </div>
                         <h3 className="text-white font-bold text-base leading-tight">{evt.title}</h3>
                         <div className="flex items-center gap-1.5 mt-1">
                            <Users className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <p className="text-xs">
                                <span className="text-gray-400">By </span>
                                <span className="font-semibold text-purple-400">{evt.clubName}</span>
                            </p>
                        </div>
                    </div>
                    {/* Status Pill */}
                    <div className="flex flex-col items-end justify-center min-w-[100px] shrink-0">
                         <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full ${
                             evt.status === 'Registered' || evt.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                         }`}>
                             {evt.status.toUpperCase()}
                         </span>
                         <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                             <Clock className="w-3.5 h-3.5" /> {evt.time}
                         </div>
                    </div>
                </div>
            )
          })
        )}
      </div>

      {/* ── Pagination ── */}
      <Pagination
        total={displayedItems.length}
        perPage={ITEMS_PER_PAGE}
        current={currentPage}
        onChange={(p) => {
          setCurrentPage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      <ConfirmationModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleConfirmLeave}
        title="Leave Club"
        message={`Are you sure you want to leave ${selectedClub?.name}? You will lose access to member-only events and content.`}
        confirmText="Confirm Leave"
        type="danger"
      />
    </div>
  );
}
