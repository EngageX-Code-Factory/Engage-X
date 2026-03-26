"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function OrgSignUpForm() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clubName, setClubName] = useState("");
  const [category, setCategory] = useState("");
  const [presidentName, setPresidentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Auth Sign Up
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;

      if (authData.user) {
        // 2. Create Profile
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          first_name: clubName,
          email: email,
          role: 'organization',
          status: 'active'
        });
        if (profileError) throw profileError;

        // 3. Create the Club (Uses 'club_name' per your SQL)
        const { data: clubData, error: clubError } = await supabase.from('clubs').insert({
          club_name: clubName,
          category: category,
          president: presidentName,
          active_members: 1,
        }).select().single();
        if (clubError) throw clubError;

        // 4. Link User as LEADER in my_clubs (Uses 'club_id' and 'user_id' per your SQL)
        const { error: leaderError } = await supabase.from('my_clubs').insert({
          user_id: authData.user.id,
          club_id: clubData.clubid, // Matches 'clubid' from your clubs table
          full_name: presidentName,
          student_id: 'ORG-LEADER',
          status: 'LEADER'
        });
        if (leaderError) throw leaderError;

        router.push("/organization");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <input type="text" placeholder="Club Name" value={clubName} onChange={(e) => setClubName(e.target.value)} required className="w-full p-2 rounded bg-white/10" />
      <input type="text" placeholder="President Name" value={presidentName} onChange={(e) => setPresidentName(e.target.value)} required className="w-full p-2 rounded bg-white/10" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 rounded bg-white/10" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 rounded bg-white/10" />
      <button type="submit" disabled={isLoading} className="w-full p-3 bg-purple-600 rounded flex justify-center">
        {isLoading ? <Loader2 className="animate-spin" /> : "Register Organization"}
      </button>
    </form>
  );
}