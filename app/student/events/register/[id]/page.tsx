'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { allEvents } from '@/components/studentportal/events/data';
import Registration from '@/components/studentportal/events/registration';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventRegistrationPage({ params }: PageProps) {
  const { id } = use(params);
  const event = allEvents.find((e) => e.id === parseInt(id));

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0b0515]">
      <Registration event={event} />
    </div>
  );
}
