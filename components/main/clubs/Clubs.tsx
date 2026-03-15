"use client";

import React from "react";
import { Search, ChevronDown, RotateCcw, Users, Calendar, Megaphone, ChevronLeft, ChevronRight } from "lucide-react";

export default function Clubs() {
  const clubsData = [
    {
      id: 1,
      title: "Robotics & AI Club",
      faculty: "Faculty of Computing",
      description: "Building the future with code and gears. Join us for weekly workshops, hackathons, and robot wars.",
      members: "150+ Members",
      eventsText: "3 Upcoming Events",
      eventsIcon: Calendar,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600",
      badge: "TECHNOLOGY",
      badgeColor: "bg-[#181a1f]/80 text-white",
    },
    {
      id: 2,
      title: "Rhythm Music Society",
      faculty: "Faculty of Arts",
      description: "For those who live and breathe music. Jam sessions every Friday and annual campus...",
      members: "85 Members",
      eventsText: "1 Upcoming Event",
      eventsIcon: Calendar,
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=600",
      badge: "MUSIC",
      badgeColor: "bg-[#181a1f]/80 text-white",
    },
    {
      id: 3,
      title: "Extreme Sports Club",
      faculty: "Sports Department",
      description: "Pushing limits together. From rock climbing to surfing, we organize monthly trips for adrenaline...",
      members: "120+ Members",
      eventsText: "2 Upcoming Events",
      eventsIcon: Calendar,
      image: "https://images.unsplash.com/photo-1526676037598-3932cb412da7?auto=format&fit=crop&q=80&w=600",
      badge: "SPORTS",
      badgeColor: "bg-[#181a1f]/80 text-white",
    },
    {
      id: 4,
      title: "Drama & Theatre",
      faculty: "Faculty of Arts",
      description: "Express yourself on stage. We produce two major plays a year and host weekly improv workshops.",
      members: "60 Members",
      eventsText: "Auditions Open",
      eventsIcon: Megaphone,
      image: "https://images.unsplash.com/photo-1507676184212-d0c30078225c?auto=format&fit=crop&q=80&w=600",
      badge: "ARTS",
      badgeColor: "bg-[#181a1f]/80 text-white",
    },
    {
      id: 5,
      title: "Science Research Hub",
      faculty: "Faculty of Science",
      description: "Collaborate on cutting-edge research projects. Connect with professors and publish your findings.",
      members: "45 Members",
      eventsText: "1 Upcoming Event",
      eventsIcon: Calendar,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
      badge: "ACADEMIC",
      badgeColor: "bg-emerald-500 text-white",
    }
  ];
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;
  
  // Calculate pagination data
  const totalPages = Math.ceil(clubsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClubs = clubsData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen text-white pb-20 pt-10 px-4 md:px-8 lg:px-16">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Explore Clubs</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Find your tribe. Join communities that share your passion and build lifelong<br className="hidden md:block" />
          connections on campus.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center max-w-6xl mx-auto items-stretch">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search clubs by name..." 
            className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
          />
        </div>
        
        <div className="relative w-full md:w-56">
          <select className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3.5 pl-4 pr-10 text-gray-300 text-sm appearance-none focus:outline-none focus:border-[#8b5cf6] transition-colors">
            <option>Select Category</option>
            <option>Technology</option>
            <option>Arts</option>
            <option>Sports</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>

        <div className="relative w-full md:w-56">
          <select className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-xl py-3.5 pl-4 pr-10 text-gray-300 text-sm appearance-none focus:outline-none focus:border-[#8b5cf6] transition-colors">
            <option>Select Faculty</option>
            <option>Faculty of Computing</option>
            <option>Faculty of Arts</option>
            <option>Faculty of Science</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>

        <button className="bg-[#1e1b38] border border-[#2d2a4a] rounded-xl w-12 flex items-center justify-center shrink-0 hover:bg-[#2d2a4a] transition-colors">
          <RotateCcw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {currentClubs.map((club) => {
          const Icon = club.eventsIcon;
          return (
            <div key={club.id} className="bg-[#17152b] rounded-2xl overflow-hidden border border-[#2d2a4a] flex flex-col hover:border-[#8b5cf6]/50 transition-colors duration-300">
              {/* Image Header */}
              <div className="relative h-56 w-full">
                <img 
                  src={club.image} 
                  alt={club.title} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 right-4 px-3 py-1.5 text-[0.65rem] font-bold tracking-wider rounded-full uppercase shadow-lg ${club.badgeColor}`}>
                  {club.badge}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1 relative">
                <h3 className="text-xl font-bold text-white mb-1">{club.title}</h3>
                <p className="text-[#f97316] text-xs font-semibold mb-4">{club.faculty}</p>
                <p className="text-gray-400 text-sm mb-6 flex-1 pr-2">
                  {club.description}
                </p>

                {/* Info row */}
                <div className="flex items-center gap-6 mb-6 text-xs font-medium text-gray-300">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#8b5cf6]" />
                    <span>{club.members}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#8b5cf6]" />
                    <span>{club.eventsText}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button className="bg-[#9333ea] hover:bg-[#7e22ce] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    Details
                  </button>
                  <button className="bg-transparent border border-[#2d2a4a] hover:bg-[#2d2a4a] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    Join Club
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
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
    </div>
  );
}
