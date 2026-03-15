"use client";
import { useState } from "react";
import { ArrowRight, IdCard, Disc3, User, Phone, Mail, MapPin, Lock, ShieldCheck, ChevronLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle actual registration submission here
    console.log("Registration complete");
  };

  const getStrengthScore = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getStrengthScore(password);
  
  const getStrengthInfo = (score: number) => {
    switch (score) {
      case 0: return { label: "", color: "bg-white/10", textColor: "text-white/10", width: "w-0" };
      case 1: return { label: "Weak", color: "bg-red-500", textColor: "text-red-500", width: "w-1/4" };
      case 2: return { label: "Fair", color: "bg-orange-500", textColor: "text-orange-500", width: "w-2/4" };
      case 3: return { label: "Good", color: "bg-yellow-400", textColor: "text-yellow-400", width: "w-3/4" };
      case 4: return { label: "Strong", color: "bg-green-500", textColor: "text-green-500", width: "w-full" };
      default: return { label: "", color: "bg-white/10", textColor: "text-white/10", width: "w-0" };
    }
  };

  const strengthInfo = getStrengthInfo(strengthScore);

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
        <div className="relative hidden flex-1 flex-col justify-center border-b border-white/10 p-8 lg:flex lg:border-b-0 lg:border-r lg:p-12">
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

          <h2 className="mb-6 text-center text-[2.5rem] font-extrabold tracking-tight leading-[1.1] text-white lg:text-left xl:text-[3.5rem]">
            Join The <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#f9a8d4] bg-clip-text text-transparent">
              Community.
            </span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-[90%] text-center text-[1.1rem] leading-[1.6] text-[#b3b3b3] lg:mx-0 lg:text-left">
            Unlock exclusive access to top-tier university clubs, VIP events, and student communities today.
          </p>

          <div className="flex justify-center gap-12 lg:justify-start">
            <div className="flex flex-col">
              <span className="text-[2rem] font-bold text-[#f5af19]">Step </span>
              <span className="text-[0.9rem] font-semibold uppercase tracking-[1px] text-[#b3b3b3]">{step} of 2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2rem] font-bold text-[#f5af19]">100%</span>
              <span className="text-[0.9rem] font-semibold uppercase tracking-[1px] text-[#b3b3b3]">Secure</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form Container */}
        <div className="flex w-full flex-col justify-center bg-black/20 p-6 sm:p-8 lg:w-[55%] lg:p-[2rem_3rem]">
          
          {step === 1 ? (
            /* --- STEP 1: Personal Details --- */
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="mb-6 text-center text-[1.75rem] font-semibold lg:text-left">Apply for Membership</h3>

              <form className="flex flex-col gap-4" onSubmit={handleNextStep}>
                {/* Name Container */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor="firstName" className="ml-1 text-[0.85rem] text-[#b3b3b3]">First Name</label>
                    <div className="group flex h-[48px] items-center gap-[12px] rounded-[10px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                      <User className="h-[1rem] w-[1rem] text-[#b3b3b3]" />
                      <input suppressHydrationWarning type="text" id="firstName" className="h-full w-full bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/30" placeholder="First Name" required />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor="lastName" className="ml-1 text-[0.85rem] text-[#b3b3b3]">Last Name</label>
                    <div className="group flex h-[48px] items-center gap-[12px] rounded-[10px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                      <User className="h-[1rem] w-[1rem] text-[#b3b3b3]" />
                      <input suppressHydrationWarning type="text" id="lastName" className="h-full w-full bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/30" placeholder="Last Name" required />
                    </div>
                  </div>
                </div>

                {/* Student ID */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="studentId" className="ml-1 text-[0.85rem] text-[#b3b3b3]">Student ID</label>
                  <div className="group flex h-[48px] items-center gap-[12px] rounded-[10px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                    <IdCard className="h-[1rem] w-[1rem] text-[#b3b3b3]" />
                    <input suppressHydrationWarning type="text" id="studentId" className="h-full w-full bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/30" placeholder="Type your ID" required />
                  </div>
                </div>
                
                {/* Mobile & Email Container */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor="mobile" className="ml-1 text-[0.85rem] text-[#b3b3b3]">Mobile Number</label>
                    <div className="group flex h-[48px] items-center gap-[12px] rounded-[10px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                      <Phone className="h-[1rem] w-[1rem] text-[#b3b3b3]" />
                      <input suppressHydrationWarning type="tel" id="mobile" className="h-full w-full bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/30" placeholder="Phone Number" required />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor="email" className="ml-1 text-[0.85rem] text-[#b3b3b3]">Email Address</label>
                    <div className="group flex h-[48px] items-center gap-[12px] rounded-[10px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                      <Mail className="h-[1rem] w-[1rem] text-[#b3b3b3]" />
                      <input suppressHydrationWarning type="email" id="email" className="h-full w-full bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/30" placeholder="Email Address" required />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="ml-1 text-[0.85rem] text-[#b3b3b3]">Address</label>
                  <div className="group flex h-[48px] items-center gap-[12px] rounded-[10px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                    <MapPin className="h-[1rem] w-[1rem] text-[#b3b3b3]" />
                    <input suppressHydrationWarning type="text" id="address" className="h-full w-full bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/30" placeholder="Your Address" required />
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="mb-2 mt-2 flex items-center justify-between text-[0.85rem] text-[#b3b3b3]">
                  <label className="flex cursor-pointer items-start gap-2 group">
                    <div className="relative mt-[2px] flex items-center">
                      <input suppressHydrationWarning type="checkbox" className="peer sr-only" required />
                      <div className="flex h-[18px] w-[18px] items-center justify-center rounded border border-white/20 bg-transparent transition-colors duration-300 peer-checked:border-[#8E2DE2] peer-checked:bg-[#8E2DE2] group-hover:border-white/50">
                        <svg className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                        </svg>
                      </div>
                    </div>
                    <span>
                      I agree to the <a href="#" className="text-white hover:text-[#f5af19] transition-colors underline">terms and conditions</a>
                    </span>
                  </label>
                </div>

                {/* Next Step Button */}
                <button
                  type="submit"
                  className="group relative flex h-[50px] w-full items-center justify-center gap-[10px] overflow-hidden rounded-[10px] bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-[1.05rem] font-semibold text-white shadow-[0_5px_20px_rgba(74,0,224,0.4)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(74,0,224,0.6)]"
                >
                  <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%]" />
                  <span>Next Step</span>
                  <ArrowRight className="h-[1.1rem] w-[1.1rem]" />
                </button>

                {/* Footer Login */}
                <div className="mt-1 text-center text-[0.85rem] text-[#b3b3b3]">
                  Already a member? 
                  <Link href="/auth/login" className="ml-1 font-semibold text-white transition-colors hover:text-[#f5af19] hover:underline">
                    Login here
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            /* --- STEP 2: Password Setup --- */
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-center">
              <h3 className="mb-2 text-center text-[1.75rem] font-semibold lg:text-left">Secure Your Account</h3>
              <p className="mb-8 text-center text-[0.9rem] text-[#b3b3b3] lg:text-left">Create a strong password to protect your EngageX access.</p>

              <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                
                {/* Password Input */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="ml-1 text-[0.85rem] text-[#b3b3b3]">Create Password</label>
                  <div className="group flex h-[48px] items-center gap-[12px] rounded-[10px] border border-white/10 bg-[rgba(0,0,0,0.3)] px-[1rem] transition-all duration-300 focus-within:border-[#8E2DE2] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)]">
                    <Lock className="h-[1rem] w-[1rem] text-[#b3b3b3]" />
                    <input 
                      suppressHydrationWarning 
                      type={showPassword ? "text" : "password"} 
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-full flex-1 bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/30" 
                      placeholder="Minimum 8 characters" 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-[1rem] w-[1rem] text-[#b3b3b3] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-full w-full" /> : <Eye className="h-full w-full" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="flex flex-col gap-2">
                  <div className="flex h-[6px] w-full overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full transition-all duration-500 ease-out ${strengthInfo.width} ${strengthInfo.color}`} />
                  </div>
                  <div className="flex items-center justify-between text-[0.8rem]">
                    <span className="text-[#8b88a1]">
                      {password.length === 0 ? "Enter a password" : "Password strength:"}
                    </span>
                    <span className={`font-medium ${strengthInfo.textColor}`}>{strengthInfo.label}</span>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label htmlFor="confirmPassword" className="ml-1 text-[0.85rem] text-[#b3b3b3]">Confirm Password</label>
                  <div className={`group flex h-[48px] items-center gap-[12px] rounded-[10px] border px-[1rem] transition-all duration-300 bg-[rgba(0,0,0,0.3)] focus-within:bg-[rgba(0,0,0,0.5)] focus-within:border-[#8E2DE2] focus-within:shadow-[0_0_15px_rgba(142,45,226,0.3)] ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}>
                    <ShieldCheck className="h-[1rem] w-[1rem] text-[#b3b3b3]" />
                    <input 
                      suppressHydrationWarning 
                      type={showConfirmPassword ? "text" : "password"} 
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-full flex-1 bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/30" 
                      placeholder="Re-type your password" 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="h-[1rem] w-[1rem] text-[#b3b3b3] hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-full w-full" /> : <Eye className="h-full w-full" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <span className="ml-1 text-[0.8rem] text-red-500 mt-1">Passwords do not match.</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex h-[50px] w-[110px] items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-white/5 text-[0.95rem] font-medium text-white transition-all hover:bg-white/10 hover:border-white/20"
                  >
                    <ChevronLeft className="h-[1.1rem] w-[1.1rem]" /> Back
                  </button>
                  <button
                    type="submit"
                    className="group relative flex h-[50px] flex-1 items-center justify-center gap-[10px] overflow-hidden rounded-[10px] bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-[1.05rem] font-semibold text-white shadow-[0_5px_20px_rgba(74,0,224,0.4)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(74,0,224,0.6)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_5px_20px_rgba(74,0,224,0.4)]"
                    disabled={!password || password !== confirmPassword}
                  >
                    <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%]" />
                    <span>Complete</span>
                    <CheckCircle2 className="h-[1.1rem] w-[1.1rem]" />
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
