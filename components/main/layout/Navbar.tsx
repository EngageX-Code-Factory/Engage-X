'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Network } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-5xl bg-[#0b0515]/50 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex justify-between items-center shadow-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white tracking-widest uppercase">ENGAGE<span className="text-[#8b5cf6]">X</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/clubs" className="text-sm font-medium text-gray-200 hover:text-white transition-colors">
            Clubs
          </Link>
          <Link href="/events" className="text-sm font-medium text-gray-200 hover:text-white transition-colors">
            Events
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-200 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-200 hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/auth/register"
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            Join Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-purple-300 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#0b0515] border border-white/10 rounded-2xl p-4 md:hidden shadow-xl">
          <div className="flex flex-col space-y-4">
            <Link href="/clubs" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsOpen(false)}>
              Clubs
            </Link>
            <Link href="/events" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsOpen(false)}>
              Events
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/auth/register"
                className="block w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-full font-medium text-center transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}