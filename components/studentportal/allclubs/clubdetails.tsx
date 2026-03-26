'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft, Users, Star, MapPin,
  Clock, Facebook, Twitter, Instagram,
  UserPlus, CheckCircle, Images
} from 'lucide-react';
import Link from 'next/link';
import JoinClubModal from './JoinClubModal';

// ── Types ──────────────────────────────────────────────────────────────────
interface ClubEvent {
  id: string;
  day: number;
  month: string;
  title: string;
  time: string;
  type: string;
  organizer: string;
  location: string;
  status: 'OPEN' | 'FILLED' | 'REGISTER';
  image: string;
}


interface ClubDetailsData {
  id: string;
  name: string;
  category: string;
  faculty: string;
  members: number;
  activeSince: number;
  rating: number;
  president: string;
  meetingDay: string;
  coverImage: string;
  description: string;
  whatWeDo: string[];
  gallery: string[];
  events: ClubEvent[];
  isMember: boolean;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  TECHNOLOGY: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  ARTS: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  MUSIC: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  SPORTS: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  ACADEMIC: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  BUSINESS: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
};

const STATUS_CONFIG: Record<ClubEvent['status'], { label: string; class: string }> = {
  OPEN: { label: 'OPEN', class: 'bg-emerald-500 text-white' },
  FILLED: { label: 'FILLED', class: 'bg-red-500 text-white' },
  REGISTER: { label: 'REGISTER', class: 'bg-purple-500 text-white' },
};

