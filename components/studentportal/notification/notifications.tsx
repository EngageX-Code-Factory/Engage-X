'use client';

import { useState, useMemo } from 'react';
import { 
  Bell, Siren, AlertOctagon, BookOpen, User, 
  Settings, CheckCircle2, X, Filter, Hash, Search, Clock
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type NotificationType = 'emergency' | 'academic' | 'club' | 'system';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'CAMPUS EMERGENCY: Severe Weather Warning',
    message: 'A severe weather warning has been issued for the campus area. Please seek shelter immediately and stay away from windows until further notice.',
    type: 'emergency',
    timestamp: '2 mins ago',
    isRead: false
  },
  {
    id: '2',
    title: 'Academic Deadline: Final Enrollment',
    message: 'This is a reminder that the final deadline for course enrollment for the Spring 2026 semester is tomorrow at 5:00 PM.',
    type: 'academic',
    timestamp: '1 hour ago',
    isRead: false
  },
  {
    id: '3',
    title: 'Robotics Club: Meeting Rescheduled',
    message: 'The weekly Robotics Club meeting has been moved from Room 402 to Lab 12 for today. The time remains 4:00 PM.',
    type: 'club',
    timestamp: '3 hours ago',
    isRead: true
  },
  {
    id: '4',
    title: 'System Update: Maintenance Scheduled',
    message: 'The student portal will undergo routine maintenance this Saturday from 2:00 AM to 4:00 AM. Expect some downtime during this period.',
    type: 'system',
    timestamp: '5 hours ago',
    isRead: false
  },
  {
    id: '5',
    title: 'EMERGENCY: Fire Drill in Block C',
    message: 'There will be a scheduled fire drill in Science Block C today at 2:30 PM. Please evacuate using the nearest emergency exit when you hear the alarm.',
    type: 'emergency',
    timestamp: '6 hours ago',
    isRead: true
  },
  {
    id: '6',
    title: 'Course Update: CS302 Assignment 2',
    message: 'A new assignment has been posted for CS302: Advanced Algorithms. The submission deadline is two weeks from today.',
    type: 'academic',
    timestamp: '1 day ago',
    isRead: true
  }
];

// ── Components ─────────────────────────────────────────────────────────────

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'emergency': return <Siren className="w-5 h-5 text-red-500 animate-pulse" />;
    case 'academic':  return <BookOpen className="w-5 h-5 text-blue-400" />;
    case 'club':      return <User className="w-5 h-5 text-purple-400" />;
    case 'system':    return <Settings className="w-5 h-5 text-gray-400" />;
  }
};

const typeColors: Record<NotificationType, string> = {
  emergency: 'border-red-500/30 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
  academic:  'border-blue-500/20 bg-blue-500/5',
  club:      'border-purple-500/20 bg-purple-500/5',
  system:    'border-white/10 bg-white/5'
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesFilter = filter === 'all' || n.type === filter;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, searchQuery]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col gap-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">University Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-lg shadow-purple-600/20">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <p className="text-gray-400">Stay updated with campus life, academic deadlines, and emergency alerts.</p>
        </div>
        
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search alerts and messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-white/3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 focus:bg-white/5 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto no-scrollbar">
          {(['all', 'emergency', 'academic', 'club', 'system'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === type 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notifications List ── */}
      <div className="flex flex-col gap-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => !notif.isRead && markAsRead(notif.id)}
              className={`group relative rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                typeColors[notif.type]
              } ${notif.isRead ? 'opacity-70 grayscale-[0.3]' : 'hover:scale-[1.01] hover:border-white/20 hover:shadow-2xl'}`}
            >
              {/* Emergency Pulse Background */}
              {notif.type === 'emergency' && !notif.isRead && (
                <div className="absolute inset-0 bg-red-500/5 animate-pulse -z-10" />
              )}
              
              {/* Status Indicator */}
              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon Container */}
                <div className={`p-3 rounded-xl border shrink-0 ${
                  notif.type === 'emergency' 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-white/5 border-white/5'
                }`}>
                  <NotificationIcon type={notif.type} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-base font-bold tracking-tight line-clamp-1 ${
                      notif.type === 'emergency' ? 'text-red-400' : 'text-white'
                    }`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="p-1 px-1 rounded-md text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed pr-8">
                    {notif.message}
                  </p>
                  
                  {/* Footer Tag */}
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-bold tracking-widest uppercase">
                    <span className={`flex items-center gap-1.5 ${
                      notif.type === 'emergency' ? 'text-red-500' : 'text-purple-400'
                    }`}>
                      <Hash className="w-3 h-3 opacity-50" />
                      {notif.type} type
                    </span>
                    {!notif.isRead && (
                      <span className="text-orange-400 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-orange-400" />
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">No notifications found</h3>
            <p className="text-gray-400 text-sm">We couldn't find any notifications matching your current filters.</p>
          </div>
        )}
      </div>

      {/* ── Footer Stats ── */}
      <div className="flex items-center justify-center gap-8 py-6 border-t border-white/5 mt-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white tracking-tighter">{notifications.length}</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total</span>
        </div>
        <div className="w-px h-8 bg-white/5" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-400 tracking-tighter">{unreadCount}</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Unread</span>
        </div>
        <div className="w-px h-8 bg-white/5" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-red-500 tracking-tighter">
            {notifications.filter(n => n.type === 'emergency').length}
          </span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alerts</span>
        </div>
      </div>
    </div>
  );
}
