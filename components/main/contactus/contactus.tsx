"use client";

import React from "react";
import { ChevronDown, Mail, MapPin, ArrowRight, Users, Dribbble, AtSign, Phone } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen text-white pb-20 pt-10 px-4 md:px-8 lg:px-16">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
          Get In <span className="text-[#f97316]">Touch</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
          Have questions or need help? Our team is here for you. We typically respond within 24 hours.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
        {/* Left Side: Contact Form */}
        <div className="lg:col-span-3 bg-[#131122] rounded-3xl p-8 md:p-10 border border-[#2d2a4a]/50 shadow-2xl">
          <form className="flex flex-col gap-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300 font-medium ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Alex Student" 
                  className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-2xl py-3.5 px-5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a855f7] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300 font-medium ml-1">Student Email</label>
                <input 
                  type="email" 
                  placeholder="alex@university.edu" 
                  className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-2xl py-3.5 px-5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a855f7] transition-colors"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300 font-medium ml-1">Subject</label>
              <div className="relative">
                <select className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-2xl py-3.5 px-5 text-white text-sm appearance-none focus:outline-none focus:border-[#a855f7] transition-colors">
                  <option>Club Registration Query</option>
                  <option>Event Question</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300 font-medium ml-1">Message</label>
              <textarea 
                placeholder="Tell us how we can help..." 
                rows={5}
                className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-2xl py-4 px-5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a855f7] transition-colors resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button 
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-[#9333ea] hover:bg-[#a855f7] text-white py-3.5 px-8 rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
              >
                Send Message <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Contact Info */}
        <div className="lg:col-span-2 bg-[#17152b] rounded-3xl p-8 md:p-10 border border-[#2d2a4a] shadow-xl flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-10">Contact Info</h2>

          <div className="flex flex-col gap-8 flex-1">
            {/* Email Us */}
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#f97316]" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-bold text-white text-base mb-1">Email Us</span>
                <span className="text-gray-400 text-sm">hello@engagex.edu</span>
              </div>
            </div>

            {/* Call Us */}
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-bold text-white text-base mb-1">Call Us</span>
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
            </div>

            {/* Visit Us */}
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#9333ea]/10 border border-[#9333ea]/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#9333ea]" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="font-bold text-white text-base mb-1">Visit Us</span>
                <span className="text-gray-400 text-sm leading-relaxed">
                  Student Union, Level 2<br />
                  University Campus Center
                </span>
              </div>
            </div>
          </div>

          <hr className="border-[#2d2a4a] my-8" />

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-white text-base mb-4">Social Media</h3>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-[#1e1b38] border border-[#2d2a4a] flex items-center justify-center hover:bg-[#2d2a4a] text-gray-400 hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1e1b38] border border-[#2d2a4a] flex items-center justify-center hover:bg-[#2d2a4a] text-gray-400 hover:text-white transition-colors">
                <Dribbble className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1e1b38] border border-[#2d2a4a] flex items-center justify-center hover:bg-[#2d2a4a] text-gray-400 hover:text-white transition-colors">
                <AtSign className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
