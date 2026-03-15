"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Fingerprint, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/student");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className={cn("relative flex min-h-screen items-center justify-center bg-[#0f0c29] p-4 lg:p-8 font-sans text-white overflow-hidden", className)} {...props}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none blur-[80px]">
        <div className="absolute -left-[100px] -top-[100px] h-[600px] w-[600px] animate-pulse rounded-full bg-[#4A00E0] opacity-60" style={{ animationDuration: '20s' }}></div>
        <div className="absolute -bottom-[150px] -right-[100px] h-[500px] w-[500px] animate-pulse rounded-full bg-[#8E2DE2] opacity-60" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
        <div className="absolute bottom-[20%] left-[20%] h-[300px] w-[300px] animate-pulse rounded-full bg-[#f5af19] opacity-60" style={{ animationDuration: '25s' }}></div>
        <div className="absolute right-[30%] top-[15%] h-[200px] w-[200px] animate-pulse rounded-full bg-[#f12711] opacity-60" style={{ animationDuration: '15s' }}></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 flex w-full max-w-[1000px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-[20px] lg:min-h-[600px] lg:flex-row">
        
        {/* Left Side: Visual / Branding */}
        <div className="relative flex flex-1 flex-col justify-center border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-12">
          {/* Decorative grid pattern background */}
          <div 
            className="absolute inset-0 -z-10 opacity-30 lg:opacity-50" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />
          
          <div className="mb-12 flex items-center justify-center gap-[15px] tracking-[1px] lg:justify-start">
            <span className="text-[1.5rem] font-bold">Engage</span><span className="text-[1.8rem] -ml-4 font-bold text-[#f5af19]">X</span>
          </div>

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 hidden lg:flex">
             <ShieldCheck className="h-8 w-8 text-[#f5af19]" />
          </div>

          <h2 className="mb-6 text-center text-[2.5rem] font-extrabold tracking-tight leading-[1.1] text-white lg:text-left lg:text-[4rem]">
            Secure Your <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#f9a8d4] bg-clip-text text-transparent">
              Credentials.
            </span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-[90%] text-center text-[1.1rem] leading-[1.6] text-[#b3b3b3] lg:mx-0 lg:text-left">
            Choose a strong, unique password to keep your campus life secure and protected.
          </p>

          <div className="hidden lg:flex flex-col gap-4">
             <div className="flex items-center gap-3 text-[#b3b3b3]">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                <span className="text-sm">Minimum 8 characters</span>
             </div>
             <div className="flex items-center gap-3 text-[#b3b3b3]">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                <span className="text-sm">Includes special characters</span>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex w-full flex-col justify-center bg-black/20 p-8 lg:w-[45%] lg:p-[3rem_4rem]">
          <h3 className="mb-2 text-center text-[2rem] font-semibold lg:text-left">New Password</h3>
          <p className="mb-8 text-center text-[0.9rem] text-[#b3b3b3] lg:text-left">
            Establish your new secure access credentials.
          </p>

          <form className="flex flex-col gap-6" onSubmit={handleUpdatePassword}>
            {/* Error Display */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* New Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="ml-1 text-[0.9rem] text-[#b3b3b3]">
                New Password
              </label>
              <div className="group flex h-[55px] items-center gap-[15px] rounded-[12px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1.2rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                <Fingerprint className="h-[1.1rem] w-[1.1rem] text-[#b3b3b3]" />
                <input
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="h-full flex-1 bg-transparent text-[1rem] text-white outline-none placeholder:text-white/30"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-[1.1rem] w-[1.1rem] text-[#b3b3b3] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-full w-full" /> : <Eye className="h-full w-full" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="ml-1 text-[0.9rem] text-[#b3b3b3]">
                Confirm Password
              </label>
              <div className="group flex h-[55px] items-center gap-[15px] rounded-[12px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1.2rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                <Fingerprint className="h-[1.1rem] w-[1.1rem] text-[#b3b3b3]" />
                <input
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="h-full flex-1 bg-transparent text-[1rem] text-white outline-none placeholder:text-white/30"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-2 flex h-[55px] w-full items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-[1.1rem] font-semibold text-white shadow-[0_5px_20px_rgba(74,0,224,0.4)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_25px_rgba(74,0,224,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%]" />
              <span>{isLoading ? "Saving..." : "Save New Password"}</span>
              {!isLoading && <ArrowRight className="h-[1.1rem] w-[1.1rem]" />}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
