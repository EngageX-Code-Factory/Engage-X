const activities = [
  {
    id: 1,
    color: 'bg-purple-500',
    text: 'You joined Coding Club',
    time: '2h ago',
  },
  {
    id: 2,
    color: 'bg-indigo-500',
    text: 'New event added: Tech Talk',
    time: '5h ago',
  },
  {
    id: 3,
    color: 'bg-emerald-500',
    text: 'Your RSVP was confirmed for Music Fest',
    time: '1d ago',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-start gap-3">
            {/* Timeline line */}
            {index < activities.length - 1 && (
              <div className="absolute left-[7px] top-4 w-px h-full bg-white/10" />
            )}
            {/* Dot */}
            <span className={`mt-1 w-3.5 h-3.5 rounded-full shrink-0 border-2 border-[#16181f] ${activity.color}`} />
            <div>
              <p className="text-sm text-gray-200 leading-snug">{activity.text}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
