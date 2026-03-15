'use client';

import {
  ArrowLeft, Users, Star, Calendar, MapPin,
  Clock, Facebook, Twitter, Instagram, MessageSquare,
  UserPlus, CheckCircle, Images
} from 'lucide-react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────
interface ClubEvent {
  id: number;
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
  id: number;
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
}

// ── Mock Data ─────────────────────────────────────────────────────────────
export const CLUB_DETAILS: Record<number, ClubDetailsData> = {
  1: {
    id: 1,
    name: 'Robotics & AI Club',
    category: 'TECHNOLOGY',
    faculty: 'Computing & Engineering',
    members: 150,
    activeSince: 2018,
    rating: 4.8,
    president: 'Sarah Connor',
    meetingDay: 'Wednesdays, 4 PM',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=400&fit=crop',
    description: 'The Robotics & AI Club is the premier student organization for technology enthusiasts at EngageX University. We bring together students from Computing, Engineering, and Design faculties to collaborate on innovative projects, ranging from autonomous drones to machine learning models, and competing in national hackathons.',
    whatWeDo: [
      'Weekly "Bot-Build" workshops where members learn hands-on hardware assembly and programming.',
      'Guest lectures from industry leaders from companies like Google, Tesla, and OpenAI.',
      'Annual "RoboWars" campus championship which draws hundreds of spectators.',
      'Community outreach STEM programs for local high school students.',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=280&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=140&fit=crop',
    ],
    events: [
      {
        id: 1, day: 15, month: 'MAR', title: 'Intro to Neural Networks',
        time: '4:00 PM', type: 'Workshop', organizer: 'Robotics & AI Club',
        location: 'Lab 305', status: 'OPEN',
        image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop',
      },
      {
        id: 2, day: 22, month: 'MAR', title: 'Robot Battle Arena: Qualifiers',
        time: '10:00 AM', type: 'Competition', organizer: 'Robotics & AI Club',
        location: 'Main Hall', status: 'OPEN',
        image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=200&fit=crop',
      },
      {
        id: 3, day: 5, month: 'APR', title: 'AI Ethics Panel Discussion',
        time: '5:30 PM', type: 'Panel', organizer: 'Robotics & AI Club',
        location: 'Auditorium B', status: 'FILLED',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      },
      {
        id: 4, day: 12, month: 'APR', title: 'Drone Racing Workshop',
        time: '2:00 PM', type: 'Workshop', organizer: 'Robotics & AI Club',
        location: 'Engineering Rooftop', status: 'OPEN',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=200&fit=crop',
      },
      {
        id: 5, day: 20, month: 'APR', title: 'RoboWars Annual Championship',
        time: '9:00 AM', type: 'Competition', organizer: 'Robotics & AI Club',
        location: 'Sports Complex', status: 'REGISTER',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
      },
      {
        id: 6, day: 28, month: 'APR', title: 'Machine Learning Bootcamp',
        time: '10:00 AM', type: 'Workshop', organizer: 'Robotics & AI Club',
        location: 'Computer Lab A', status: 'OPEN',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop',
      },
    ],
  },
};

// Fallback for clubs without full details
const DEFAULT_CLUB: ClubDetailsData = CLUB_DETAILS[1];

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
        <div className="flex gap-2 mt-4">
          {event.status === 'FILLED' ? (
            <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-medium cursor-not-allowed">
              Waitlist Only
            </button>
          ) : (
            <>
              <button className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors">
                Register
              </button>
              <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors">
                Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
interface ClubDetailsProps {
  clubId?: number;
}

export default function ClubDetails({ clubId = 1 }: ClubDetailsProps) {
  const club = CLUB_DETAILS[clubId] ?? DEFAULT_CLUB;
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
          <button className="mt-5 self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-purple-500/20">
            <UserPlus className="w-4 h-4" /> Join This Club
          </button>
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
              {club.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
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
                { label: 'Faculty', value: club.faculty },
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
                { Icon: Facebook, color: 'hover:text-blue-400' },
                { Icon: Twitter, color: 'hover:text-sky-400' },
                { Icon: Instagram, color: 'hover:text-pink-400' },
                { Icon: MessageSquare, color: 'hover:text-indigo-400' },
              ].map(({ Icon, color }, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${color} hover:border-white/20 transition-all`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Club Gallery */}
          <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Images className="w-4 h-4 text-purple-400" /> Club Gallery
            </h3>
            <div className="space-y-2">
              {/* Main large image */}
              <div className="rounded-xl overflow-hidden h-36">
                <img src={club.gallery[0]} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              {/* Two smaller images side-by-side */}
              <div className="flex gap-2">
                <div className="flex-1 rounded-xl overflow-hidden h-20">
                  <img src={club.gallery[1]} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="relative flex-1 rounded-xl overflow-hidden h-20">
                  <img src={club.gallery[2]} alt="Gallery" className="w-full h-full object-cover" />
                  {/* +N overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                    <span className="text-white font-bold text-sm">+8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
