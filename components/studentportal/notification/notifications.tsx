'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Bell, Siren, AlertOctagon, BookOpen, User, 
  Settings, CheckCircle2, X, Hash, Search, Clock, Loader2
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
  created_at: string;
}

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/student/notifications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesFilter = filter === 'all' || n.type === filter;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, searchQuery]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAsRead', notificationId: id })
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllAsRead' })
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', notificationId: id })
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
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
          disabled={loading || unreadCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* ── Loading State ── */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
          <p className="text-gray-400">Loading notifications...</p>
        </div>
      )}

      {/* ── Error State ── */}
      {error && !loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertOctagon className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Failed to load notifications</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchNotifications}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Notifications List ── */}
      {!loading && !error && (
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
              <p className="text-gray-400 text-sm">We couldn&#39;t find any notifications matching your current filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Footer Stats ── */}
      {!loading && !error && (
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
      )}
    </div>
  );
}
