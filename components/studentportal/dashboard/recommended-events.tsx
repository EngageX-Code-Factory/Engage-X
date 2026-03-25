'use client';

import { useState, useEffect } from 'react';
import { Clock, Loader2, Calendar } from 'lucide-react';
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

const categoryColors: Record<string, string> = {
  TECHNOLOGY: 'bg-indigo-500/20 text-indigo-300',
  'ART & DESIGN': 'bg-purple-500/20 text-purple-300',
  MUSIC: 'bg-pink-500/20 text-pink-300',
  SPORTS: 'bg-emerald-500/20 text-emerald-300',
  BUSINESS: 'bg-amber-500/20 text-amber-300',
  ACADEMIC: 'bg-violet-500/20 text-violet-300',
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event) => {
            const { day, month } = formatDateParts(event.event_date);
            const category = event.clubs?.category?.toUpperCase() || 'GENERAL';
            
            return (
              <div
                key={event.id}
                className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden shrink-0">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center leading-none">
                    <span className="block text-white text-lg font-bold">{day}</span>
                    <span className="block text-gray-300 text-[10px] font-medium tracking-widest mt-0.5">
                      {month}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  {/* Category */}
                  <div>
                    <span
                      className={`text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full ${
                        categoryColors[category] ?? 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {category}
                    </span>
                  </div>

                  <h3 className="mt-3 text-white font-semibold text-base line-clamp-1">{event.title}</h3>

                  <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-sm">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">{event.event_time}</span>
                  </div>

                  <div className="mt-auto pt-4 flex gap-2">
                    <Link 
                      href={`/student/events/register/${event.id}`}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-center text-sm font-medium hover:bg-purple-500 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
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
