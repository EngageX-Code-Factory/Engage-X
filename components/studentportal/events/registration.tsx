'use client';

import { useState } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, Clock, 
  Users, CheckCircle2, ChevronRight, Send, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Event, CATEGORY_COLORS, FACULTY_COLORS } from './data';

interface RegistrationProps {
  event: Event;
}

export default function Registration({ event }: RegistrationProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Alex Morgan',
    studentId: 'ST-2024-001',
    email: 'alex.morgan@university.edu',
    phone: '',
    department: 'Computing',
    dietary: '',
    note: ''
  });

  const catClass = CATEGORY_COLORS[event.category] ?? 'bg-gray-500/20 text-gray-300';
  const facColor = FACULTY_COLORS[event.organizerFaculty] ?? 'text-purple-400';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 italic tracking-tight">Registration <span className="text-emerald-400">Successful!</span></h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
          Awesome! You've successfully registered for **{event.title}**. We've sent a confirmation email with all the details to your inbox.
        </p>
        
        <div className="bg-white/3 border border-white/10 rounded-[2rem] p-8 text-left mb-10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Send className="w-20 h-20 text-emerald-400" />
          </div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            Registration Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-gray-500 text-sm">Ticket ID</span>
              <span className="text-white font-mono text-sm">#EX-REG-{event.id}-8821</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-gray-500 text-sm">Event</span>
              <span className="text-white font-bold text-sm">{event.title}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-500 text-sm">Date & Time</span>
              <span className="text-white text-sm">{event.date} {event.month} • {event.time}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/student/events"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <Link 
        href="/student/events"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 group transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Back to Events</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Event Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${catClass} backdrop-blur-md border border-white/10`}>
                {event.category}
              </span>
              <h1 className="text-3xl font-black text-white mt-4 italic leading-tight">{event.title}</h1>
            </div>
          </div>

          <div className="bg-white/3 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Calendar className="w-24 h-24 text-white" />
             </div>
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-purple-500 rounded-full" />
                Event Information
             </h3>
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Date</p>
                    <p className="text-white font-bold">{event.date} {event.month}, {event.year}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/20">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Time</p>
                    <p className="text-white font-bold">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Venue</p>
                    <p className="text-white font-bold">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-6 border-t border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Organizer</p>
                    <p className={`text-sm font-bold ${facColor}`}>{event.organizer}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white/3 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl relative">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white italic tracking-tight">Registration <span className="text-purple-400">Details</span></h2>
                <p className="text-gray-400 text-sm mt-1">Please provide accurate information for your ticket.</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
                <Send className="w-6 h-6 text-amber-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/40 outline-none transition-all" 
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Student ID</label>
                <input 
                  type="text" 
                  value={formData.studentId}
                  readOnly
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-gray-400 outline-none cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  readOnly
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-gray-400 outline-none cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/40 outline-none transition-all" 
                  placeholder="e.g. +94 77 123 4567"
                />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Dietary Requirements (Optional)</label>
              <textarea 
                rows={2}
                value={formData.dietary}
                onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/40 outline-none transition-all resize-none" 
                placeholder="List any food allergies or preferences..."
              />
            </div>

            <div className="space-y-2 mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Special Notes for Organizer</label>
              <textarea 
                rows={3}
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/40 outline-none transition-all resize-none" 
                placeholder="Any questions or additional information..."
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-10 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-200/80 leading-relaxed font-medium">
                By clicking register, you agree to attend the event and follow the campus code of conduct. Registrations can be cancelled up to 24 hours before the event start time.
              </p>
            </div>

            <button 
              type="submit"
              className="w-full h-16 rounded-[1.5rem] bg-purple-600 text-white font-black text-lg shadow-xl shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              Confirm Registration
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
