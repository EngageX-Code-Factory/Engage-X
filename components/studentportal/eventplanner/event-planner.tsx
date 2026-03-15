'use client';

import { useState, useMemo } from 'react';
import {
  AlertTriangle, Zap, Calendar,
  ChevronLeft, ChevronRight, Info, CheckCircle,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type EventType = 'club' | 'academic' | 'event' | 'featured';

interface ScheduledEvent {
  id: number;
  time: string;
  title: string;
  type: EventType;
  recommended?: boolean;
  gap?: boolean;
}

interface DayPlan {
  dayLabel: string;
  date: number;
  isToday?: boolean;
  isBusy?: boolean;
  isFreeAfternoon?: boolean;
  events: ScheduledEvent[];
  featured?: { time: string; title: string };
}

// ── Weekly Data (Mar 9–15 2026) ──────────────────────────────────────────
const fullWeek: DayPlan[] = [
  {
    dayLabel: 'SUN', date: 9,
    events: [{ id: 100, time: '03:00 PM', title: 'Self-Study', type: 'academic' }],
  },
  {
    dayLabel: 'MON', date: 10,
    events: [
      { id: 1, time: '10:00 AM', title: 'Robotics Club', type: 'club' },
      { id: 2, time: '01:00 PM', title: 'Lecture: CS101', type: 'academic' },
    ],
  },
  {
    dayLabel: 'TUE', date: 11, isToday: true, isBusy: true,
    events: [
      { id: 3, time: '09:00 AM', title: 'Career Fair', type: 'event' },
      { id: 4, time: '11:00 AM', title: 'Tech Talk', type: 'event', gap: true },
      { id: 5, time: '02:00 PM', title: 'Lab: Physics', type: 'academic' },
    ],
  },
  {
    dayLabel: 'WED', date: 12, isFreeAfternoon: true,
    events: [{ id: 6, time: '04:00 PM', title: 'AI Seminar', type: 'event', recommended: true }],
  },
  {
    dayLabel: 'THU', date: 13, isFreeAfternoon: true, events: [],
  },
  {
    dayLabel: 'FRI', date: 14, events: [],
    featured: { time: '09:00 AM', title: 'Hackathon 2026' },
  },
  {
    dayLabel: 'SAT', date: 15,
    events: [{ id: 101, time: '06:00 PM', title: 'Music Fest', type: 'event' }],
  },
];

const eventColors: Record<EventType, string> = {
  club:     'bg-indigo-500/10 border border-indigo-500/20',
  academic: 'bg-white/5 border border-white/10',
  event:    'bg-purple-500/10 border border-purple-500/20',
  featured: 'bg-teal-500/10 border border-teal-500/20',
};

const tips = [
  { icon: CheckCircle, text: 'Tuesday is overloaded — consider moving Tech Talk to Thursday afternoon.', color: 'text-orange-400' },
  { icon: Info,        text: 'AI Seminar on Wednesday is recommended based on your interests.',          color: 'text-indigo-400' },
  { icon: Zap,         text: 'Hackathon 2026 on Friday is a must-attend for your Coding Club activity.', color: 'text-teal-400' },
];

const DAYS_PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(fullWeek.length / DAYS_PER_PAGE);

// ── Circular progress ─────────────────────────────────────────────────────
function CircleProgress({ value }: { value: number }) {
  const r = 36; const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="url(#circleGrad)" strokeWidth="6"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
        <defs>
          <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] text-gray-400 font-medium tracking-widest leading-none">BALANCE</span>
        <span className="text-xl font-bold text-white leading-tight">{value}%</span>
      </div>
    </div>
  );
}

