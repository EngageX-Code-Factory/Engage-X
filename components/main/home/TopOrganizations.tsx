import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function TopOrganizations() {
  return (
    <section className="relative py-32 bg-[#0b0515] overflow-hidden">
      {/* Creative Dynamic Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-1/4 -left-1/4 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000 delay-1000"></div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0515]/80 to-[#0b0515]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] -z-10"></div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Top <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-gradient-x">Organizations</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover the most active and highly rated student communities leading the way in innovation and engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16 items-center">
          {/* Rank 2 */}
          <div className="group relative bg-[#130a21]/50 backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-6 transition-all duration-500 hover:-translate-y-4 hover:border-gray-400/50 hover:shadow-[0_0_40px_rgba(156,163,175,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl mb-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80"
                alt="Harmony Society"
                width={600}
                height={400}
                className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-gray-300 mb-2">
                  Music & Arts
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-20">
              <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-gray-300 transition-colors">Harmony Society</h3>

              <div className="flex justify-between mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">850+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Members</div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">4.8</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Rating</div>
                </div>
              </div>

              <button className="w-full relative flex items-center justify-center gap-2 group/btn overflow-hidden rounded-xl border border-gray-500/30 bg-gray-500/10 py-3.5 font-semibold text-gray-200 transition-all hover:bg-gray-500/20 hover:border-gray-500/50 hover:text-white">
                <span className="relative z-10 hidden md:block">View Club</span>
                <span className="relative z-10 md:hidden">View Club</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>

            {/* Rank Badge */}
            <div className="absolute -top-2 -left-2 w-14 h-14 bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_10px_20px_rgba(156,163,175,0.4)] border border-gray-300/30 z-30 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
              2
              <div className="absolute inset-0 rounded-2xl bg-white/20 filter blur-sm"></div>
            </div>
          </div>

          {/* Rank 1 (Center, Larger) */}
          <div className="group relative bg-[#130a21]/50 backdrop-blur-2xl border border-yellow-500/30 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-6 hover:border-yellow-500/60 hover:shadow-[0_0_60px_rgba(234,179,8,0.2)] overflow-hidden scale-100 md:scale-110 z-20">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Glow behind Rank 1 */}
            <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full"></div>

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl mb-8 shadow-2xl border border-yellow-500/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
                alt="Innovators Hub"
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 text-xs font-bold text-yellow-300 mb-2">
                  Technology
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-20">
              <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-yellow-300 transition-colors">Innovators Hub</h3>

              <div className="flex justify-between mb-8 p-5 rounded-2xl bg-white/[0.03] border border-yellow-500/20 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500">1.2k+</div>
                  <div className="text-xs text-yellow-500/80 uppercase tracking-widest mt-1">Members</div>
                </div>
                <div className="w-px bg-yellow-500/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500">4.8</div>
                  <div className="text-xs text-yellow-500/80 uppercase tracking-widest mt-1">Rating</div>
                </div>
              </div>

              <button className="w-full relative flex items-center justify-center gap-2 group/btn overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 p-[2px] transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                <div className="w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-md rounded-[10px] py-4 px-6 text-white font-bold group-hover/btn:bg-transparent transition-colors">
                  <span className="relative z-10">Join Now</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform relative z-10" />
                </div>
              </button>
            </div>

            {/* Rank Badge */}
            <div className="absolute -top-2 -right-2  w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-[0_15px_30px_rgba(234,179,8,0.4)] border border-yellow-200/50 z-30 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <div className="text-white font-black text-4xl drop-shadow-md">1</div>
              <div className="absolute inset-0 rounded-3xl bg-white/20 filter blur-sm"></div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="group relative bg-[#130a21]/50 backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-6 transition-all duration-500 hover:-translate-y-4 hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl mb-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
                alt="Future Leaders"
                width={600}
                height={400}
                className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-orange-300 mb-2">
                  Business
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-20">
              <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-orange-300 transition-colors">Future Leaders</h3>

              <div className="flex justify-between mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-500">620+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Members</div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-500">4.2</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Rating</div>
                </div>
              </div>

              <button className="w-full relative flex items-center justify-center gap-2 group/btn overflow-hidden rounded-xl border border-orange-500/30 bg-orange-500/10 py-3.5 font-semibold text-orange-200 transition-all hover:bg-orange-500/20 hover:border-orange-500/50 hover:text-white">
                <span className="relative z-10 hidden md:block">View Club</span>
                <span className="relative z-10 md:hidden">View Club</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>

            {/* Rank Badge */}
            <div className="absolute -top-2 -right-2 w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_10px_20px_rgba(249,115,22,0.4)] border border-orange-300/30 z-30 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
              3
              <div className="absolute inset-0 rounded-2xl bg-white/20 filter blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}