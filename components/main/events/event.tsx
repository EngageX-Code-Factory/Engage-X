"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, ChevronDown, Clock, Tag, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All Categories');
  const [clubFilter, setClubFilter] = React.useState('All Clubs');

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/public/events');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        const mapped = data.map((e: any) => {
          const dateObj = new Date(e.event_date);
          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          return {
            id: e.id,
            day: dateObj.getDate().toString().padStart(2, '0'),
            month: months[dateObj.getMonth()],
            status: e.status,
            time: e.event_time,
            category: (Array.isArray(e.clubs) ? e.clubs[0]?.category : e.clubs?.category) || 'Other',
            title: e.title,
            host: (Array.isArray(e.clubs) ? e.clubs[0]?.club_name : e.clubs?.club_name) || 'Unknown Host',
            location: e.location,
            isOpen: e.status !== 'CLOSED' && e.status !== 'FILLED',
            image: e.image,
          };
        });
        setEvents(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const itemsPerPage = 6;

  // Filtering logic
  const filteredEvents = React.useMemo(() => {
    return events.filter(e => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.host.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All Categories' || e.category === categoryFilter;
      const matchClub = clubFilter === 'All Clubs' || e.host === clubFilter;
      return matchSearch && matchCategory && matchClub;
    });
  }, [events, search, categoryFilter, clubFilter]);

  // Calculate pagination data
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Dynamic filter options
  const categories = ['All Categories', ...new Set(events.map(e => e.category))];
  const clubs = ['All Clubs', ...new Set(events.map(e => e.host))];

  return (
    <div className="min-h-screen text-white pb-20 pt-10 px-4 md:px-8 lg:px-16">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Discover Events</h1>
        <p className="text-gray-400 text-lg">
          Workshops, Concerts, Hackathons & More.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-12 justify-center max-w-6xl mx-auto items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events or host clubs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
          />
        </div>

        {/* Date Range Box (Static for now, but UI exists) */}
        <div className="flex items-center gap-2 bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-2 px-4 w-full lg:w-auto overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <input
              type="date"
              className="bg-transparent text-gray-400 text-sm focus:outline-none focus:text-white cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
            />
            <Calendar className="w-4 h-4 text-gray-500 pointer-events-none -ml-6" />
          </div>
          <span className="text-gray-500 text-xs px-2">to</span>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <input
              type="date"
              className="bg-transparent text-gray-400 text-sm focus:outline-none focus:text-white cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
            />
            <Calendar className="w-4 h-4 text-gray-500 pointer-events-none -ml-6" />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative w-full lg:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3 pl-4 pr-10 text-gray-300 text-sm appearance-none focus:outline-none focus:border-[#8b5cf6] transition-colors"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative w-full lg:w-48">
            <select
              value={clubFilter}
              onChange={(e) => { setClubFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3 pl-4 pr-10 text-gray-300 text-sm appearance-none focus:outline-none focus:border-[#8b5cf6] transition-colors"
            >
              {clubs.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5cf6] mb-4" />
          <p className="text-gray-400 animate-pulse">Searching for matchless experiences...</p>
        </div>
      ) : currentEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {currentEvents.map((event) => (
              <div key={event.id} className="bg-[#17152b] rounded-2xl overflow-hidden border border-[#2d2a4a] flex flex-col hover:border-[#8b5cf6]/50 transition-colors duration-300">
                {/* Image Header with Overlays */}
                <div className="relative h-48 w-full bg-[#0f0c29]">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600"}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                  />

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl w-14 h-14 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-black font-extrabold text-xl leading-none">{event.day}</span>
                    <span className="text-gray-500 text-[0.65rem] font-bold tracking-widest mt-0.5">{event.month}</span>
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 text-[0.65rem] font-bold tracking-widest rounded-full uppercase shadow-lg ${event.isOpen ? "bg-[#10b981] text-white" : "bg-[#f43f5e] text-white"
                    }`}>
                    {event.status}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Upper Details Row */}
                  <div className="flex justify-between items-center mb-4 text-xs font-medium text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{event.category}</span>
                    </div>
                  </div>

                  {/* Title & Host */}
                  <h3 className="text-xl font-bold text-white mb-1.5">{event.title}</h3>
                  <p className="text-[#a855f7] text-sm font-semibold mb-6">Hosted by: {event.host}</p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 mt-auto">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>

                  {/* Card Actions */}
                  {event.isOpen ? (
                    <button 
                      onClick={() => router.push('/auth/sign-up')}
                      className="w-full bg-[#9333ea] hover:bg-[#7e22ce] text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    >
                      Register Now
                    </button>
                  ) : (
                    <button disabled className="w-full bg-[#1e1b38] text-gray-500 py-3 rounded-xl text-sm font-semibold cursor-not-allowed">
                      Registration Closed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1e1a33] border border-[#2d2a4a] text-gray-400 hover:text-white hover:bg-[#2d2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${currentPage === page
                      ? "bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-[#a855f7]"
                      : "bg-[#1e1a33] border border-[#2d2a4a] text-gray-400 hover:text-white hover:bg-[#2d2a4a]"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#1e1a33] border border-[#2d2a4a] text-gray-400 hover:text-white hover:bg-[#2d2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1e1b38] flex items-center justify-center mb-6 border border-[#2d2a4a]">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 italic tracking-tight">No Events <span className="text-[#a855f7]">Match</span> Your Search</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
            We couldn't find any events matching your current filters. Try adjusting your search keywords or broadening your category selection.
          </p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter('All Categories'); setClubFilter('All Clubs'); }}
            className="px-8 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
