"use client";
import { useState } from "react";
import { ArrowRight, Fingerprint, IdCard, Disc3, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0f0c29] p-4 lg:p-8 font-sans text-white overflow-hidden">
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
            <img src="/logo.png" alt="Logo" className=" h-20 w-20" />
            <span className="text-[1.5rem] font-bold">EngageX</span>
          </div>

          <h2 className="mb-6 text-center text-[2.5rem] font-family: 'Inter', sans-serif; font-extrabold tracking-tight leading-[1.1] text-white lg:text-left lg:text-[4rem]">
            Level Up Your <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#f9a8d4] bg-clip-text text-transparent">
              Campus Life.
            </span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-[90%] text-center text-[1.1rem] leading-[1.6] text-[#b3b3b3] lg:mx-0 lg:text-left">
            Exclusive access to top-tier university clubs, VIP events, and student communities.
          </p>

          <div className="flex justify-center gap-12 lg:justify-start">
            <div className="flex flex-col">
              <span className="text-[2rem] font-bold text-[#f5af19]">50+</span>
              <span className="text-[0.9rem] font-semibold uppercase tracking-[1px] text-[#b3b3b3]">Active Clubs</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2rem] font-bold text-[#f5af19]">100+</span>
              <span className="text-[0.9rem] font-semibold uppercase tracking-[1px] text-[#b3b3b3]">Events</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex w-full flex-col justify-center bg-black/20 p-8 lg:w-[45%] lg:p-[3rem_4rem]">
          <h3 className="mb-8 text-center text-[2rem] font-semibold lg:text-left">Member Login</h3>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            {/* Student ID Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="studentId" className="ml-1 text-[0.9rem] text-[#b3b3b3]">
                Student ID
              </label>
              <div className="group flex h-[55px] items-center gap-[15px] rounded-[12px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1.2rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                <IdCard className="h-[1.1rem] w-[1.1rem] text-[#b3b3b3]" />
                <input
                  suppressHydrationWarning
                  type="text"
                  id="studentId"
                  className="h-full w-full bg-transparent text-[1rem] text-white outline-none placeholder:text-white/30"
                  placeholder="Type your ID"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="ml-1 text-[0.9rem] text-[#b3b3b3]">
                Password
              </label>
              <div className="group flex h-[55px] items-center gap-[15px] rounded-[12px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1.2rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                <Fingerprint className="h-[1.1rem] w-[1.1rem] text-[#b3b3b3]" />
                <input
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="h-full flex-1 bg-transparent text-[1rem] text-white outline-none placeholder:text-white/30"
                  placeholder="Keycode"
                  required
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

            {/* Remember me & Forgot Pass */}
            <div className="mb-4 mt-2 flex items-center justify-between text-[0.9rem] text-[#b3b3b3]">
              <label className="flex cursor-pointer items-center gap-2">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                  />
                  <div className="flex h-[18px] w-[18px] items-center justify-center rounded bg-white/10 transition-colors duration-300 peer-checked:bg-[#8E2DE2]">
                    <svg className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                      <path d="M3 8L6 11L11 3.5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                    </svg>
                  </div>
                </div>
                Remember me
              </label>
              <a href="#" className="font-medium text-white transition-colors duration-300 hover:text-[#f5af19]">
                Lost access?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative flex h-[55px] w-full items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-[1.1rem] font-semibold text-white shadow-[0_5px_20px_rgba(74,0,224,0.4)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_25px_rgba(74,0,224,0.6)]"
            >
              <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%]" />
              <span>Enter Portal</span>
              <ArrowRight className="h-[1.1rem] w-[1.1rem]" />
            </button>

            {/* Footer Register */}
            <div className="mt-2 text-center text-[0.9rem] text-[#b3b3b3]">
              New look? 
              <Link href="/auth/register" className="ml-1 font-semibold text-white transition-colors hover:text-[#f5af19] hover:underline">
                Apply for Membership
              </Link>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
