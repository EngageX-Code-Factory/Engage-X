'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['700'] });

const REVIEWS = [
  {
    name: "Alex Morgan",
    department: "Computer Science, Year 2",
    text: "EngageX has completely transformed my university experience. Finding clubs that match my interests in robotics was so easy, and the events are always top-notch!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80",
    time: "2 Weeks Ago"
  },
  {
    name: "Sarah Jenkins",
    department: "Fine Arts, Year 3",
    text: "I love how organized everything is. From joining the Music Society to tracking upcoming concerts, this platform handles it all seamlessly. Highly recommended!",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80",
    time: "1 Week Ago"
  },
  {
    name: "David Chen",
    department: "Business Admin, Year 4",
    text: "As a club president, managing members and events used to be chaos. This system centralized everything and increased our member engagement significantly.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80",
    time: "3 Days Ago"
  }
];

export default function ReviewsSection() {
  return (
    <section className="relative py-24 bg-[#0b0515] overflow-hidden">
      {/* Innovative Ripple Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]"
            style={{
              width: `${(i + 1) * 300}px`,
              height: `${(i + 1) * 300}px`,
            }}
          />
        ))}
        {/* Wavy/Grainy Filter Overlay */}
        <div className="absolute inset-0 bg-[#0b0515]/20 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Top Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Student <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">Voices</span>
          </h2>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 group">
              <span className="text-yellow-400 font-bold text-lg">4.8/5</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white/60 font-medium ml-2">TrustWave Reviews</span>
            </div>
            <p className="text-white/40 text-sm font-medium">Based On 3,450+ Verified Students</p>
          </div>
        </div>

        {/* Layout Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16">
          {/* Left Side Quote Section */}
          <div className="lg:w-1/4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 transform -rotate-6">
              <Quote className="w-12 h-12 text-white fill-white" />
            </div>
            <h3 className={`${spaceGrotesk.className} text-4xl md:text-5xl text-white font-bold leading-[1.1]`}>
              What <span className="text-white/40">Our</span> <br />
              <span className="text-white">Students</span> <br />
              Are Saying
            </h3>
            <div className="mt-8 w-16 h-1 bg-white/10 rounded-full"></div>
          </div>

          {/* Right Side Cards Grid */}
          <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {REVIEWS.map((review, index) => (
              <div
                key={index}
                className="group relative bg-[#130a21]/40 backdrop-blur-xl border border-white/[0.05] rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-white/10 flex flex-col h-full"
              >
                <p className="text-white/80 text-lg leading-relaxed mb-8 flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400 fill-current' : 'text-white/20'}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-md opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
                    <Image
                      src={review.image}
                      alt={review.name}
                      width={48}
                      height={48}
                      className="relative w-12 h-12 rounded-full object-cover border-2 border-white/10"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base leading-none mb-1">{review.name}</h4>
                    <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">{review.time}</span>
                  </div>
                </div>

                {/* Corner Decorative Element */}
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extreme Low-Bottom Decorative Gradient */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-purple-600/10 to-transparent blur-3xl pointer-events-none"></div>
    </section>
  );
}
