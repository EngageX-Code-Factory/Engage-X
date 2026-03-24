"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CalendarDays, ArrowRight, Loader2 } from 'lucide-react';

const THEME_STYLES = {
  purple: {
    border: "hover:border-purple-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
    gradient: "from-purple-500/5",
    badge: "bg-purple-600/90 border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    dateText: "text-purple-300",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
    btnColor: "text-purple-200",
    btnBg: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/50",
    btnIconBg: "bg-purple-500/20 group-hover/btn:bg-purple-500",
    shimmer: "via-purple-500/10",
    title: "group-hover:text-purple-300"
  },
  pink: {
    border: "hover:border-pink-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]",
    gradient: "from-pink-500/5",
    badge: "bg-pink-600/90 border-pink-400/30 shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    dateText: "text-pink-300",
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
    btnColor: "text-pink-200",
    btnBg: "bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20 hover:border-pink-500/50",
    btnIconBg: "bg-pink-500/20 group-hover/btn:bg-pink-500",
    shimmer: "via-pink-500/10",
    title: "group-hover:text-pink-300"
  },
  blue: {
    border: "hover:border-blue-500/50",
    shadow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    gradient: "from-blue-500/5",
    badge: "bg-blue-600/90 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    dateText: "text-blue-300",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    btnColor: "text-blue-200",
    btnBg: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/50",
    btnIconBg: "bg-blue-500/20 group-hover/btn:bg-blue-500",
    shimmer: "via-blue-500/10",
    title: "group-hover:text-blue-300"
  }
};

const THEME_ORDER = ['purple', 'pink', 'blue'] as const;

export default function EventsSection() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/public/events');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = data
          .filter((e: any) => new Date(e.event_date) >= today)
          .sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
          .slice(0, 3)
          .map((e: any) => {
            const d = new Date(e.event_date);
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            return {
              id: e.id,
              category: (Array.isArray(e.clubs) ? e.clubs[0]?.category : e.clubs?.category) || 'Event',
              title: e.title,
              day: d.getDate().toString().padStart(2, '0'),
              month: months[d.getMonth()],
              location: e.location || 'TBA',
              time: e.event_time || 'TBA',
              image: e.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
            };
          });
        
        setEvents(upcoming);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  return (
    <section className="relative py-32 bg-[#0b0515] overflow-hidden">
      {/* Creative Dynamic Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Glowing Orbs */}
        <div className="absolute top-1/3 -left-1/4 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-1/3 -right-1/4 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000 delay-1000"></div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0515]/80 to-[#0b0515]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-pink-500/20 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Upcoming <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">Events</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Don&apos;t miss out on the incredible workshops, symposiums, and networking opportunities happening soon on campus.
          </p>
        </div>

        <div className="mt-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium animate-pulse">Fetching the latest experiences...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {events.map((event, index) => {
                const theme = THEME_ORDER[index % THEME_ORDER.length];
                const style = THEME_STYLES[theme];

                return (
                  <div key={event.id} className={`group relative bg-[#130a21]/50 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-4 ${style.border} ${style.shadow} flex flex-col h-full`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#130a21] via-black/20 to-transparent z-10"></div>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-5 left-5 z-20">
                        <div className={`${style.badge} backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/30`}>
                          {event.category}
                        </div>
                      </div>

                      {/* Date Badge */}
                      <div className="absolute top-5 right-5 z-20">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl p-2 text-center shadow-xl transform group-hover:-rotate-3 transition-transform duration-500">
                          <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">{event.day}</div>
                          <div className={`text-[10px] font-bold tracking-widest uppercase ${style.dateText}`}>{event.month}</div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative p-8 pt-4 flex-1 flex flex-col z-20">
                      <h3 className={`text-2xl font-bold text-white mb-4 ${style.title} transition-colors line-clamp-2 italic tracking-tight`}>{event.title}</h3>

                      <div className="flex flex-col gap-3 mb-8">
                        <div className="flex items-center text-gray-400">
                          <div className={`w-8 h-8 rounded-full ${style.iconBg} border flex items-center justify-center mr-3`}>
                            <MapPin className={`w-4 h-4 ${style.iconColor}`} />
                          </div>
                          <span className="text-sm font-medium">{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <div className={`w-8 h-8 rounded-full ${style.iconBg} border flex items-center justify-center mr-3`}>
                            <CalendarDays className={`w-4 h-4 ${style.iconColor}`} />
                          </div>
                          <span className="text-sm font-medium">{event.time}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Link href="/auth/sign-up" className={`group/btn relative w-full flex items-center justify-between p-4 rounded-xl ${style.btnBg} transition-all duration-300 overflow-hidden`}>
                          <span className={`relative z-10 ${style.btnColor} font-bold uppercase tracking-wider text-xs`}>Register Now</span>
                          <div className={`relative z-10 w-8 h-8 ${style.btnIconBg} rounded-lg flex items-center justify-center group-hover/btn:text-white transition-colors duration-300`}>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                          <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${style.shimmer} to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]`}></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
               <p className="text-gray-400 italic">No upcoming events found at the moment. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}