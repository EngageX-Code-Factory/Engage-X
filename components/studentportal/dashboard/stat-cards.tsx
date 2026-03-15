'use client';

import { useState } from 'react';
import { 
  Calendar, Users, Star, Award, 
  X, CheckCircle2, ChevronRight, Zap, Target
} from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  goldBorder?: boolean;
  onClick?: () => void;
  isClickable?: boolean;
}

function StatCard({ icon, value, label, goldBorder, onClick, isClickable }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-5 rounded-2xl bg-white/3 transition-all ${
        isClickable ? 'cursor-pointer hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-95' : ''
      } ${
        goldBorder ? 'border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border border-white/10'
      }`}
    >
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
        <p className="text-sm text-gray-400 mt-0.5">{label}</p>
      </div>
      {isClickable && (
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </div>
  );
}

// ── Membership Tiers Modal ──────────────────────────────────────────────────

interface Tier {
  id: string;
  name: string;
  minPoints: number;
  color: string;
  border: string;
  bg: string;
  icon: React.ReactNode;
}

const tiers: Tier[] = [
  { id: 'bronze', name: 'Bronze', minPoints: 0, color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10', icon: <Award className="w-6 h-6 text-orange-400" /> },
  { id: 'silver', name: 'Silver', minPoints: 200, color: 'text-slate-300', border: 'border-slate-400/20', bg: 'bg-slate-400/10', icon: <Award className="w-6 h-6 text-slate-300" /> },
  { id: 'gold', name: 'Gold', minPoints: 500, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10', icon: <Award className="w-6 h-6 text-amber-400" /> },
  { id: 'platinum', name: 'Platinum', minPoints: 1000, color: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/10', icon: <Award className="w-6 h-6 text-indigo-400" /> },
];

export default function StatCards() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentPoints = 450;
  const currentTier = tiers.find((t, i) => currentPoints >= t.minPoints && (!tiers[i+1] || currentPoints < tiers[i+1].minPoints)) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
          }
          value={12}
          label="Events Attended"
        />
        <StatCard
          icon={
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          }
          value={3}
          label="Clubs Joined"
        />
        <StatCard
          icon={
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-pink-400" />
            </div>
          }
          value={currentPoints}
          label="Engagement Points"
        />
        <StatCard
          onClick={() => setIsModalOpen(true)}
          isClickable
          icon={
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          }
          value={currentTier.name}
          label="Member Status"
          goldBorder={currentTier.id === 'gold' || currentTier.id === 'platinum'}
        />
      </div>

      {/* Membership Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] grid place-items-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f0c29]/95 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-600/10" />
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold tracking-widest uppercase">
                    Member Rewards
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Membership Tiers</h2>
                <p className="text-gray-400 text-sm">Earn engagement points to unlock exclusive club benefits and premium access.</p>
              </div>

              {/* Current Status Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Zap className="w-16 h-16 text-purple-400" />
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Current Balance</p>
                  <p className="text-4xl font-black text-white">{currentPoints} <span className="text-lg font-normal text-purple-400 opacity-70 italic">Credits</span></p>
                </div>
                
                <div className={`p-6 rounded-3xl border ${currentTier.border} ${currentTier.bg} backdrop-blur-md relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                    {currentTier.icon}
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Current Tier</p>
                  <p className={`text-4xl font-black ${currentTier.color}`}>{currentTier.name}</p>
                </div>
              </div>

              {/* Tier Progress / Next Milestone */}
              {nextTier && (
                <div className="p-6 rounded-3xl border border-white/5 bg-black/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Next Milestone: {nextTier.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{nextTier.minPoints - currentPoints} points remaining</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-amber-500 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, (currentPoints / nextTier.minPoints) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* All Tiers List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Tier Hierarchy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tiers.map((tier) => {
                    const isOwn = currentPoints >= tier.minPoints && (!tiers[tiers.indexOf(tier)+1] || currentPoints < tiers[tiers.indexOf(tier)+1].minPoints);
                    const isUnlocked = currentPoints >= tier.minPoints;
                    
                    return (
                      <div 
                        key={tier.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          isOwn ? `${tier.border} ${tier.bg} scale-[1.02] shadow-xl` : isUnlocked ? 'border-white/10 bg-white/5' : 'border-white/5 bg-transparent opacity-40'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnlocked ? tier.bg : 'bg-white/5'}`}>
                          {tier.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isUnlocked ? tier.color : 'text-gray-500'}`}>{tier.name}</span>
                            {isOwn && <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/10 text-white uppercase font-black">Owned</span>}
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{tier.minPoints}+ Credits</p>
                        </div>
                        {isUnlocked && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
