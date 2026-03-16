"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard, Users, Calendar,
  ClipboardList, Bell, Building2, LogOut, Sun, Moon
} from 'lucide-react';

const navLinks = [
  { href: '/organization', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/organization/profile', label: 'Club Profile', icon: Building2 },
  { href: '/organization/events', label: 'Manage Events', icon: Calendar },
  { href: '/organization/members', label: 'Members & Requests', icon: Users },
  { href: '/organization/attendance', label: 'Attendance', icon: ClipboardList },
  { href: '/organization/notifications', label: 'Notifications', icon: Bell },
];

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function isActive(href: string) {
    if (href === '/organization') return pathname === '/organization';
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0b0515]">

      {/* Sidebar */}
      <aside className="w-64 flex flex-col shrink-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d]">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-widest uppercase text-gray-900 dark:text-white">
              ENGAGE<span className="text-[#8b5cf6]">X</span>
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
              Org
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3 text-gray-400 dark:text-white/30">
            Main Menu
          </p>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#8b5cf6] text-white shadow-sm shadow-purple-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={17} />
                <span>{label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2 bg-gray-50 dark:bg-white/5">
            <div className="w-8 h-8 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white text-sm font-bold shrink-0">
              C
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Club Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">Organization</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 flex items-center px-8 justify-between shrink-0 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d]">
          <div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-white">
              {navLinks.find(l => isActive(l.href))?.label ?? 'Dashboard'}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Club Organization Panel</p>
          </div>
          <div className="flex items-center gap-3">

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {mounted
                ? theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />
                : <Moon size={18} />
              }
            </button>

            {/* Bell */}
            <button className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              <div className="w-7 h-7 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white text-xs font-bold">
                C
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Club Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0b0515]">
          {children}
        </main>
      </div>
    </div>
  );
}