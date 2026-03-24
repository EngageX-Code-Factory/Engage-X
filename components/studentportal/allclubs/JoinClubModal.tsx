'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, Send, CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface JoinClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  clubName: string;
  category: string;
}

export default function JoinClubModal({ isOpen, onClose, clubId, clubName, category }: JoinClubModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: 'Loading...',
    studentId: 'Loading...',
    interests: '',
    motivation: '',
    experience: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/student/profile');
          if (res.ok) {
            const data = await res.json();
            setFormData(prev => ({
              ...prev,
              name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
              studentId: data.student_id || ''
            }));
          }
        } catch (err) {
          console.error('Failed to fetch profile', err);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/student/my-clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          club_id: clubId,
          full_name: formData.name,
          student_id: formData.studentId,
          interests: formData.interests,
          reason_to_join: formData.motivation
        })
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to submit application');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0f0c29]/95 border border-white/10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
        
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 italic tracking-tight">Application <span className="text-emerald-400">Sent!</span></h2>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-sm mx-auto text-sm">
              Your application to join **{clubName}** has been received. The club leads will review your info and get back to you soon.
            </p>
            <button 
              onClick={handleClose}
              className="px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              Great, thanks!
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar info */}
            <div className="lg:w-1/3 bg-white/3 p-8 border-r border-white/5 hidden lg:block">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/20 mb-6">
                <UserPlus className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-black text-white italic mb-2 leading-tight">Join the <br/> <span className="text-purple-400">Community</span></h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-8">
                Tell us a bit about yourself so we can find the best spot for you in the club.
              </p>
              
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Club</p>
                  <p className="text-white text-xs font-bold leading-tight">{clubName}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Category</p>
                  <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest">{category}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:w-2/3 p-8 lg:p-10">
              <div className="mb-8 lg:hidden">
                <h2 className="text-xl font-black text-white italic">Join <span className="text-purple-400">{clubName}</span></h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      readOnly
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-400 text-sm outline-none cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Student ID</label>
                    <input 
                      type="text" 
                      value={formData.studentId}
                      readOnly
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-400 text-sm outline-none cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Interests</label>
                  <input 
                    type="text" 
                    value={formData.interests}
                    onChange={(e) => setFormData({...formData, interests: e.target.value})}
                    required
                    placeholder="e.g. AI, Music, Web Design"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500/40 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Why do you want to join?</label>
                  <textarea 
                    rows={3}
                    value={formData.motivation}
                    onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                    required
                    placeholder="Briefly explain your interest in this club..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500/40 outline-none transition-all resize-none" 
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-200/70 leading-relaxed italic">
                    By submitting, you agree to follow the club's guidelines and actively participate in activities.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-purple-600 text-white font-black text-base shadow-lg shadow-purple-900/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                  {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
