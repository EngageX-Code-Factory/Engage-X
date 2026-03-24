import { Users } from 'lucide-react';

interface MyScheduleProps {
  recentClubs?: any[];
}

export default function MySchedule({ recentClubs = [] }: MyScheduleProps) {
  return (
    <section className="space-y-6">
      {recentClubs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-emerald-500 rounded-full inline-block" />
            Recent Club Joins
          </h2>
          <div className="space-y-3">
            {recentClubs.map((club) => (
              <div
                key={club.id}
                className="flex items-center gap-5 bg-white/3 border border-white/10 rounded-2xl px-5 py-4 hover:border-emerald-500/20 transition-all border-l-4 border-l-emerald-500/30"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate tracking-tight">{club.title}</p>
                  <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest mt-0.5">
                    Newly Joined • {club.category}
                  </p>
                </div>
                <span className="shrink-0 bg-emerald-500/15 text-emerald-400 text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full">
                  JOINED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
