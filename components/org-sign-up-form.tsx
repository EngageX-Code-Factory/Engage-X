"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Building2, User, Phone, Mail, Tag, Lock, ShieldCheck, ChevronLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// Standardized categories to match the forecast system
const CATEGORIES = ["Academic", "Arts & Culture", "Sports", "Technology", "Business", "Community Service", "Religious", "Other"];

export function OrgSignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [step, setStep] = useState(1);
  const [clubName, setClubName] = useState("");
  const [category, setCategory] = useState("");
  const [presidentName, setPresidentName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create Auth User
      console.log("Step 1: Creating Auth User...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Auth Error:", authError);
        throw authError;
      }

      if (authData.user) {
        // 2. Create Profile (using upsert to be safe)
        console.log("Step 2: Creating/Updating Profile for user:", authData.user.id);
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            first_name: clubName,
            email: email,
            role: 'organization',
            status: 'active'
          });
        
        if (profileError) {
          console.error("Profile Error:", profileError);
          throw profileError;
        }

        // 3. Create the Club Entry
        console.log("Step 3: Creating Club Entry...");
        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .insert({
            club_name: clubName,
            category: category,
            president: presidentName,
            active_members: 1, // Starting with the leader
            club_description: `Official organization page for ${clubName}`
          })
          .select()
          .single();
        
        if (clubError) {
           console.error("Club Error:", clubError);
           throw clubError;
        }

        if (!clubData?.clubid) {
          throw new Error("Club created but no clubid returned. Check database schema.");
        }

        // 4. Set the user as the LEADER in my_clubs
        console.log("Step 4: Setting Leader Status in my_clubs for clubid:", clubData.clubid);
        const { error: leaderError } = await supabase
          .from('my_clubs')
          .insert({
            user_id: authData.user.id,
            club_id: clubData.clubid,
            full_name: presidentName,
            student_id: 'LEADER_ACC', // Placeholder for club leader
            status: 'LEADER'
          });
        
        if (leaderError) {
          console.error("Leader Link Error:", leaderError);
          throw leaderError;
        }
        
        console.log("Sign-up process complete!");
      } else {
        // If user is null, it might be due to email confirmation being required
        setError("Account created! Please check your email for a confirmation link before logging in.");
        setIsLoading(false);
        return;
      }

      router.push("/organization");
    } catch (err: any) {
      console.error("Full Signup Error Object:", err);
      // Extract the most useful error message
      const errorMessage = err.message || err.error_description || (typeof err === 'string' ? err : "An error occurred during setup");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
      case 1: return { label: "Weak", color: "bg-red-500", textColor: "text-red-500", width: "w-1/4" };
      case 2: return { label: "Fair", color: "bg-orange-500", textColor: "text-orange-500", width: "w-2/4" };
      case 3: return { label: "Good", color: "bg-yellow-400", textColor: "text-yellow-400", width: "w-3/4" };
      case 4: return { label: "Strong", color: "bg-green-500", textColor: "text-green-500", width: "w-full" };
      default: return { label: "", color: "bg-white/10", textColor: "text-white/10", width: "w-0" };
    }
  };

  const info = getStrengthInfo(strengthScore);

  return (
    <div suppressHydrationWarning className={cn("relative flex min-h-screen items-center justify-center bg-[#0f0c29] p-4 lg:p-8 font-sans text-white overflow-hidden", className)} {...props}>
      <div className="absolute inset-0 z-0 pointer-events-none blur-[80px]">
        <div className="absolute -left-[100px] -top-[100px] h-[600px] w-[600px] animate-pulse rounded-full bg-[#4A00E0] opacity-60"></div>
        <div className="absolute -bottom-[150px] -right-[100px] h-[500px] w-[500px] animate-pulse rounded-full bg-[#8E2DE2] opacity-60"></div>
      </div>

      <div className="relative z-10 flex w-full max-w-[1000px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-[20px] lg:min-h-[600px] lg:flex-row">
        <div className="relative hidden flex-1 flex-col justify-center p-8 lg:flex lg:border-r lg:border-white/10 lg:p-12">
          <div className="mb-12 flex items-center gap-[15px]">
            <span className="text-[1.5rem] font-bold text-white">Engage</span><span className="text-[1.8rem] -ml-4 font-bold text-[#f5af19]">X</span>
          </div>
          <h2 className="mb-6 text-[2.5rem] font-extrabold tracking-tight leading-[1.1] text-white">
            Register <br />
            <span className="bg-gradient-to-r from-[#c084fc] to-[#f9a8d4] bg-clip-text text-transparent">Your Club.</span>
          </h2>
          <p className="mb-12 text-[1.1rem] leading-[1.6] text-[#b3b3b3]">Establish your organization's presence on campus and start managing your events today.</p>
        </div>

        <div className="flex w-full flex-col justify-center bg-black/20 p-6 sm:p-8 lg:w-[55%] lg:p-[2rem_3rem]">
          {step === 1 ? (
            <form className="flex flex-col gap-4" onSubmit={handleNextStep}>
              <h3 className="mb-6 text-[1.75rem] font-semibold text-white">Club Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[0.85rem] text-[#b3b3b3]">Club Name</label>
                   <div className="flex h-[48px] items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 focus-within:border-[#8E2DE2]">
                     <Building2 size={16} className="text-[#b3b3b3]" />
                     <input type="text" className="w-full bg-transparent outline-none text-sm" placeholder="e.g. CS Society" required value={clubName} onChange={e => setClubName(e.target.value)} />
                   </div>
                </div>
                {/* UPDATED: Category Select Menu */}
                <div className="space-y-1.5">
                   <label className="text-[0.85rem] text-[#b3b3b3]">Category</label>
                   <div className="flex h-[48px] items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 focus-within:border-[#8E2DE2]">
                     <Tag size={16} className="text-[#b3b3b3]" />
                     <select 
                        className="w-full bg-transparent outline-none text-sm text-white appearance-none" 
                        required 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                     >
                        <option value="" className="bg-[#0f0c29]">Select Category</option>
                        {CATEGORIES.map(c => (
                          <option key={c} value={c} className="bg-[#0f0c29]">{c}</option>
                        ))}
                     </select>
                   </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.85rem] text-[#b3b3b3]">President Name</label>
                <div className="flex h-[48px] items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 focus-within:border-[#8E2DE2]">
                  <User size={16} className="text-[#b3b3b3]" />
                  <input type="text" className="w-full bg-transparent outline-none text-sm" placeholder="Full Name" required value={presidentName} onChange={e => setPresidentName(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[0.85rem] text-[#b3b3b3]">Email</label>
                   <div className="flex h-[48px] items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 focus-within:border-[#8E2DE2]">
                     <Mail size={16} className="text-[#b3b3b3]" />
                     <input type="email" className="w-full bg-transparent outline-none text-sm" placeholder="club@uni.edu" required value={email} onChange={e => setEmail(e.target.value)} />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[0.85rem] text-[#b3b3b3]">Phone</label>
                   <div className="flex h-[48px] items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 focus-within:border-[#8E2DE2]">
                     <Phone size={16} className="text-[#b3b3b3]" />
                     <input type="tel" className="w-full bg-transparent outline-none text-sm" placeholder="07x..." required value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                   </div>
                </div>
              </div>
              <button type="submit" className="mt-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] font-semibold text-white">
                Next Step <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSignUp}>
              <h3 className="mb-6 text-[1.75rem] font-semibold text-white">Secure Account</h3>
              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              <div className="space-y-1.5">
                <label className="text-[0.85rem] text-[#b3b3b3]">Password</label>
                <div className="flex h-[48px] items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 focus-within:border-[#8E2DE2]">
                  <Lock size={16} className="text-[#b3b3b3]" />
                  <input type={showPassword ? "text" : "password"} className="flex-1 bg-transparent outline-none text-sm" required value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <div className="h-[6px] w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${info.width} ${info.color}`} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.85rem] text-[#b3b3b3]">Confirm Password</label>
                <div className="flex h-[48px] items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 focus-within:border-[#8E2DE2]">
                  <ShieldCheck size={16} className="text-[#b3b3b3]" />
                  <input type={showConfirmPassword ? "text" : "password"} className="flex-1 bg-transparent outline-none text-sm" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex h-[50px] w-[110px] items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium"><ChevronLeft size={18} /> Back</button>
                <button type="submit" disabled={isLoading || !password || password !== confirmPassword} className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] font-semibold text-white">
                  {isLoading ? "Signing up..." : "Complete Setup"} <CheckCircle2 size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}