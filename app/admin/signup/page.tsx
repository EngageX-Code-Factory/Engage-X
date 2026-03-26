"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, Mail, Lock, User, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (authError) throw authError;

      if (data.user) {
        // Success: Trigger will handle the profile creation with 'admin' role
        router.push("/admin/login?message=Account created. Please sign in.");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020508] flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-lg bg-[#080f1c]/80 border border-white/10 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl">
        
        <Link href="/admin/login" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Terminal
        </Link>

        <div className="mb-10 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/40">
             <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold italic">Initialize Admin Account</h1>
          <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">Access Tier: Level 1 Admin</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500 tracking-widest ml-1">First Name</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border border-white/5 rounded-xl focus-within:border-blue-500/50 transition-all">
                <User size={16} className="text-slate-600" />
                <input 
                  type="text" required 
                  className="bg-transparent border-none outline-none w-full text-sm"
                  placeholder="John"
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500 tracking-widest ml-1">Last Name</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border border-white/5 rounded-xl focus-within:border-blue-500/50 transition-all">
                <input 
                  type="text" required 
                  className="bg-transparent border-none outline-none w-full text-sm"
                  placeholder="Doe"
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500 tracking-widest ml-1">Admin Email</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border border-white/5 rounded-xl focus-within:border-blue-500/50 transition-all">
              <Mail size={16} className="text-slate-600" />
              <input 
                type="email" required 
                className="bg-transparent border-none outline-none w-full text-sm"
                placeholder="admin@engagex.lk"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500 tracking-widest ml-1">Secure Password</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border border-white/5 rounded-xl focus-within:border-blue-500/50 transition-all">
              <Lock size={16} className="text-slate-600" />
              <input 
                type="password" required 
                className="bg-transparent border-none outline-none w-full text-sm"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500 tracking-widest ml-1">Confirm Identity</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border border-white/5 rounded-xl focus-within:border-blue-500/50 transition-all">
              <Lock size={16} className="text-slate-600" />
              <input 
                type="password" required 
                className="bg-transparent border-none outline-none w-full text-sm"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <><Shield size={18} /> Deploy Account</>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs">
          By deploying, you agree to system monitoring and the Admin Code of Conduct.
        </p>
      </div>
    </div>
  );
}