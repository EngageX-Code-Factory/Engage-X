'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch('/api/student/recent-activity');
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl p-5 min-h-[160px]">
      <h3 className="text-white font-semibold text-sm mb-4">Recent Activity</h3>
      
      {loading ? (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative flex items-start gap-3">
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute left-[7px] top-4 w-px h-[120%] bg-white/10" />
              )}
              {/* Dot */}
              <span className={`mt-1 w-3.5 h-3.5 rounded-full shrink-0 border-2 border-[#16181f] shadow-[0_0_8px_rgba(255,255,255,0.1)] ${activity.color}`} />
              <div>
                <p className="text-sm text-gray-200 leading-snug">{activity.text}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4">
          <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">No Recent Activity</p>
        </div>
      )}
    </div>
  );
}
