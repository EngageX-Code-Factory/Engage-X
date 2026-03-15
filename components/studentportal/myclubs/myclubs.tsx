'use client';

import { useState } from 'react';
import {
  Users, Calendar, Award, LayoutGrid, List,
  ChevronLeft, ChevronRight, ExternalLink, LogOut,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import ConfirmationModal from '../layout/ConfirmationModal';

// ── Types ──────────────────────────────────────────────────────────────────
interface Club {
  id: number;
  name: string;
  faculty: string;
  category: string;
  description: string;
  nextMeet: string;
  status: 'Active' | 'Inactive' | 'Leader';
  members: number;
  bannerGradient: string;
  iconBg: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────
const clubs: Club[] = [
  {
    id: 1,
    name: 'Photography Society',
    faculty: 'Faculty of Arts',
    category: 'ARTS',
    description: 'Capturing moments, creating memories. You are a committee member for this term.',
    nextMeet: 'Mon 4pm',
    status: 'Active',
    members: 48,
    bannerGradient: 'from-slate-700 via-slate-600 to-slate-500',
    iconBg: 'bg-slate-500/30',
  },
  {
    id: 2,
    name: 'Coding Club',
    faculty: 'Faculty of Engineering',
    category: 'TECHNOLOGY',
    description: 'Building the future, one line at a time. Join us for weekly hackathons and workshops.',
    nextMeet: 'Wed 3pm',
    status: 'Leader',
    members: 120,
    bannerGradient: 'from-indigo-900 via-purple-800 to-indigo-700',
    iconBg: 'bg-indigo-500/30',
  },
  {
    id: 3,
    name: 'Robotics Club',
    faculty: 'Faculty of Engineering',
    category: 'TECHNOLOGY',
    description: 'Designing, building, and programming robots. Regular meetings and inter-college competitions.',
    nextMeet: 'Fri 1pm',
    status: 'Active',
    members: 65,
    bannerGradient: 'from-sky-900 via-sky-800 to-blue-700',
    iconBg: 'bg-sky-500/30',
  },
  {
    id: 4,
    name: 'Music Club',
    faculty: 'Faculty of Arts',
    category: 'MUSIC',
    description: 'From classical to contemporary. All instruments welcome. Perform at campus events.',
    nextMeet: 'Thu 5pm',
    status: 'Active',
    members: 89,
    bannerGradient: 'from-pink-900 via-rose-800 to-pink-700',
    iconBg: 'bg-pink-500/30',
  },
  {
    id: 5,
    name: 'Debate Society',
    faculty: 'Faculty of Humanities',
    category: 'RHETORIC',
    description: 'Sharpen your argumentation and public speaking skills in a competitive environment.',
    nextMeet: 'Tue 2pm',
    status: 'Active',
    members: 34,
    bannerGradient: 'from-amber-900 via-yellow-800 to-amber-700',
    iconBg: 'bg-amber-500/30',
  },
  {
    id: 6,
    name: 'Film Society',
    faculty: 'Faculty of Arts',
    category: 'ARTS',
    description: 'Cinephiles unite! Weekly screenings, discussions, and short film production projects.',
    nextMeet: 'Sat 6pm',
    status: 'Inactive',
    members: 52,
    bannerGradient: 'from-teal-900 via-teal-800 to-emerald-700',
    iconBg: 'bg-teal-500/30',
  },
  {
    id: 7,
    name: 'Entrepreneurship Cell',
    faculty: 'Faculty of Business',
    category: 'BUSINESS',
    description: 'Connect ideas with execution. Mentorship, pitch competitions, and startup ecosystem access.',
    nextMeet: 'Mon 11am',
    status: 'Active',
    members: 73,
    bannerGradient: 'from-violet-900 via-purple-800 to-fuchsia-700',
    iconBg: 'bg-violet-500/30',
  },
  {
    id: 8,
    name: 'Environmental Club',
    faculty: 'Faculty of Science',
    category: 'SCIENCE',
    description: 'Sustainability initiatives, campus clean-ups, and environmental awareness campaigns.',
    nextMeet: 'Wed 12pm',
    status: 'Active',
    members: 41,
    bannerGradient: 'from-green-900 via-emerald-800 to-green-700',
    iconBg: 'bg-green-500/30',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

const statusConfig: Record<Club['status'], { label: string; class: string }> = {
  Active: { label: 'Active Member', class: 'bg-purple-600/80 text-white' },
  Leader: { label: 'Leader', class: 'bg-amber-500/80 text-white' },
  Inactive: { label: 'Inactive', class: 'bg-white/10 text-gray-300' },
};

const categoryColor: Record<string, string> = {
  ARTS: 'bg-pink-500/20 text-pink-300',
  TECHNOLOGY: 'bg-indigo-500/20 text-indigo-300',
  MUSIC: 'bg-purple-500/20 text-purple-300',
  RHETORIC: 'bg-amber-500/20 text-amber-300',
  BUSINESS: 'bg-violet-500/20 text-violet-300',
  SCIENCE: 'bg-emerald-500/20 text-emerald-300',
};

// ── Sub-components ────────────────────────────────────────────────────────
function SummaryStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 bg-white/3 border border-white/10 rounded-2xl">
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
        <p className="text-sm text-gray-400 mt-0.5">{label}</p>
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
        <p className="text-amber-400 text-[11px] font-semibold tracking-wide uppercase mt-0.5">
          {club.faculty}
        </p>

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
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleLeaveClick = (club: Club) => {
    setSelectedClub(club);
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    if (selectedClub) {
      console.log(`Leaving club: ${selectedClub.name}`);
      // Actual leave logic would go here
    }
  };

  const activeClubs = clubs.filter((c) => c.status !== 'Inactive');
  const upcomingEvents = 5; // mock

  const totalPages = Math.ceil(clubs.length / ITEMS_PER_PAGE);
  const paginatedClubs = clubs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          My <span className="text-purple-400">Clubs</span>
        </h1>
        <p className="text-gray-400 mt-2 text-base">
          Manage your memberships and stay on top of your club activities.
        </p>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SummaryStat
          icon={
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          }
          value={activeClubs.length}
          label="Active Memberships"
        />
        <SummaryStat
          icon={
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
          }
          value={upcomingEvents}
          label="Upcoming Events"
        />
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
            <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
            All Clubs
          </h2>
          <span className="text-xs text-gray-500 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 font-medium">
            {clubs.length} joined
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

      {/* ── Club Cards Grid ── */}
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'flex flex-col gap-4'
        }
      >
        {paginatedClubs.map((club) =>
          view === 'grid' ? (
            <ClubCard key={club.id} club={club} onLeave={handleLeaveClick} />
          ) : (
            /* List row view */
            <div
              key={club.id}
              className="bg-white/3 border border-white/10 rounded-2xl p-4 flex items-center gap-5 hover:border-purple-500/30 transition-all"
            >
              <div className={`w-12 h-12 shrink-0 rounded-xl ${club.iconBg} border border-white/10 flex items-center justify-center`}>
                <Users className="w-5 h-5 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold text-sm">{club.name}</h3>
                  <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${statusConfig[club.status].class}`}>
                    {statusConfig[club.status].label}
                  </span>
                </div>
                <p className="text-amber-400 text-[11px] font-semibold tracking-wide uppercase mt-0.5">{club.faculty}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {club.nextMeet}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {club.members} members</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/student/all-clubs/${club.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View
                </Link>
                <button 
                  onClick={() => handleLeaveClick(club)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Leave
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* ── Pagination ── */}
      <Pagination
        total={clubs.length}
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
