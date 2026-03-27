"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Type, Image as ImageIcon, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    event_time: '',
    event_end_time: '',
    location: '',
    image: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/organization/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/organization'), 2000);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold dark:text-white">Event Published!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting you to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/organization" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8b5cf6] transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-[#0f0c1d] rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Event</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details to announce your event to the university.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Event Title</label>
            <div className="flex items-center gap-3 px-4 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus-within:border-[#8b5cf6] transition-all">
              <Type size={18} className="text-gray-400" />
              <input 
                type="text" 
                required 
                placeholder="e.g. Annual Tech Symposium"
                className="bg-transparent w-full outline-none text-sm dark:text-white"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Date</label>
              <div className="flex items-center gap-3 px-4 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus-within:border-[#8b5cf6]">
                <Calendar size={18} className="text-gray-400" />
                <input 
                  type="date" 
                  required 
                  className="bg-transparent w-full outline-none text-sm dark:text-white"
                  value={formData.event_date}
                  onChange={e => setFormData({...formData, event_date: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Location</label>
              <div className="flex items-center gap-3 px-4 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus-within:border-[#8b5cf6]">
                <MapPin size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Main Auditorium"
                  className="bg-transparent w-full outline-none text-sm dark:text-white"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Start Time</label>
              <div className="flex items-center gap-3 px-4 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus-within:border-[#8b5cf6]">
                <Clock size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  required 
                  placeholder="09:00 AM"
                  className="bg-transparent w-full outline-none text-sm dark:text-white"
                  value={formData.event_time}
                  onChange={e => setFormData({...formData, event_time: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">End Time</label>
              <div className="flex items-center gap-3 px-4 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus-within:border-[#8b5cf6]">
                <Clock size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="12:00 PM"
                  className="bg-transparent w-full outline-none text-sm dark:text-white"
                  value={formData.event_end_time}
                  onChange={e => setFormData({...formData, event_end_time: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Cover Image URL</label>
            <div className="flex items-center gap-3 px-4 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus-within:border-[#8b5cf6]">
              <ImageIcon size={18} className="text-gray-400" />
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/..."
                className="bg-transparent w-full outline-none text-sm dark:text-white"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Creating Event...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}