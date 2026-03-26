"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Shield, Eye, EyeOff, Lock, Mail, User,
  AlertTriangle, Loader2, ChevronRight, UserPlus, ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      // 1. Create the Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert/Update the profile in your 'profiles' table
        // Note: Supabase triggers might handle this, but we explicitly 
        // set the role to 'admin' here for your new system.
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ 
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: "admin", // Standardizing for your admin registration
            status: "active"
          })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;

        // Success -> Redirect to Login or Dashboard
        router.push("/admin/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Verify your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Blobs (matching login) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="w-full max-w-lg relative z-10">
        {/* Back Link */}
        <Link href="/admin/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors mb-8 font-bold text-xs uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
        </Link>

        <div className="bg-[#0d1320] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
              <UserPlus size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white italic uppercase tracking-tight">Register Admin</h1>
              <p className="text-slate-500 text-xs font-mono">SYSTEM_INIT // SECURE_ENTRY</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start gap-3 text-sm">
                <AlertTriangle size={18} className="shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input 
                    required
                    className="w-full pl-11 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-white font-bold placeholder:text-slate-700"
                    placeholder="John"
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">Last Name</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-white font-bold placeholder:text-slate-700"
                  placeholder="Doe"
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">System Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="email" required
                  className="w-full pl-11 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-white font-bold placeholder:text-slate-700"
                  placeholder="admin@engagex.lk"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">Security Cipher</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type={showPassword ? "text" : "password"} required
                  className="w-full pl-11 pr-12 py-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-white font-bold placeholder:text-slate-700"
                  placeholder="Min. 8 Characters"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl mt-4 shadow-xl shadow-blue-900/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Deploy Identity <ChevronRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-8 pt-6 border-t border-white/5 text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest">
            Identity verification required via encrypted link
          </p>
        </div>
      </div>
    </div>
  );
}