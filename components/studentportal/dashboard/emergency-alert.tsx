'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Megaphone, Eye } from 'lucide-react';
import Link from 'next/link';

export default function EmergencyAlert() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative group animate-in fade-in slide-in-from-top duration-500 max-w-fit">
      {/* Pulse Effect Background */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-10 group-hover:opacity-25 animate-pulse transition duration-1000" />
      
      <div className="relative flex items-center gap-4 bg-[#1a0b0b]/80 border border-red-500/20 backdrop-blur-xl rounded-2xl px-4 py-3 overflow-hidden shadow-2xl">
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 p-2 opacity-[0.03] pointer-events-none">
           <Megaphone className="w-12 h-12 text-red-500 rotate-12" />
        </div>

        {/* Content Section */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-600 rounded-full border border-[#1a0b0b] animate-ping" />
          </div>

          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-1 py-0.5 rounded-full bg-red-600 text-white text-[7px] font-black uppercase tracking-widest">
                Urgent
              </span>
            </div>
            <h2 className="text-[11px] font-black text-white italic tracking-tight whitespace-nowrap">
              Weather Alert: <span className="text-red-500 uppercase not-italic">Campus Closing Early</span>
            </h2>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 shrink-0 border-l border-white/5 pl-3 ml-1">
          <Link 
            href="/student/notifications"
            title="View Details"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            title="Mark as Read"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white shadow-lg shadow-red-900/40 hover:scale-[1.05] active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
