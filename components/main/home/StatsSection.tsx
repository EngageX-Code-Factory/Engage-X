'use client';

import { useEffect, useState } from 'react';
import { Users, Calendar, Trophy, Rocket } from 'lucide-react';

export default function StatsSection() {
  const [counters, setCounters] = useState({
    students: 0,
    clubs: 0,
    events: 0,
    awards: 0
  });

  useEffect(() => {
    const animateCounters = () => {
      const targets = { students: 5000, clubs: 120, events: 350, awards: 50 };
      const speed = 200;

      const updateCount = () => {
        setCounters(prev => {
          const newCounters = { ...prev };
          let allComplete = true;

          Object.keys(targets).forEach(key => {
            const target = targets[key as keyof typeof targets];
            const current = prev[key as keyof typeof prev];
            const inc = target / speed;

            if (current < target) {
              newCounters[key as keyof typeof newCounters] = Math.ceil(current + inc);
              allComplete = false;
            } else {
              newCounters[key as keyof typeof newCounters] = target;
            }
          });

          if (!allComplete) {
            setTimeout(updateCount, 20);
          }

          return newCounters;
        });
      };

      updateCount();
    };

    animateCounters();
  }, []);

  return (
    <section className="relative bg-[#0b0515] py-16 border-t border-white/10 overflow-hidden">
      {/* Creative Dynamic Background */}
      <div className="absolute inset-0 w-full h-full bg-[#0b0515] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0515]/80 to-[#0b0515]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-8 rounded-2xl bg-white/3 border border-white/10 hover:bg-white/8 hover:border-purple-500/50 transition-all transform hover:-translate-y-2">
            <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">{counters.students}+</div>
            <p className="text-gray-400 uppercase tracking-wider">Joined Students</p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white/3 border border-white/10 hover:bg-white/8 hover:border-purple-500/50 transition-all transform hover:-translate-y-2">
            <Rocket className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">{counters.clubs}+</div>
            <p className="text-gray-400 uppercase tracking-wider">Active Clubs</p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white/3 border border-white/10 hover:bg-white/8 hover:border-purple-500/50 transition-all transform hover:-translate-y-2">
            <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">{counters.events}+</div>
            <p className="text-gray-400 uppercase tracking-wider">Events Hosted</p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white/3 border border-white/10 hover:bg-white/8 hover:border-purple-500/50 transition-all transform hover:-translate-y-2">
            <Trophy className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">{counters.awards}+</div>
            <p className="text-gray-400 uppercase tracking-wider">Awards Won</p>
          </div>
        </div>
      </div>
    </section>
  );
}