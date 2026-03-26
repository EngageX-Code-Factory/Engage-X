"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Plus, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type EventStatus = "active" | "cancelled";
interface Event {
  id: string; title: string; date: string; time: string;
  venue: string; category: string; capacity: number;
  is_published: boolean; status: EventStatus;
}

function getDisplayStatus(event: Event) {
  if (event.status === "cancelled") return "cancelled";
  return event.is_published ? "published" : "draft";
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  draft: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvents() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: leader } = await supabase.from('my_clubs').select('club_id').eq('user_id', user.id).eq('status', 'LEADER').single();
      if (!leader) return setIsLoading(false);

      const { data } = await supabase.from('events').select('*').eq('club_id', leader.club_id).order('event_date', { ascending: false });

      if (data) {
        setEvents(data.map(d => ({
          id: d.id,
          title: d.title,
          date: d.event_date,
          time: d.event_time,
          venue: d.location,
          category: d.category || "Uncategorized", // Now fetching real category!
          capacity: 0, // Placeholder: Capacity isn't in your DB yet
          is_published: d.status === 'OPEN',
          status: d.status === 'CLOSED' ? 'cancelled' : 'active'
        })));
      }
      setIsLoading(false);
    }
    fetchEvents();
  }, []);

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  async function togglePublish(id: string) {
    const event = events.find(e => e.id === id);
    if (!event) return;
    
    const newStatus = event.is_published ? 'SOON' : 'OPEN'; 
    await supabase.from('events').update({ status: newStatus }).eq('id', id);
    
    setEvents(prev => prev.map(e => e.id === id ? { ...e, is_published: !e.is_published } : e));
  }

  // UPDATED: Hard Delete with Error Trapping
  async function cancelEvent(id: string) {
    if (confirm("Are you sure you want to completely delete this event?")) {
      // Attempt to physically delete the row from the database
      const { error } = await supabase.from('events').delete().eq('id', id);

      if (error) {
        console.error("Supabase Error:", error);
        alert(`Could not delete event: ${error.message}\n\nIf this says "violates foreign key constraint", it means students are already registered for this event!`);
      } else {
        // If successful, remove it from the screen immediately
        setEvents(prev => prev.filter(e => e.id !== id));
      }
    }
  }

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#8b5cf6] h-8 w-8" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Events</h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Create, edit and manage your club events.</p>
        </div>
        <Link href="/organization/events/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={16} /> Create Event
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              {["Event", "Date & Time", "Venue", "Status", "Actions"].map(h => (
                <th key={h} className={`px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <Calendar size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No events found.</p>
                  <Link href="/organization/events/create" className="text-[#8b5cf6] text-xs hover:underline mt-1 inline-block">Create your first event →</Link>
                </td>
              </tr>
            ) : filtered.map(event => {
              const displayStatus = getDisplayStatus(event);
              return (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{event.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 dark:text-gray-300">{new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{event.time}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{event.venue}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${STATUS_STYLES[displayStatus]}`}>
                      {displayStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {event.status !== "cancelled" && (
                        <button onClick={() => togglePublish(event.id)} title={event.is_published ? "Unpublish" : "Publish"}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#8b5cf6] hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors">
                          {event.is_published ? <ToggleRight size={18} className="text-[#8b5cf6]" /> : <ToggleLeft size={18} />}
                        </button>
                      )}
                      <Link href={`/organization/events/${event.id}?edit=true`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#8b5cf6] hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors">
                        <Pencil size={16} />
                      </Link>
                      {event.status !== "cancelled" && (
                        <button onClick={() => cancelEvent(event.id)} title="Delete Event"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}