import { Clock } from 'lucide-react';
import Link from 'next/link';

const events = [
  {
    id: 1,
    date: '15',
    month: 'MAR',
    title: 'Hackathon 2026',
    category: 'TECHNOLOGY',
    time: '9:00 AM – 6:00 PM',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=240&fit=crop',
  },
  {
    id: 2,
    date: '20',
    month: 'MAR',
    title: 'Digital Art Workshop',
    category: 'ART & DESIGN',
    time: '2:00 PM – 4:00 PM',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=240&fit=crop',
  },
  {
    id: 3,
    date: '25',
    month: 'MAR',
    title: 'Music Fest',
    category: 'MUSIC',
    time: '6:00 PM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=240&fit=crop',
  },
];

const categoryColors: Record<string, string> = {
  TECHNOLOGY: 'bg-indigo-500/20 text-indigo-300',
  'ART & DESIGN': 'bg-purple-500/20 text-purple-300',
  MUSIC: 'bg-pink-500/20 text-pink-300',
};

export default function RecommendedEvents() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
          Recommended For You
        </h2>
        <Link
          href="/student/events"
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Date Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center leading-none">
                <span className="block text-white text-lg font-bold">{event.date}</span>
                <span className="block text-gray-300 text-[10px] font-medium tracking-widest mt-0.5">
                  {event.month}
                </span>
              </div>
            </div>

            <div className="p-4">
              {/* Category */}
              <span
                className={`text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full ${
                  categoryColors[event.category] ?? 'bg-gray-500/20 text-gray-300'
                }`}
              >
                {event.category}
              </span>

              <h3 className="mt-3 text-white font-semibold text-base">{event.title}</h3>

              <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>{event.time}</span>
              </div>

              {/* Register Button */}
              <button className="mt-4 w-full py-2.5 rounded-xl border border-purple-500 text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors">
                Register
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
