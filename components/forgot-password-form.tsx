"use client";

import { useState, useEffect } from "react";
import { ArrowRight, IdCard, MailCheck } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
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

          <h2 className="mb-6 text-center text-[2.5rem] font-extrabold tracking-tight leading-[1.1] text-white lg:text-left lg:text-[4rem]">
            Recover Your <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#f9a8d4] bg-clip-text text-transparent">
              Access.
            </span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-[90%] text-center text-[1.1rem] leading-[1.6] text-[#b3b3b3] lg:mx-0 lg:text-left">
            Don't worry, even legends forget their passwords sometimes. Let's get you back in.
          </p>

          <div className="flex justify-center gap-12 lg:justify-start">
            <div className="flex flex-col">
              <span className="text-[2rem] font-bold text-[#f5af19]">99%</span>
              <span className="text-[0.9rem] font-semibold uppercase tracking-[1px] text-[#b3b3b3]">Recovery Rate</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2rem] font-bold text-[#f5af19]">Fast</span>
              <span className="text-[0.9rem] font-semibold uppercase tracking-[1px] text-[#b3b3b3]">Response</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex w-full flex-col justify-center bg-black/20 p-8 lg:w-[45%] lg:p-[3rem_4rem]">
          {success ? (
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <MailCheck className="h-10 w-10" />
              </div>
              <h3 className="mb-4 text-[2rem] font-semibold">Check Your Inbox</h3>
              <p className="mb-8 text-[#b3b3b3] leading-relaxed">
                If an account exists for <span className="text-white font-medium">{email}</span>, you'll receive a password reset link shortly.
              </p>
              <Link
                href="/auth/login"
                className="group flex items-center gap-2 text-white font-semibold transition-colors hover:text-[#f5af19]"
              >
                <span>Back to Member Login</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <>
              <h3 className="mb-2 text-center text-[2rem] font-semibold lg:text-left">Reset Password</h3>
              <p className="mb-8 text-center text-[0.9rem] text-[#b3b3b3] lg:text-left">
                Enter your email address to receive a secure recovery link.
              </p>

              <form className="flex flex-col gap-6" onSubmit={handleForgotPassword}>
                {/* Error Display */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="ml-1 text-[0.9rem] text-[#b3b3b3]">
                    Recovery Email
                  </label>
                  <div className="group flex h-[55px] items-center gap-[15px] rounded-[12px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1.2rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                    <IdCard className="h-[1.1rem] w-[1.1rem] text-[#b3b3b3]" />
                    <input
                      suppressHydrationWarning
                      type="email"
                      id="email"
                      className="h-full w-full bg-transparent text-[1rem] text-white outline-none placeholder:text-white/30"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  <span>{isLoading ? "Sending Link..." : "Send Recovery Link"}</span>
                  {!isLoading && <ArrowRight className="h-[1.1rem] w-[1.1rem]" />}
                </button>

                {/* Footer Link */}
                <div className="mt-2 text-center text-[0.9rem] text-[#b3b3b3]">
                  Remembered it? 
                  <Link href="/auth/login" className="ml-1 font-semibold text-white transition-colors hover:text-[#f5af19] hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}
