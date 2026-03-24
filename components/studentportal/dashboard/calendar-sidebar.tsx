'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CATEGORY_COLOR_MAP: Record<string, string> = {
  TECHNOLOGY:    'bg-indigo-500',
  'ART & DESIGN':'bg-purple-500',
  MUSIC:         'bg-pink-500',
  ACADEMIC:      'bg-amber-500',
  BUSINESS:      'bg-violet-500',
  SCIENCE:       'bg-emerald-500',
};

const CATEGORY_RING_MAP: Record<string, string> = {
  TECHNOLOGY:    'ring-2 ring-indigo-500 text-white',
  'ART & DESIGN':'ring-2 ring-purple-500 text-white',
  MUSIC:         'ring-2 ring-pink-500 text-white',
  ACADEMIC:      'ring-2 ring-amber-500 text-white',
  BUSINESS:      'ring-2 ring-violet-500 text-white',
  SCIENCE:       'ring-2 ring-emerald-500 text-white',
};

interface CalendarSidebarProps {
  registeredEvents?: any[];
}

export default function CalendarSidebar({ registeredEvents = [] }: CalendarSidebarProps) {
  // Use current date as initial state instead of hardcoded March 2026
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper for safe date parsing (handles YYYY-MM-DD as local)
  const parseDateLocal = (dateStr: string) => {
    if (!dateStr) return new Date();
    // Replace hyphens with slashes to force local interpretation in many browsers
    // or manually split and create
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(dateStr);
  };

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  // Generate EVENT_MARKERS from registeredEvents
  const EVENT_MARKERS: Record<string, string> = {};
  registeredEvents.forEach(evt => {
    if (evt.event_date) {
      const date = parseDateLocal(evt.event_date);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      EVENT_MARKERS[dateStr] = CATEGORY_RING_MAP[evt.category] || 'ring-2 ring-white text-white';
    }
  });

  // Generate upcomingEvents list from registeredEvents
  const upcomingEvents = registeredEvents
    .map(evt => {
      const date = parseDateLocal(evt.event_date);
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return {
        id: evt.id,
        date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        rawDate: date,
        title: evt.title,
        color: CATEGORY_COLOR_MAP[evt.category] || 'bg-gray-500'
      };
    })
    .filter(evt => {
        const d = new Date(evt.rawDate);
        d.setHours(0,0,0,0);
        return d.getTime() >= todayMidnight.getTime();
    })
    .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
    .slice(0, 6); // Increase visibility to 6 events

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper functions
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  
  const today = new Date();
  const isSelectedCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  // Build cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  return (
    <div className="space-y-4">
      {/* Calendar Card */}
      <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Calendar</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-gray-300 text-xs font-semibold min-w-[100px] text-center">
              {MONTHS[month]} {year}
            </span>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[11px] text-gray-500 font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const highlightClass = EVENT_MARKERS[dateStr];
            const isToday = isSelectedCurrentMonth && day === today.getDate();

            return (
              <div key={i} className="flex items-center justify-center py-0.5">
                <button
                  className={`w-7 h-7 rounded-full text-[12px] font-medium flex items-center justify-center transition-all
                    ${isToday ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : ''}
                    ${!isToday && highlightClass ? highlightClass : ''}
                    ${!isToday && !highlightClass ? 'text-gray-400 hover:text-white hover:bg-white/5' : ''}
                  `}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-3">
          Upcoming Events
        </p>
        <div className="space-y-3">
          {upcomingEvents.map((evt) => (
            <div key={evt.date + evt.title} className="flex items-start gap-3">
              <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${evt.color}`} />
              <div>
                <p className="text-[10px] text-gray-500 font-medium">{evt.date}</p>
                <p className="text-sm text-gray-200 font-medium leading-tight">{evt.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
