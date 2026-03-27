"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Shield, Eye, EyeOff, Lock, Mail, User,
  AlertTriangle, Loader2, ChevronRight,
  ArrowLeft, KeyRound, ShieldCheck
} from "lucide-react";
import Link from "next/link";

// ── Invite code gate ──────────────────────────────────────────────────────────
// Set this in your .env.local as NEXT_PUBLIC_ADMIN_INVITE_CODE=your-secret
// Anyone without this code cannot register as admin.
// In production you can rotate this code after each use.
const INVITE_CODE = process.env.NEXT_PUBLIC_ADMIN_INVITE_CODE ?? "ENGAGEX-ADMIN-2025";

export default function AdminRegisterPage() {
  const [step, setStep] = useState<'invite' | 'register'>('invite');

  // Step 1 — invite code
  const [inviteCode,      setInviteCode]      = useState("");
  const [inviteError,     setInviteError]      = useState<string | null>(null);

  // Step 2 — registration details
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [isLoading,       setIsLoading]       = useState(false);

  const router = useRouter();

  // ── Step 1: Verify invite code ─────────────────────────────────────────────
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim() === INVITE_CODE) {
      setInviteError(null);
      setStep('register');
    } else {
      setInviteError("Invalid invite code. Contact your system administrator.");
    }
  };

  // ── Step 2: Register admin ─────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed.");

      // Set role to admin in profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name:  lastName,
          role:       "admin",
          status:     "active",
        })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      // Redirect to login with success banner
      router.push("/admin/login?registered=true");

    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        @keyframes fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drift  { from{transform:translate(0,0)} to{transform:translate(40px,30px)} }

        .ar-root { min-height:100vh; background:#080c14; display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; color:#e2e8f0; position:relative; overflow:hidden; padding:20px; }
        .ar-blob { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; }
        .ar-blob-1 { width:520px; height:520px; background:radial-gradient(circle,rgba(29,78,216,0.22) 0%,transparent 70%); top:-180px; left:-140px; animation:drift 20s ease-in-out infinite alternate; }
        .ar-blob-2 { width:360px; height:360px; background:radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%); bottom:-80px; right:-80px; animation:drift 26s ease-in-out infinite alternate-reverse; }
        .ar-grid { position:absolute; inset:0; z-index:1; pointer-events:none; background-image:radial-gradient(circle,rgba(59,130,246,0.08) 1px,transparent 1px); background-size:36px 36px; }

        /* Card */
        .ar-card {
          position:relative; z-index:10; width:100%; max-width:430px;
          background:#0d1320; border:1px solid rgba(255,255,255,0.07);
          border-radius:20px; padding:38px 34px;
          box-shadow:0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.04);
          animation:fadein .3s ease;
        }
        .ar-card::before,.ar-card::after { content:''; position:absolute; width:16px; height:16px; border-color:rgba(59,130,246,0.18); border-style:solid; pointer-events:none; }
        .ar-card::before { top:12px; left:12px; border-width:2px 0 0 2px; border-radius:3px 0 0 0; }
        .ar-card::after  { bottom:12px; right:12px; border-width:0 2px 2px 0; border-radius:0 0 3px 0; }

        /* Back link */
        .ar-back { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; color:#475569; text-decoration:none; letter-spacing:.5px; text-transform:uppercase; transition:color .2s; margin-bottom:22px; }
        .ar-back:hover { color:#60a5fa; }

        /* Logo */
        .ar-logo { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .ar-logo-icon { width:42px; height:42px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius:11px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(59,130,246,0.28); flex-shrink:0; }
        .ar-logo-text { font-size:16px; font-weight:800; color:#f1f5f9; letter-spacing:-.3px; }
        .ar-logo-sub  { font-family:'JetBrains Mono',monospace; font-size:9px; color:#3b82f6; letter-spacing:2px; text-transform:uppercase; margin-top:1px; }

        /* Step indicator */
        .ar-steps { display:flex; align-items:center; gap:8px; margin-bottom:22px; }
        .ar-step { display:flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:50%; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; transition:all .2s; flex-shrink:0; }
        .ar-step.done   { background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.3); color:#34d399; }
        .ar-step.active { background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.35); color:#60a5fa; }
        .ar-step.idle   { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); color:#334155; }
        .ar-step-line { flex:1; height:1px; background:rgba(255,255,255,0.06); }
        .ar-step-label { font-family:'JetBrains Mono',monospace; font-size:9px; color:#334155; letter-spacing:.8px; text-transform:uppercase; }

        .ar-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent); margin-bottom:22px; }

        /* Form */
        .ar-form { display:flex; flex-direction:column; gap:15px; }
        .ar-label { display:block; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:600; color:#334155; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:7px; }
        .ar-input-wrap { display:flex; align-items:center; gap:11px; height:48px; background:rgba(8,12,20,0.7); border:1px solid rgba(255,255,255,0.07); border-radius:11px; padding:0 14px; transition:border-color .2s,box-shadow .2s; }
        .ar-input-wrap:focus-within { border-color:rgba(59,130,246,0.45); box-shadow:0 0 0 3px rgba(59,130,246,0.06); }
        .ar-input-icon { color:#2d3f55; flex-shrink:0; transition:color .2s; }
        .ar-input-wrap:focus-within .ar-input-icon { color:#3b82f6; }
        .ar-input { flex:1; background:transparent; border:none; outline:none; font-family:'Sora',sans-serif; font-size:14px; color:#e2e8f0; }
        .ar-input::placeholder { color:#1e2d42; }
        .ar-eye-btn { background:none; border:none; cursor:pointer; color:#2d3f55; display:flex; align-items:center; transition:color .2s; padding:0; }
        .ar-eye-btn:hover { color:#64748b; }

        /* Grid for name row */
        .ar-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

        /* Errors */
        .ar-error { display:flex; align-items:flex-start; gap:9px; padding:11px 13px; background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.18); border-radius:10px; font-size:13px; color:#f87171; line-height:1.5; animation:shake .3s ease; }

        /* Invite code hint */
        .ar-invite-hint { font-size:11px; color:#334155; margin-top:6px; line-height:1.5; font-family:'JetBrains Mono',monospace; }

        /* Submit */
        .ar-submit {
          width:100%; height:48px; border:none; border-radius:11px;
          background:linear-gradient(135deg,#1d4ed8,#2563eb 60%,#3b82f6);
          color:white; font-family:'Sora',sans-serif; font-size:14px; font-weight:700;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow:0 4px 18px rgba(37,99,235,0.3); transition:transform .2s,box-shadow .2s;
          margin-top:4px; position:relative; overflow:hidden;
        }
        .ar-submit::before { content:''; position:absolute; top:0; left:-100%; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); transition:left .5s; }
        .ar-submit:not(:disabled):hover::before { left:150%; }
        .ar-submit:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,99,235,0.46); }
        .ar-submit:disabled { opacity:.6; cursor:not-allowed; }

        /* Footer */
        .ar-footer { margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.04); text-align:center; font-family:'JetBrains Mono',monospace; font-size:9px; color:#1e293b; letter-spacing:1.2px; text-transform:uppercase; }
      `}</style>

      <div className="ar-root">
        <div className="ar-blob ar-blob-1" />
        <div className="ar-blob ar-blob-2" />
        <div className="ar-grid" />

        <div className="ar-card">

          {/* Back */}
          <Link href="/admin/login" className="ar-back">
            <ArrowLeft size={12} /> Back to Login
          </Link>

          {/* Logo */}
          <div className="ar-logo">
            <div className="ar-logo-icon"><Shield size={21} color="white" /></div>
            <div>
              <div className="ar-logo-text">Admin<span style={{ color:'#3b82f6' }}>Portal</span></div>
              <div className="ar-logo-sub">Register Admin</div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="ar-steps">
            <div className={`ar-step ${step === 'register' ? 'done' : 'active'}`}>1</div>
            <div className="ar-step-line" />
            <div className={`ar-step ${step === 'register' ? 'active' : 'idle'}`}>2</div>
            <div style={{ marginLeft:6, fontSize:10, color:'#334155', fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase', letterSpacing:'.8px' }}>
              {step === 'invite' ? 'Invite Code' : 'Account Details'}
            </div>
          </div>

          <div className="ar-divider" />

          {/* ── STEP 1: Invite code ── */}
          {step === 'invite' && (
            <form className="ar-form" onSubmit={handleInviteSubmit}>
              <div style={{ marginBottom:4 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, padding:'10px 14px', background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.18)', borderRadius:10 }}>
                  <KeyRound size={14} color="#f59e0b" style={{ flexShrink:0 }} />
                  <span style={{ fontSize:12, color:'#92400e', fontFamily:'JetBrains Mono,monospace', lineHeight:1.5 }}>
                    Admin registration requires an invite code. Contact your system administrator to obtain one.
                  </span>
                </div>
              </div>

              {inviteError && (
                <div className="ar-error">
                  <AlertTriangle size={14} style={{ flexShrink:0, marginTop:2 }} />
                  <span>{inviteError}</span>
                </div>
              )}

              <div>
                <label className="ar-label">Invite Code</label>
                <div className="ar-input-wrap">
                  <KeyRound size={15} className="ar-input-icon" />
                  <input
                    type="text" className="ar-input"
                    placeholder="ENGAGEX-ADMIN-XXXX"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                    required autoFocus
                    style={{ letterSpacing:'1px', fontFamily:'JetBrains Mono,monospace' }}
                  />
                </div>
                <p className="ar-invite-hint">Case-insensitive. Ask your administrator for the current code.</p>
              </div>

              <button type="submit" className="ar-submit">
                <ShieldCheck size={15} />
                Verify Code
                <ChevronRight size={13} style={{ opacity:.65 }} />
              </button>
            </form>
          )}

          {/* ── STEP 2: Registration details ── */}
          {step === 'register' && (
            <form className="ar-form" onSubmit={handleRegister}>
              {error && (
                <div className="ar-error">
                  <AlertTriangle size={14} style={{ flexShrink:0, marginTop:2 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Name row */}
              <div className="ar-row">
                <div>
                  <label className="ar-label">First Name</label>
                  <div className="ar-input-wrap">
                    <User size={15} className="ar-input-icon" />
                    <input type="text" className="ar-input" placeholder="John" required
                      value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="ar-label">Last Name</label>
                  <div className="ar-input-wrap">
                    <User size={15} className="ar-input-icon" />
                    <input type="text" className="ar-input" placeholder="Doe" required
                      value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <label className="ar-label">System Email</label>
                <div className="ar-input-wrap">
                  <Mail size={15} className="ar-input-icon" />
                  <input type="email" className="ar-input" placeholder="admin@engagex.lk" required
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </div>
              </div>

              <div>
                <label className="ar-label">Password</label>
                <div className="ar-input-wrap">
                  <Lock size={15} className="ar-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"} className="ar-input"
                    placeholder="Min. 8 characters" required minLength={8}
                    value={password} onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="ar-eye-btn" onClick={() => setShowPassword(s => !s)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="ar-submit" disabled={isLoading}>
                {isLoading
                  ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> Creating account…</>
                  : <><Shield size={15} /> Create Admin Account <ChevronRight size={13} style={{ opacity:.65 }} /></>
                }
              </button>
            </form>
          )}

          <div className="ar-footer">
            Secure Terminal v2.0 · Admin Registration
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </>
  );
}