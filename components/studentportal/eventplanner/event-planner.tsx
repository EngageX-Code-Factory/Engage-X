'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle, Zap, Calendar,
  ChevronLeft, ChevronRight, Info, CheckCircle, Sparkles, Loader2
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

interface Tip {
  iconName: string;
  text: string;
  color: string;
}

// Map string icon names from AI to actual Lucide components
const iconRegistry: Record<string, any> = {
  AlertTriangle,
  Zap,
  Info,
  CheckCircle,
  Calendar,
};

const initialTips: Tip[] = [
  { iconName: 'CheckCircle', text: 'Consider reviewing your schedule to balance workload.', color: 'text-orange-400' },
  { iconName: 'Info',        text: 'AI Seminar is recommended based on your interests.',          color: 'text-indigo-400' },
];

const eventColors: Record<EventType, string> = {
  club:     'bg-indigo-500/10 border border-indigo-500/20',
  academic: 'bg-white/5 border border-white/10',
  event:    'bg-purple-500/10 border border-purple-500/20',
  featured: 'bg-teal-500/10 border border-teal-500/20',
};

const DAYS_PER_PAGE = 5;

// Dynamic Week Generator Helper
function getDynamicInitialWeek(): DayPlan[] {
  const week: DayPlan[] = [];
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const mockEvents = [
    [{ id: 100, time: '03:00 PM', title: 'Self-Study', type: 'academic' as EventType }],
    [
      { id: 1, time: '10:00 AM', title: 'Robotics Club', type: 'club' as EventType },
      { id: 2, time: '01:00 PM', title: 'Lecture: CS101', type: 'academic' as EventType },
    ],
    [
      { id: 3, time: '09:00 AM', title: 'Career Fair', type: 'event' as EventType },
      { id: 4, time: '11:00 AM', title: 'Tech Talk', type: 'event' as EventType, gap: true },
      { id: 5, time: '02:00 PM', title: 'Lab: Physics', type: 'academic' as EventType },
    ],
    [{ id: 6, time: '04:00 PM', title: 'AI Seminar', type: 'event' as EventType, recommended: true }],
    [],
    [],
    [{ id: 101, time: '06:00 PM', title: 'Music Fest', type: 'event' as EventType }],
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayLabel = days[date.getDay()];
    
    let featured;
    if (i === 5) {
      featured = { time: '09:00 AM', title: 'Hackathon 2026' };
    }

    week.push({
      dayLabel,
      date: date.getDate(),
      isToday: i === 0,
      isBusy: i === 2,
      isFreeAfternoon: i === 3 || i === 4,
      events: mockEvents[i] || [],
      featured
    });
  }
  return week;
}

