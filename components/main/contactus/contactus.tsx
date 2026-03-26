"use client";
import React, { useState } from "react";
import { ChevronDown, Mail, MapPin, ArrowRight, Users, Dribbble, AtSign, Phone, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "Club Registration Query",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/main/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({
          full_name: "",
          email: "",
          subject: "Club Registration Query",
          message: ""
        });
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send message. Please try again later.' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300 font-medium ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Alex Student" 
                  required
                  className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-2xl py-3.5 px-5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a855f7] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300 font-medium ml-1">Student Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@university.edu" 
                  required
                  className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-2xl py-3.5 px-5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a855f7] transition-colors"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300 font-medium ml-1">Subject</label>
              <div className="relative">
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-2xl py-3.5 px-5 text-white text-sm appearance-none focus:outline-none focus:border-[#a855f7] transition-colors"
                >
                  <option value="Club Registration Query">Club Registration Query</option>
                  <option value="Event Question">Event Question</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300 font-medium ml-1">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..." 
                rows={5}
                required
                className="w-full bg-[#1e1b38] border border-[#2d2a4a] rounded-2xl py-4 px-5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#a855f7] transition-colors resize-none"
              ></textarea>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm ${
                status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                {status.message}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-4">
              <button 
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-[#9333ea] hover:bg-[#a855f7] text-white py-3.5 px-8 rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Sending... <Loader2 className="w-4 h-4 animate-spin" /></>
                ) : (
                  <>Send Message <ArrowRight className="w-4 h-4" /></>
                )}
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
