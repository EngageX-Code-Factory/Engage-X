import { Calendar, Users, Clock, TrendingUp, Bell, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Events', value: '0', icon: Calendar, bg: 'from-blue-600 to-blue-500' },
  { label: 'Active Members', value: '0', icon: Users, bg: 'from-emerald-600 to-emerald-500' },
  { label: 'Pending Requests', value: '0', icon: Clock, bg: 'from-amber-600 to-amber-500' },
  { label: 'Attendance Rate', value: '0%', icon: TrendingUp, bg: 'from-violet-600 to-violet-500' },
];

const quickLinks = [
  { href: '/organization/events/create', label: 'Create New Event', icon: Plus, desc: 'Schedule and publish an event' },
  { href: '/organization/members', label: 'Review Requests', icon: Users, desc: 'Approve or reject join requests' },
  { href: '/organization/notifications', label: 'Send Notification', icon: Bell, desc: 'Alert members about updates' },
  { href: '/organization/profile', label: 'Club Profile', icon: Calendar, desc: 'Edit your club details' },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back! 👋</h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Here is what is happening with your club today.</p>
        </div>
        <Link
          href="/organization/events/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors"
        >
          <Plus size={16} /> New Event
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, bg }) => (
          <div key={label} className={`rounded-2xl p-5 flex flex-col gap-4 bg-gradient-to-br ${bg}`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm font-medium mt-0.5 text-white/80">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-violet-300 dark:hover:border-violet-500/50"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50 dark:bg-violet-500/20 group-hover:scale-110 transition-transform">
                <Icon size={18} className="text-[#8b5cf6]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs mt-0.5 text-gray-400 dark:text-gray-500">{desc}</p>
              </div>
              <ArrowRight size={14} className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#8b5cf6]" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Registrations</h3>
          <Link href="/organization/events" className="text-xs font-medium flex items-center gap-1 text-[#8b5cf6] hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="p-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gray-100 dark:bg-white/5">
            <Calendar size={24} className="text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No activity yet</p>
          <p className="text-xs mt-1 text-gray-400 dark:text-gray-600">Student registrations will appear here.</p>
          <Link
            href="/organization/events/create"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors"
          >
            <Plus size={13} /> Create your first event
          </Link>
        </div>
      </div>

    </div>
  );
}