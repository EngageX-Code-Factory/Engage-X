"use client";

import React from "react";
import { Search, Calendar, ChevronDown, Clock, Tag, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export default function Events() {
  const eventsData = [
    {
      id: 1,
      day: "25",
      month: "FEB",
      status: "OPEN",
      time: "10:00 AM",
      category: "Tech",
      title: "AI Symposium 2026",
      host: "Innovators Hub",
      location: "Main Auditorium",
      isOpen: true,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 2,
      day: "02",
      month: "MAR",
      status: "OPEN",
      time: "5:00 PM",
      category: "Music",
      title: "Spring Music Fest",
      host: "Harmony Society",
      location: "Open Grounds",
      isOpen: true,
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 3,
      day: "15",
      month: "MAR",
      status: "CLOSED",
      time: "9:00 AM",
      category: "Career",
      title: "Startup Bootcamp",
      host: "Future Leaders",
      location: "Innovation Lab",
      isOpen: false,
      image: "https://images.unsplash.com/vector-1738221650394-4f05255476ce?auto=format&fit=crop&q=80&w=600",
      altImageFallback: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;
  
  // Calculate pagination data
  const totalPages = Math.ceil(eventsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = eventsData.slice(startIndex, endIndex);

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
            placeholder="Search events..." 
            className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
          />
        </div>
        
        {/* Date Range Box */}
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
            <select className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3 pl-4 pr-10 text-gray-300 text-sm appearance-none focus:outline-none focus:border-[#8b5cf6] transition-colors">
              <option>All Categories</option>
              <option>Tech</option>
              <option>Music</option>
              <option>Career</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative w-full lg:w-48">
            <select className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3 pl-4 pr-10 text-gray-300 text-sm appearance-none focus:outline-none focus:border-[#8b5cf6] transition-colors">
              <option>All Clubs</option>
              <option>Innovators Hub</option>
              <option>Harmony Society</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {currentEvents.map((event) => (
          <div key={event.id} className="bg-[#17152b] rounded-2xl overflow-hidden border border-[#2d2a4a] flex flex-col hover:border-[#8b5cf6]/50 transition-colors duration-300">
            {/* Image Header with Overlays */}
            <div className="relative h-48 w-full bg-[#c9d5d3]">
              <img 
                src={event.image || event.altImageFallback} 
                alt={event.title} 
                className="w-full h-full object-cover mix-blend-multiply" 
                onError={(e) => {
                  if (event.altImageFallback) {
                    (e.target as HTMLImageElement).src = event.altImageFallback;
                  }
                }}
              />
              
              {/* Date Badge */}
              <div className="absolute top-4 left-4 bg-white rounded-xl w-14 h-14 flex flex-col items-center justify-center shadow-lg">
                <span className="text-black font-extrabold text-xl leading-none">{event.day}</span>
                <span className="text-gray-500 text-[0.65rem] font-bold tracking-widest mt-0.5">{event.month}</span>
              </div>

              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 text-[0.65rem] font-bold tracking-widest rounded-full uppercase shadow-lg ${
                event.isOpen ? "bg-[#10b981] text-white" : "bg-[#f43f5e] text-white"
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
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-[#9333ea] hover:bg-[#7e22ce] text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    Register
                  </button>
                  <button className="bg-transparent border border-[#2d2a4a] hover:bg-[#2d2a4a] text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                    Details
                  </button>
                </div>
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
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentPage === page 
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
    </div>
  );
}
