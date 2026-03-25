'use client';

import { useState, useEffect } from 'react';
import { Clock, Loader2, Calendar, Sparkles, Users, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Helper function to format date
function formatDateParts(dateString: string) {
  const dateObj = new Date(dateString);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return {
    day: dateObj.getDate().toString().padStart(2, '0'),
    month: months[dateObj.getMonth()]
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  'TECHNOLOGY': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  'ART & DESIGN': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
  'MUSIC': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'SPORTS': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'BUSINESS': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  'ACADEMIC': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'OTHER': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const STATUS_STYLES: Record<string, string> = {
  'UPCOMING': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'ONGOING': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'FINISHED': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  'CANCELLED': 'bg-red-500/20 text-red-400 border border-red-500/30',
  'FILLED': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
};

export default function RecommendedEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch('/api/student/recommended-events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching recommended events', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
          Recommended For You
        </h2>
        <Link
          href="/student/events"
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white/3 border border-white/10 rounded-2xl">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.map((event) => {
            const { day, month } = formatDateParts(event.event_date);
            const rawCategory = Array.isArray(event.clubs) ? event.clubs[0]?.category : event.clubs?.category;
            const category = rawCategory?.toUpperCase() || 'OTHER';
            const catClass = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['OTHER'];
            
            const organizer = Array.isArray(event.clubs) ? event.clubs[0]?.club_name : event.clubs?.club_name || 'Unknown Organization';
            const statusStyle = STATUS_STYLES[event.status || 'UPCOMING'] || STATUS_STYLES['UPCOMING'];

            return (
              <div
                key={event.id}
                className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* ── Image ── */}
                <div className="relative h-44 overflow-hidden shrink-0">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Date badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center leading-none">
                    <span className="block text-white text-lg font-bold">{day}</span>
                    <span className="block text-gray-300 text-[10px] font-medium tracking-widest mt-0.5">{month}</span>
                  </div>
                  {/* Status badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm ${
                    event.isRegistered 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : statusStyle
                  }`}>
                    {event.isRegistered ? 'REGISTERED' : (event.status || 'UPCOMING')}
                  </span>
                </div>

                {/* ── Body ── */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Category */}
                  <span className={`self-start text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full ${catClass}`}>
                    {category}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 text-white font-semibold text-base leading-snug">{event.title}</h3>

                  {/* Organizer */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <Users className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <p className="text-xs">
                      <span className="text-gray-400">By </span>
                      <span className="font-semibold text-purple-400">{organizer}</span>
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-sm">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs">{event.event_time}</span>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs">{event.location}</span>
                    </div>
                  )}

                  {/* Attendees */}
                  {event.attendees !== undefined && (
                    <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs">{event.attendees} attending</span>
                    </div>
                  )}

                  {/* AI Reasoning Block */}
                  {event.aiRecommenderReason && (
                    <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed flex gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-3">{event.aiRecommenderReason}</p>
                    </div>
                  )}

                  <div className="flex-1" />

                  {/* Register Button */}
                  {event.isRegistered ? (
                    <button disabled className="mt-4 w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold cursor-default flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Registered
                    </button>
                  ) : event.status === 'FILLED' ? (
                    <button disabled className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-sm font-medium cursor-not-allowed">
                      Waitlist Only
                    </button>
                  ) : (
                    <Link 
                      href={`/student/events/register/${event.id}`}
                      className="mt-4 w-full py-2.5 rounded-xl border border-purple-500 text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors text-center block"
                    >
                      Register
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white/3 border border-white/10 rounded-2xl text-center">
           <Calendar className="w-10 h-10 text-gray-500 mb-3" />
           <p className="text-gray-400 text-sm">No new recommendations right now.<br/>Explore all events to discover more!</p>
        </div>
      )}
    </section>
  );
}