// ── Event Card ────────────────────────────────────────────────────────────
function EventCard({ event }: { event: ClubEvent }) {
  const status = STATUS_CONFIG[event.status];
  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group">
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Date badge */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center leading-none">
          <span className="block text-white text-base font-bold">{event.day}</span>
          <span className="block text-gray-300 text-[9px] font-semibold tracking-widest">{event.month}</span>
        </div>
        {/* Status badge */}
        <span className={`absolute top-2 right-2 text-[10px] font-bold tracking-widest px-2 py-1 rounded-lg ${status.class}`}>
          {status.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Clock className="w-3 h-3" /> <span>{event.time}</span>
          <span className="mx-1 text-white/10">•</span>
          <span className="text-purple-400">{event.type}</span>
        </div>
        <h4 className="text-white font-semibold text-sm leading-snug">{event.title}</h4>
        <p className="text-[11px] text-gray-500 mt-1">By: <span className="text-purple-400">{event.organizer}</span></p>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
          <MapPin className="w-3 h-3" /> {event.location}
        </div>

        {/* Buttons */}
        <div className="mt-4">
          {event.status === 'FILLED' ? (
            <button className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-medium cursor-not-allowed text-center">
              Waitlist Only
            </button>
          ) : (
            <Link 
              href={`/student/events/register/${event.id}`}
              className="block w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors text-center"
            >
              Register Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
interface ClubDetailsProps {
  clubId: string;
}

export default function ClubDetails({ clubId }: ClubDetailsProps) {
  const [club, setClub] = useState<ClubDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    async function fetchClub() {
      try {
        setLoading(true);
        // Ensure fetching only if valid ID (assuming string UUID or similar)
        if (!clubId) return;

        const response = await fetch(`/api/student/clubs/${clubId}`);
        if (!response.ok) {
           if (response.status === 404) throw new Error('Club not found');
           throw new Error('Failed to fetch club details');
        }
        
        const data = await response.json();

        // Map API response (snake_case from DB) to component state (camelCase)
        // Data likely comes as: { clubid, club_name, category, ... }
        // We'll map it to ClubDetailsData
        const mappedClub: ClubDetailsData = {
          id: data.clubid || data.id,
          name: data.club_name || data.name || 'Unnamed Club',
          category: (data.category || 'GENERAL').toUpperCase(),
          faculty: data.faculty || 'General', // Fallback if missing in DB
          members: data.active_members || 0,
          activeSince: data.createdate ? new Date(data.createdate).getFullYear() : new Date().getFullYear(),
          rating: data.ratings || 0,
          president: data.president || 'N/A',
          meetingDay: data.meeting_day || 'TBD',
          coverImage: data.club_cover_image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop', // Default cover if missing
          description: data.club_description || 'No description available.',
          // Mocking arrays as they might not be in DB yet or format differs
          whatWeDo: Array.isArray(data.what_we_do) ? data.what_we_do : [],
          gallery: Array.isArray(data.club_gallery) ? data.club_gallery : [],
          events: Array.isArray(data.events) ? data.events.map((e: any) => {
            const dateObj = new Date(e.event_date);
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            let status: 'OPEN' | 'FILLED' | 'REGISTER' = 'OPEN';
            const s = (e.status || 'OPEN').toUpperCase();
            if (s === 'FILLED' || s === 'CLOSED') status = 'FILLED';
            else if (s === 'SOON') status = 'REGISTER';
            else status = 'OPEN';

            return {
              id: e.id,
              day: dateObj.getDate(),
              month: months[dateObj.getMonth()],
              title: e.title,
              time: e.event_time,
              type: 'General',
              organizer: data.club_name,
              location: e.location,
              status: status,
              image: e.image
            };
          }) : [],
          socialLinks: {
            facebook: data.facebook_link || data.facebook || '#',
            twitter: data.twitter_link || data.twitter || '#',
            instagram: data.instagram_link || data.instagram || '#',
            linkedin: data.linkedin_link || data.linkedin || '#',
          },
          isMember: data.is_member || false
        };

        setClub(mappedClub);
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchClub();
  }, [clubId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Loading club details...</div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-red-400 mb-2">Error: {error || 'Club not found'}</div>
        <Link href="/student/all-clubs" className="text-sm text-gray-400 hover:text-white underline">
          Return to Clubs List
        </Link>
      </div>
    );
  }

  const catClass = CATEGORY_COLORS[club.category] ?? 'bg-gray-500/20 text-gray-300';

  return (
    <div className="max-w-screen-2xl mx-auto px-6 pb-12">
      {/* ── Hero Banner ── */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-6 mt-4">
        {/* Background image */}
        <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          {/* Category badge */}
          <span className={`self-start text-[10px] font-bold tracking-widest px-3 py-1 rounded-full mb-3 ${catClass}`}>
            {club.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
            {club.name}
          </h1>
          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-5 mt-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-200">
              <Users className="w-4 h-4 text-purple-400" />
              {club.members}+ Members
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-200">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Active Since {club.activeSince}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-200">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {club.rating} Rating
            </span>
          </div>
          {/* CTA */}
          {!club.isMember && (
            <button 
              onClick={() => setShowJoinModal(true)}
              className="mt-5 self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-purple-500/20"
            >
              <UserPlus className="w-4 h-4" /> Join This Club
            </button>
          )}
        </div>
      </div>

      {/* ── Back link ── */}
      <Link href="/student/all-clubs" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Clubs
      </Link>

      {/* ── Body: Main Content + Sidebar ── */}
      <div className="flex gap-6 items-start">
        {/* ── Left: Main Content ── */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* About Us */}
          <section className="bg-white/3 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
              About Us
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">{club.description}</p>

            <h3 className="text-white font-semibold mt-5 mb-3">What We Do:</h3>
            <ul className="space-y-2.5">
              {club.whatWeDo.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Upcoming Events */}
          <section>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5">
              <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
              Upcoming Club Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {club.events.length > 0 ? (
                club.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-8 text-sm italic">
                  No upcoming events scheduled.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── Right: Sidebar ── */}
        <aside className="w-64 xl:w-72 shrink-0 space-y-4">
          {/* Club Info */}
          <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Club Info</h3>
            <div className="space-y-3">
              {[
                { label: 'President', value: club.president },
                { label: 'Meeting Day', value: club.meetingDay },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <span className="text-xs text-gray-500 shrink-0">{label}</span>
                  <span className="text-xs text-gray-200 font-medium text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-white/5" />

            {/* Social links */}
            <div className="flex items-center gap-2">
              {[
                { Icon: Facebook, color: 'hover:text-blue-400', link: club.socialLinks?.facebook },
                { Icon: Twitter, color: 'hover:text-sky-400', link: club.socialLinks?.twitter },
                { Icon: Instagram, color: 'hover:text-pink-400', link: club.socialLinks?.instagram },
              ].map(({ Icon, color, link }, i) => {
                const hasLink = link && link !== '#';
                return (
                  hasLink ? (
                    <Link
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${color} hover:border-white/20 transition-all`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-600 cursor-not-allowed"
                      title="Link not available"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  )
                );
              })}
            </div>
          </div>

          {/* Club Gallery */}
          <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Images className="w-4 h-4 text-purple-400" /> Club Gallery
            </h3>
            {club.gallery && club.gallery.length > 0 ? (
            <div className="space-y-2">
              {/* Main large image */}
              {club.gallery[0] && (
              <div className="rounded-xl overflow-hidden h-36">
                <img src={club.gallery[0]} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              )}
              {/* Two smaller images side-by-side */}
              <div className="flex gap-2">
                {club.gallery[1] && (
                <div className="flex-1 rounded-xl overflow-hidden h-20">
                  <img src={club.gallery[1]} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                )}
                {club.gallery[2] && (
                <div className="relative flex-1 rounded-xl overflow-hidden h-20">
                  <img src={club.gallery[2]} alt="Gallery" className="w-full h-full object-cover" />
                  {/* +N overlay */}
                  {club.gallery.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                    <span className="text-white font-bold text-sm">+{club.gallery.length - 3}</span>
                  </div>
                  )}
                </div>
                )}
              </div>
            </div>
            ) : (
                <div className="text-sm text-gray-400 italic py-4 text-center">No images available</div>
            )}
          </div>
        </aside>
      </div>

      <JoinClubModal 
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        clubId={club.id}
        clubName={club.name}
        category={club.category}
      />
    </div>
  );
}
