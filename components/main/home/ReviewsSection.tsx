'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['700'] });

interface Review {
  id: string;
  name: string;
  department: string;
  text: string;
  rating: number;
  image: string;
  time: string;
}

interface ReviewResponse {
  id: string;
  name: string;
  department: string;
  text: string;
  rating: number;
  image: string;
  review_added_date: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/main/home/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data: ReviewResponse[] = await response.json();
        
        const formattedReviews: Review[] = data.map((review) => ({
          id: review.id,
          name: review.name,
          department: review.department,
          text: review.text,
          rating: review.rating,
          image: review.image,
          time: getTimeAgo(new Date(review.review_added_date))
        }));

        setReviews(formattedReviews);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  function getTimeAgo(date: Date) {
     const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
     let interval = seconds / 31536000;
     if (interval > 1) return Math.floor(interval) + " Years Ago";
     interval = seconds / 2592000;
     if (interval > 1) return Math.floor(interval) + " Months Ago";
     interval = seconds / 604800;
     if (interval > 1) return Math.floor(interval) + " Weeks Ago";
     interval = seconds / 86400;
     if (interval > 1) return Math.floor(interval) + " Days Ago";
     interval = seconds / 3600;
     if (interval > 1) return Math.floor(interval) + " Hours Ago";
     interval = seconds / 60;
     if (interval > 1) return Math.floor(interval) + " Minutes Ago";
     return "Just Now";
  }

  if (loading) {
    return (
      <section className="relative py-24 bg-[#0b0515] overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-purple-400/80 font-medium animate-pulse">Loading verified reviews...</p>
        </div>
      </section>
    );
  }

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
            <p className="text-white/40 text-sm font-medium">Based On {reviews.length} Verified Reviews</p>
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
            {reviews.length === 0 && !loading && (
              <div className="text-white/60 col-span-full text-center py-10">
                No reviews yet. Check back later!
              </div>
            )}
            {reviews.map((review) => (
              <div
                key={review.id}
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
