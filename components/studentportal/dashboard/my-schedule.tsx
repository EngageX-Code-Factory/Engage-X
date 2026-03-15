const schedule = [
  {
    id: 1,
    time: '10:00 AM',
    timeContext: 'TODAY',
    title: 'Robotics Club Meeting',
    location: 'Room 304, Engineering Building',
    status: 'JOINED',
  },
  {
    id: 2,
    time: '02:00 PM',
    timeContext: 'TOMORROW',
    title: 'Career Fair Mixer',
    location: 'Main Hall',
    status: 'JOINED',
  },
];

export default function MySchedule() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
        My Schedule
      </h2>

      <div className="space-y-3">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-5 bg-white/3 border border-white/10 rounded-2xl px-5 py-4 hover:border-purple-500/20 transition-all"
          >
            {/* Time */}
            <div className="w-20 shrink-0">
              <p className="text-white font-bold text-sm">{item.time}</p>
              <p className="text-gray-500 text-[11px] font-medium tracking-wider mt-0.5">
                {item.timeContext}
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-white/10 shrink-0" />

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{item.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{item.location}</p>
            </div>

            {/* Status */}
            <span className="shrink-0 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
