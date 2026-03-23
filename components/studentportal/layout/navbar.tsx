'use client';

import { Bell, ChevronDown, Zap, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import ConfirmationModal from './ConfirmationModal';

const navLinks = [
  { label: 'Dashboard', href: '/student' },
  { label: 'My Clubs', href: '/student/clubs' },
  { label: 'All Clubs', href: '/student/all-clubs' },
  { label: 'Events', href: '/student/events' },
  { label: 'Event Planner', href: '/student/event-planner' },
];

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    avatarUrl: ''
  });
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    const fetchUnreadCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true }) // Only count, no data fetch if possible, but we need filter
          .eq('user_id', user.id)
          .eq('is_read', false); // Assuming 'is_read' in DB is snake_case, verify schema

        if (!error && count !== null) {
            setUnreadCount(count);
        }
      } catch (error) {
        console.error('Failed to fetch notifications count', error);
      }
    };

    const setupRealtime = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Subscribe to changes for this user
        channel = supabase
            .channel('realtime-navbar-notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                () => {
                    fetchUnreadCount();
                }
            )
            .subscribe();
        
        // Initial fetch
        fetchUnreadCount();
    };

    setupRealtime();
    
    // Refresh count every minute as backup
    const interval = setInterval(fetchUnreadCount, 60000);
    
    return () => {
        clearInterval(interval);
        if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/student/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            avatarUrl: data.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile for navbar', error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <nav className="bg-[#0b0515]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/student" className="flex items-center gap-2 mr-10">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">EngageX</span>
          </Link>

          {/* Nav Links */}
          <ul className="flex items-center gap-1 self-stretch">
            {navLinks.map((link) => {
              // Exact match for dashboard, prefix match for sub-routes
              const isActive =
                link.href === '/student'
                  ? pathname === '/student'
                  : pathname.startsWith(link.href);
              return (
                <li key={link.label} className="relative flex items-center h-16">
                  <Link
                    href={link.href}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-md ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 rounded-full" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-3">
            {/* Main Site Link */}
            <Link 
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wider border border-white/5 hover:border-white/10"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Main Site</span>
            </Link>

            {/* Notification Bell */}
            <Link 
              href="/student/notifications"
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                {profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {profileData.firstName && profileData.lastName
                      ? `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase()
                      : 'A'
                    }
                  </div>
                )}
                <span className="text-sm font-medium text-gray-200">
                  {profileData.firstName && profileData.lastName
                    ? `${profileData.firstName} ${profileData.lastName}`
                    : 'Alex Morgan'
                  }
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1d25] border border-white/10 rounded-xl shadow-xl py-1">
                  {['Profile', 'Sign out'].map((item) => (
                    <Link
                      key={item}
                      onClick={() => {
                        setProfileOpen(false);
                        if (item === 'Sign out') {
                          setShowSignOutModal(true);
                        }
                      }}
                      href={item === 'Profile' ? '/student/profile' : '#'}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ConfirmationModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={() => {
          console.log('User signed out');
          // Add actual sign out redirect logic here if needed
        }}
        title="Sign Out"
        message="Are you sure you want to sign out of your EngageX account?"
        confirmText="Sign Out"
        type="info"
      />
    </>
  );
}