// Time parser helper
function parseTime(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let [_, h, m, period] = match;
  let hours = parseInt(h);
  let minutes = parseInt(m);
  if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

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
  const isFeatured = !!day.featured && (!day.events || day.events.length === 0);
  
  // Sort events chronologically
  const sortedEvents = [...(day.events || [])].sort((a, b) => parseTime(a.time) - parseTime(b.time));

  // Split into Morning/Afternoon (< 5 PM) and Evening (>= 5 PM)
  const dayEvents = sortedEvents.filter(e => parseTime(e.time) < 17 * 60);
  const eveningEvents = sortedEvents.filter(e => parseTime(e.time) >= 17 * 60);

  // Helper to render events with their free time gaps
  const renderEventList = (eventsList: ScheduledEvent[]) => {
    return eventsList.map((ev, i) => {
      const isMorning = parseTime(ev.time) < 12 * 60;
      const isEvening = parseTime(ev.time) >= 17 * 60;
      
      let gapUI = null;
      if (i < eventsList.length - 1) {
        const nextEv = eventsList[i + 1];
        const gapMins = parseTime(nextEv.time) - (parseTime(ev.time) + 60); // assume event takes 1 hour
        if (gapMins >= 30) {
          const hours = Math.floor(gapMins / 60);
          const mins = gapMins % 60;
          const timeStr = hours > 0 ? `${hours}h ${mins > 0 ? mins + 'm ' : ''}` : `${mins}m `;
          gapUI = (
            <div className="flex items-center gap-2 my-1.5 opacity-60">
               <div className="flex-1 border-t border-dashed border-white/20" />
               <span className="text-[9px] text-teal-400 font-bold tracking-widest whitespace-nowrap">{timeStr}FREE</span>
               <div className="flex-1 border-t border-dashed border-white/20" />
            </div>
          );
        }
      }

      return (
        <div key={ev.id} className="flex flex-col gap-1.5">
          <div className={`rounded-xl p-2.5 ${eventColors[ev.type] || 'bg-white/5 border border-white/10'}`}>
            <div className="flex justify-between items-start mb-0.5">
              <p className="text-[10px] text-gray-400 font-medium">{ev.time}</p>
              {isEvening && <span className="text-[10px] opacity-70">🌙</span>}
              {isMorning && <span className="text-[10px] opacity-70" title="Morning">☀️</span>}
              {!isMorning && !isEvening && <span className="text-[10px] opacity-70" title="Afternoon">🌤️</span>}
            </div>
            <p className="text-white text-xs font-semibold leading-snug">{ev.title}</p>
            {ev.recommended && (
              <span className="mt-1.5 inline-block text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                RECOMMENDED
              </span>
            )}
          </div>
          {gapUI}
        </div>
      );
    });
  };

  // Cross Gap (Gap between the last day event and the first evening event)
  let crossGapUI = null;
  if (dayEvents.length > 0 && eveningEvents.length > 0) {
     const lastDayEv = dayEvents[dayEvents.length - 1];
     const firstEveEv = eveningEvents[0];
     const gapMins = parseTime(firstEveEv.time) - (parseTime(lastDayEv.time) + 60);
     if (gapMins >= 60) {
        const hours = Math.floor(gapMins / 60);
        const mins = gapMins % 60;
        const timeStr = hours > 0 ? `${hours}h ${mins > 0 ? mins + 'm ' : ''}` : `${mins}m `;
        crossGapUI = (
           <div className="flex items-center gap-2 my-2 opacity-50 mt-auto pt-2">
              <div className="flex-1 border-t border-dashed border-white/20" />
              <span className="text-[9px] text-teal-300/80 font-bold tracking-widest whitespace-nowrap">{timeStr}FREE TIME</span>
              <div className="flex-1 border-t border-dashed border-white/20" />
           </div>
        );
     }
  }

  return (
    <div className={`flex-1 min-w-[200px] max-w-[240px] flex flex-col gap-3 rounded-2xl p-3 min-h-[400px] transition-all duration-300 relative shrink-0
      ${day.isToday
        ? 'bg-orange-500/5 border border-orange-500/40 shadow-[0_0_15px_rgba(251,146,60,0.05)]'
        : isFeatured
          ? 'bg-gradient-to-b from-teal-500/10 to-cyan-500/5 border border-teal-500/30'
          : 'bg-white/[0.02] border border-white/8 hover:border-white/15'}`}
    >
      <div className="flex items-center justify-between px-1 mb-2 border-b border-white/5 pb-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{day.dayLabel}</span>
          <span className={`text-2xl leading-none font-bold ${day.isToday ? 'text-orange-400' : isFeatured ? 'text-teal-300' : 'text-white'}`}>
            {day.date}
          </span>
        </div>
        {day.isToday && <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] shrink-0" />}
      </div>

      {/* Morning & Afternoon Events Section */}
      {dayEvents.length > 0 && (
         <div className="flex flex-col gap-2">
            {renderEventList(dayEvents)}
         </div>
      )}

      {/* Divider between Day and Evening if calculating big gap */}
      {crossGapUI}

      {/* If evening but no day events, we need auto margin to push it to bottom */}
      <div className={`flex flex-col gap-2 ${dayEvents.length === 0 ? 'mt-auto' : crossGapUI ? 'mt-3' : 'mt-auto pt-4'}`}>
         {eveningEvents.length > 0 && (
            <>
               {dayEvents.length === 0 && <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase px-1">Evening</span>}
               {renderEventList(eveningEvents)}
            </>
         )}
      </div>

      {day.featured && !isFeatured && (
        <div className="flex-1 rounded-xl bg-gradient-to-b from-cyan-500/30 to-teal-500/10 border border-cyan-500/30 p-3 flex flex-col justify-between mt-auto">
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

      {day.isFreeAfternoon && sortedEvents.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center pt-8">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
             <span className="text-lg">🛋️</span>
          </div>
          <span className="text-[11px] tracking-widest text-gray-500 uppercase font-bold text-center">Entire<br/>Free Day</span>
        </div>
      )}

      {!day.featured && !day.isFreeAfternoon && sortedEvents.length === 0 && (
        <div className="flex-1 flex items-center justify-center pt-8">
          <span className="text-[11px] tracking-widest text-gray-600 uppercase font-semibold">No Events</span>
        </div>
      )}

      {day.isBusy && (
        <div className="flex items-center gap-1.5 mt-auto pt-4 pb-1">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="text-[10px] tracking-widest uppercase text-orange-400 font-bold">Heavily Booked</span>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function EventPlanner() {
  const [weekPage, setWeekPage] = useState(0);
  const [fullWeek, setFullWeek] = useState<DayPlan[]>([]);
  const [tips, setTips] = useState<Tip[]>(initialTips);
  const [balanceScore, setBalanceScore] = useState<number>(85);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false); // Track if AI successfully ran

  // Run once on client mount to dynamically set dates or load from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('engagex_saved_schedule');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.fullWeek) {
          setFullWeek(parsed.fullWeek);
          setTips(parsed.tips || initialTips);
          setBalanceScore(parsed.balanceScore !== undefined ? parsed.balanceScore : 85);
          setIsGenerated(true); // Lock the button because it's already generated
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved schedule', e);
    }
    
    // If nothing saved in localStorage, load the dynamic mock template
    setFullWeek(getDynamicInitialWeek());
  }, []);

  const TOTAL_PAGES = Math.ceil(fullWeek.length / DAYS_PER_PAGE) || 1;

  const pagedDays = useMemo(() => {
    const start = weekPage * DAYS_PER_PAGE;
    return fullWeek.slice(start, start + DAYS_PER_PAGE);
  }, [fullWeek, weekPage]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthStr = monthNames[new Date().getMonth()];

  const headerTitle = fullWeek.length > 0 
    ? `Week of ${currentMonthStr} ${fullWeek[weekPage * DAYS_PER_PAGE]?.date}–${fullWeek[Math.min(weekPage * DAYS_PER_PAGE + DAYS_PER_PAGE - 1, fullWeek.length - 1)]?.date}`
    : 'Planning your week...';

  const handleGenerateAI = async () => {
    setLoadingAI(true);
    
    // Pass current date context to AI so it knows what week it is modifying
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 6);

    try {
      const resp = await fetch('/api/ai/schedule-planner', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          startDate: today.toDateString(),
          endDate: endDate.toDateString()
        })
      });
      const data = await resp.json();
      
      if (data.fullWeek && Array.isArray(data.fullWeek)) {
        setFullWeek(data.fullWeek);
        setTips(data.tips || []);
        if (data.balanceScore !== undefined) {
          setBalanceScore(data.balanceScore);
        }
        setWeekPage(0); // Reset to first page
        setIsGenerated(true);

        // Permanently save this generated schedule across page reloads
        localStorage.setItem('engagex_saved_schedule', JSON.stringify({
          fullWeek: data.fullWeek,
          tips: data.tips || [],
          balanceScore: data.balanceScore
        }));
      }
    } catch (error) {
      console.error("Failed to generate AI schedule", error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 flex flex-col gap-8">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-white/3 border border-white/10 rounded-3xl p-8">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-cyan-600/15 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Smart Personal <span className="text-purple-400">Event Planner</span>
            </h1>
            <p className="text-gray-400 mt-2 max-w-lg text-sm leading-relaxed mb-6">
              Your AI-driven assistant for balancing engagement and academic success.
              Get smart recommendations and avoid schedule conflicts automatically.
            </p>
            <button
               onClick={handleGenerateAI}
               disabled={loadingAI}
               className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
            >
              {loadingAI ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Crafting Schedule...</>
              ) : isGenerated ? (
                <><CheckCircle className="w-5 h-5" /> Schedule Generated</>
              ) : (
                <>Generate Perfect Week</>
              )}
            </button>
          </div>
          <CircleProgress value={balanceScore} />
        </div>
      </div>

      {/* ── Main Plan Layout ── */}
      <div className="relative bg-white/3 border border-white/10 rounded-3xl p-6 flex flex-col gap-6 min-h-[480px]">
        {loadingAI && (
           <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
              <p className="text-white font-bold text-lg">AI is optimizing your week...</p>
              <p className="text-gray-400 text-sm mt-1">Balancing classes, clubs, and free time.</p>
           </div>
        )}

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

        <div className="flex gap-4 overflow-x-auto pb-2">
          {pagedDays.map((day, idx) => (
            <DayColumn key={day.date || idx} day={day} />
          ))}
        </div>

        {TOTAL_PAGES > 1 && (
          <div className="flex items-center justify-center gap-2.5 mt-auto pt-2">
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
        )}
      </div>

      {/* ── AI Suggestions ── */}
      <div className="bg-white/3 border border-white/10 rounded-2xl p-6 border-l-4 border-l-purple-500 relative overflow-hidden">
        {loadingAI && <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px]" />}
        <div className="flex items-center gap-2.5 mb-5">
          <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
          <h3 className="text-white font-bold tracking-tight">AI Scheduling Suggestions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tips.map((tip, i) => {
            const IconComp = iconRegistry[tip.iconName] || Info;
            return (
              <div key={i} className="flex items-start gap-4 bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/20 transition-colors">
                <IconComp className={`w-5 h-5 mt-0.5 shrink-0 ${tip.color}`} />
                <p className="text-gray-400 text-xs leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