// ── Day Column ────────────────────────────────────────────────────────────
function DayColumn({ day }: { day: DayPlan }) {
  const isFeatured = !!day.featured && day.events.length === 0;
  return (
    <div className={`flex-1 min-w-0 flex flex-col gap-3 rounded-2xl p-3 min-h-[360px] transition-all duration-300
      ${day.isToday
        ? 'bg-orange-500/5 border border-orange-500/40 shadow-lg shadow-orange-500/5'
        : isFeatured
          ? 'bg-gradient-to-b from-teal-500/10 to-cyan-500/5 border border-teal-500/30'
          : 'bg-white/[0.02] border border-white/8'}`}
    >
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold tracking-widest text-gray-500">{day.dayLabel}</span>
          <span className={`text-lg font-bold ${day.isToday ? 'text-orange-400' : isFeatured ? 'text-teal-300' : 'text-white'}`}>
            {day.date}
          </span>
        </div>
        {day.isToday && <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] shrink-0" />}
      </div>

      {day.events.map((ev) => (
        <div key={ev.id}>
          {ev.gap && (
            <div className="flex items-center gap-1.5 my-1 px-1">
              <div className="flex-1 border-t border-red-500/30" />
              <span className="text-[10px] text-red-400 font-semibold tracking-wider whitespace-nowrap">0 MIN GAP</span>
              <div className="flex-1 border-t border-red-500/30" />
            </div>
          )}
          <div className={`rounded-xl p-2.5 ${eventColors[ev.type]}`}>
            <p className="text-[10px] text-gray-400 font-medium">{ev.time}</p>
            <p className="text-white text-xs font-semibold mt-0.5 leading-snug">{ev.title}</p>
            {ev.recommended && (
              <span className="mt-1.5 inline-block text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                RECOMMENDED
              </span>
            )}
          </div>
        </div>
      ))}

      {day.featured && (
        <div className="flex-1 rounded-xl bg-gradient-to-b from-cyan-500/30 to-teal-500/10 border border-cyan-500/30 p-3 flex flex-col justify-between min-h-[120px] mt-auto">
          <div>
            <p className="text-[10px] text-cyan-300 font-medium">{day.featured.time}</p>
            <p className="text-white text-sm font-bold mt-0.5">{day.featured.title}</p>
          </div>
          <div className="flex justify-end">
            <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {day.isFreeAfternoon && (
        <div className="flex items-center justify-center py-3">
          <span className="text-[11px] tracking-widest text-gray-600 uppercase font-semibold">Free Afternoon</span>
        </div>
      )}

      {!day.featured && !day.isFreeAfternoon && day.events.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[11px] tracking-widest text-gray-600 uppercase font-semibold">No Events</span>
        </div>
      )}

      {day.isBusy && (
        <div className="flex items-center gap-1.5 mt-auto pt-1">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="text-[11px] text-orange-400 font-semibold">Too Busy!</span>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function EventPlanner() {
  const [weekPage, setWeekPage] = useState(0);

  const pagedDays = useMemo(() => {
    const start = weekPage * DAYS_PER_PAGE;
    return fullWeek.slice(start, start + DAYS_PER_PAGE);
  }, [weekPage]);

  const headerTitle = `Week of Mar ${fullWeek[weekPage * DAYS_PER_PAGE]?.date}–${fullWeek[Math.min(weekPage * DAYS_PER_PAGE + DAYS_PER_PAGE - 1, fullWeek.length - 1)]?.date}`;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 flex flex-col gap-8">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-white/3 border border-white/10 rounded-3xl p-8">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-cyan-600/15 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Smart Personal <span className="text-purple-400">Event Planner</span>
            </h1>
            <p className="text-gray-400 mt-2 max-w-lg text-sm leading-relaxed">
              Your AI-driven assistant for balancing engagement and academic success.
              Get smart recommendations and avoid schedule conflicts automatically.
            </p>
          </div>
          <CircleProgress value={85} />
        </div>
      </div>

      {/* ── Main Plan Layout ── */}
      <div className="bg-white/3 border border-white/10 rounded-3xl p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{headerTitle}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWeekPage(p => Math.max(0, p - 1))}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setWeekPage(p => Math.min(TOTAL_PAGES - 1, p + 1))}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {pagedDays.map((day) => (
            <DayColumn key={day.date} day={day} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2.5 mt-2">
          {Array.from({ length: TOTAL_PAGES }, (_, i) => (
            <button
              key={i}
              onClick={() => setWeekPage(i)}
              className={`rounded-full transition-all duration-300 ${
                i === weekPage ? 'w-6 h-2 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── AI Suggestions ── */}
      <div className="bg-white/3 border border-white/10 rounded-2xl p-6 border-l-4 border-l-purple-500">
        <div className="flex items-center gap-2.5 mb-5">
          <Zap className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-bold tracking-tight">AI Scheduling Suggestions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-4 bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/20 transition-colors">
              <tip.icon className={`w-5 h-5 mt-0.5 shrink-0 ${tip.color}`} />
              <p className="text-gray-400 text-xs leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
