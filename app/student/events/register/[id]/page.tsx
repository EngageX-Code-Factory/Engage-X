'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Registration from '@/components/studentportal/events/registration';
import { Event } from '@/components/studentportal/events/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventRegistrationPage({ params }: PageProps) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/student/events/${id}`);
        if (!res.ok) {
           if (res.status === 404) return setEvent(null);
           throw new Error('Failed to fetch event');
        }
        const e = await res.json();
        const dateObj = new Date(e.event_date);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        const mappedEvent: Event = {
            id: e.id,
            title: e.title,
            date: dateObj.getDate().toString().padStart(2, '0'),
            month: months[dateObj.getMonth()],
            year: dateObj.getFullYear(),
            time: e.event_time,
            location: e.location,
            status: 'OPEN',
            category: (Array.isArray(e.clubs) ? e.clubs[0]?.category : e.clubs?.category) || 'OTHER',
            organizer: (Array.isArray(e.clubs) ? e.clubs[0]?.club_name : e.clubs?.club_name) || 'Unknown Organization',
            image: e.image,
            attendees: e.attendees
        };
        setEvent(mappedEvent);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0b0515] text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mr-4"></div>
            <p>Loading event details...</p>
        </div>
    );
  }

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0b0515]">
      <Registration event={event} />
    </div>
  );
}
