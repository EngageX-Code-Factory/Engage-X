"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Plus, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, Search } from "lucide-react";

type EventStatus = "active" | "cancelled";
interface Event {
  id: string; title: string; date: string; time: string;
  venue: string; category: string; capacity: number;
  is_published: boolean; status: EventStatus;
}

const DUMMY_EVENTS: Event[] = [
  { id: "1", title: "Tech Talk 2025", date: "2025-04-10", time: "14:00", venue: "Hall A", category: "Technology", capacity: 100, is_published: true, status: "active" },
  { id: "2", title: "Leadership Workshop", date: "2025-04-18", time: "10:00", venue: "Room 201", category: "Academic", capacity: 40, is_published: false, status: "active" },
  { id: "3", title: "Annual Sports Meet", date: "2025-05-02", time: "09:00", venue: "Main Ground", category: "Sports", capacity: 200, is_published: true, status: "cancelled" },
];

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
  const [events, setEvents] = useState<Event[]>(DUMMY_EVENTS);
  const [search, setSearch] = useState("");

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  function togglePublish(id: string) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, is_published: !e.is_published } : e));
  }

  function cancelEvent(id: string) {
    if (confirm("Cancel this event?")) {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status: "cancelled" } : e));
    }
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
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              {["Event", "Date & Time", "Venue", "Capacity", "Status", "Actions"].map(h => (
                <th key={h} className={`px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
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
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{event.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[displayStatus]}`}>
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
                      <Link href={`/organization/events/${event.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors">
                        <Eye size={16} />
                      </Link>
                      <Link href={`/organization/events/${event.id}?edit=true`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#8b5cf6] hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors">
                        <Pencil size={16} />
                      </Link>
                      {event.status !== "cancelled" && (
                        <button onClick={() => cancelEvent(event.id)}
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