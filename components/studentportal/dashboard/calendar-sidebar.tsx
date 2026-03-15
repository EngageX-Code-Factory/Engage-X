'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Mocked event markers (realistically these would come from an API)
const EVENT_MARKERS: Record<string, string> = {
  '2026-02-15': 'ring-2 ring-purple-500 text-white',
  '2026-02-20': 'ring-2 ring-white text-white',
  '2026-02-25': 'ring-2 ring-emerald-500 text-white',
  // March 2026
  '2026-03-15': 'ring-2 ring-purple-500 text-white',
  '2026-03-20': 'ring-2 ring-white text-white',
  '2026-03-25': 'ring-2 ring-emerald-500 text-white',
};

const upcomingEvents = [
  { date: 'MAR 15', title: 'Hackathon 2026', color: 'bg-purple-500' },
  { date: 'MAR 20', title: 'Art Workshop', color: 'bg-indigo-500' },
  { date: 'MAR 25', title: 'Resume Review', color: 'bg-emerald-500' },
];

export default function CalendarSidebar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Start at March 2026 for consistency with design

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
