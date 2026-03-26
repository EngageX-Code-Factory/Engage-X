"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Fingerprint, Building2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function OrgLoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/organization");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("relative flex min-h-screen items-center justify-center bg-[#0f0c29] p-4 font-sans text-white overflow-hidden", className)} {...props}>
      <div className="absolute inset-0 z-0 blur-[80px] pointer-events-none">
        <div className="absolute -left-[100px] -top-[100px] h-[600px] w-[600px] rounded-full bg-[#4A00E0] opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-[150px] -right-[100px] h-[500px] w-[500px] rounded-full bg-[#8E2DE2] opacity-60 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex w-full max-w-[1000px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-[20px] lg:flex-row">
        <div className="relative flex-1 p-8 lg:p-12 border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="mb-12 flex items-center gap-[15px]">
            <span className="text-[1.5rem] font-bold">Engage</span><span className="text-[1.8rem] -ml-4 font-bold text-[#f5af19]">X</span>
          </div>
          <h2 className="mb-6 text-[2.5rem] font-extrabold leading-tight text-white lg:text-[4rem]">
            Manage Your <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#f9a8d4] bg-clip-text text-transparent">Organization.</span>
          </h2>
          <p className="text-[#b3b3b3] text-lg max-w-[90%]">Create events and engage with students from your centralized dashboard.</p>
        </div>

        <div className="flex w-full flex-col justify-center bg-black/20 p-8 lg:w-[45%]">
          <h3 className="mb-8 text-[2rem] font-semibold">Org Login</h3>
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
            
            <div className="space-y-1.5">
              <label className="text-[0.9rem] text-[#b3b3b3]">Organization Email</label>
              <div className="flex h-[55px] items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 focus-within:border-[#8E2DE2]">
                <Building2 className="text-[#b3b3b3] w-5 h-5" />
                <input type="email" className="w-full bg-transparent outline-none" placeholder="club@university.edu" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.9rem] text-[#b3b3b3]">Password</label>
              <div className="flex h-[55px] items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 focus-within:border-[#8E2DE2]">
                <Fingerprint className="text-[#b3b3b3] w-5 h-5" />
                <input type={showPassword ? "text" : "password"} className="flex-1 bg-transparent outline-none" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="h-[55px] w-full rounded-xl bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] font-bold text-white shadow-lg hover:-translate-y-1 transition-all">
              {isLoading ? "Authenticating..." : "Access Dashboard"}
            </button>

            <div className="text-center text-[#b3b3b3] text-sm mt-4">
              Registering a new club? <Link href="/auth/org/sign-up" className="text-white font-bold hover:text-[#f5af19] underline ml-1">Apply Here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}