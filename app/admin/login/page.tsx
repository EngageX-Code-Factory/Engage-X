"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Shield, Eye, EyeOff, Lock, Mail,
  AlertTriangle, Loader2, ChevronRight,
  ShieldOff, ShieldCheck, UserPlus, CheckCircle2
} from "lucide-react";
import Link from "next/link";

const ROLE_DENIAL: Record<string, string> = {
  student:      "This portal is for administrators only. Please use the student portal.",
  organization: "This portal is for administrators only. Please use the organization portal.",
};

export default function AdminLoginPage() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [errorType,    setErrorType]    = useState<'credentials' | 'access' | 'system' | null>(null);
  const [successMsg,   setSuccessMsg]   = useState<string | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [checking,     setChecking]     = useState(true);
  const [mounted,      setMounted]      = useState(false);

  const router       = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const supabase = createClient();

    const checkSession = async () => {
      // Show success banner after registration
      if (searchParams.get('registered') === 'true') {
        setSuccessMsg("Admin account created. Check your email to verify, then sign in.");
        setChecking(false);
        return;
      }

      // Middleware sent ?denied=1 — wrong role tried to access /admin
      if (searchParams.get('denied') === '1') {
        await supabase.auth.signOut();
        setError("Access restricted to administrators only. You have been signed out.");
        setErrorType('access');
        setChecking(false);
        return;
      }

      // Already logged in as admin → skip login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChecking(false); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        router.replace('/admin');
        return;
      }

      await supabase.auth.signOut();
      setChecking(false);
    };

    checkSession();
  }, [mounted, router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setSuccessMsg(null);
    const supabase = createClient();

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError("Invalid email or password.");
        setErrorType('credentials');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setError("No profile found for this account. Contact your system administrator.");
        setErrorType('system');
        return;
      }

      if (profile.role !== "admin") {
        await supabase.auth.signOut();
        setError(ROLE_DENIAL[profile.role] ?? "You do not have permission to access this portal.");
        setErrorType('access');
        return;
      }

      router.push("/admin");
    } catch {
      setError("A system error occurred. Please try again.");
      setErrorType('system');
    } finally {
      setIsLoading(false);
    }
  };

  const errorStyles = {
    credentials: { border: 'rgba(239,68,68,0.22)',   bg: 'rgba(239,68,68,0.07)',   color: '#f87171' },
    access:      { border: 'rgba(245,158,11,0.25)',  bg: 'rgba(245,158,11,0.07)',  color: '#fbbf24' },
    system:      { border: 'rgba(100,116,139,0.25)', bg: 'rgba(100,116,139,0.07)', color: '#94a3b8' },
  };
  const errStyle = errorType ? errorStyles[errorType] : errorStyles.credentials;

  if (!mounted || checking) {
    return (
      <div style={{ minHeight:'100vh', background:'#080c14', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Loader2 size={28} color="#3b82f6" style={{ animation:'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        @keyframes spin       { to { transform:rotate(360deg); } }
        @keyframes shake      { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        @keyframes fadein     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drift      { from{transform:translate(0,0)} to{transform:translate(40px,30px)} }
        @keyframes pulse-glow { 0%,100%{opacity:1} 50%{opacity:.35} }

        .al-root { min-height:100vh; background:#080c14; display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; color:#e2e8f0; position:relative; overflow:hidden; padding:20px; }
        .al-blob { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; }
        .al-blob-1 { width:520px; height:520px; background:radial-gradient(circle,rgba(29,78,216,0.28) 0%,transparent 70%); top:-180px; left:-140px; animation:drift 20s ease-in-out infinite alternate; }
        .al-blob-2 { width:360px; height:360px; background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%); bottom:-80px; right:-80px; animation:drift 26s ease-in-out infinite alternate-reverse; }
        .al-grid { position:absolute; inset:0; z-index:1; pointer-events:none; background-image:radial-gradient(circle,rgba(59,130,246,0.1) 1px,transparent 1px); background-size:36px 36px; }

        .al-card {
          position:relative; z-index:10; width:100%; max-width:410px;
          background:#0d1320; border:1px solid rgba(255,255,255,0.07);
          border-radius:20px; padding:38px 34px;
          box-shadow:0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.05);
          animation:fadein .3s ease;
        }
        .al-card::before,.al-card::after { content:''; position:absolute; width:16px; height:16px; border-color:rgba(59,130,246,0.2); border-style:solid; pointer-events:none; }
        .al-card::before { top:12px; left:12px; border-width:2px 0 0 2px; border-radius:3px 0 0 0; }
        .al-card::after  { bottom:12px; right:12px; border-width:0 2px 2px 0; border-radius:0 0 3px 0; }

        /* Logo */
        .al-logo { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .al-logo-icon { width:42px; height:42px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius:11px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(59,130,246,0.28); flex-shrink:0; }
        .al-logo-text { font-size:16px; font-weight:800; color:#f1f5f9; letter-spacing:-.3px; }
        .al-logo-sub  { font-family:'JetBrains Mono',monospace; font-size:9px; color:#3b82f6; letter-spacing:2px; text-transform:uppercase; margin-top:1px; }

        /* Role tag */
        .al-role-tag { display:flex; align-items:center; gap:9px; background:rgba(29,78,216,0.08); border:1px solid rgba(59,130,246,0.15); padding:10px 14px; border-radius:10px; margin-bottom:20px; }
        .al-role-icon { color:#3b82f6; flex-shrink:0; }
        .al-role-label { font-family:'JetBrains Mono',monospace; font-size:10px; color:#475569; text-transform:uppercase; letter-spacing:1px; }
        .al-role-value { font-weight:700; color:#60a5fa; font-size:12px; }

        .al-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent); margin-bottom:22px; }

        /* Form */
        .al-form { display:flex; flex-direction:column; gap:16px; }
        .al-field-label { display:block; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:600; color:#334155; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:7px; }
        .al-input-wrap { display:flex; align-items:center; gap:11px; height:48px; background:rgba(8,12,20,0.7); border:1px solid rgba(255,255,255,0.07); border-radius:11px; padding:0 14px; transition:border-color .2s,box-shadow .2s; }
        .al-input-wrap:focus-within { border-color:rgba(59,130,246,0.45); box-shadow:0 0 0 3px rgba(59,130,246,0.06); }
        .al-input-icon { color:#2d3f55; flex-shrink:0; transition:color .2s; }
        .al-input-wrap:focus-within .al-input-icon { color:#3b82f6; }
        .al-input { flex:1; background:transparent; border:none; outline:none; font-family:'Sora',sans-serif; font-size:14px; color:#e2e8f0; }
        .al-input::placeholder { color:#1e2d42; }
        .al-eye-btn { background:none; border:none; cursor:pointer; color:#2d3f55; display:flex; align-items:center; transition:color .2s; padding:0; }
        .al-eye-btn:hover { color:#64748b; }

        /* Alerts */
        .al-error   { display:flex; align-items:flex-start; gap:9px; padding:11px 13px; border-radius:10px; font-size:13px; line-height:1.5; animation:shake .3s ease; }
        .al-success { display:flex; align-items:flex-start; gap:9px; padding:11px 13px; border-radius:10px; font-size:13px; line-height:1.5; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.22); color:#34d399; animation:fadein .3s ease; }

        /* Submit */
        .al-submit {
          width:100%; height:48px; border:none; border-radius:11px;
          background:linear-gradient(135deg,#1d4ed8,#2563eb 60%,#3b82f6);
          color:white; font-family:'Sora',sans-serif; font-size:14px; font-weight:700;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow:0 4px 18px rgba(37,99,235,0.3); transition:transform .2s,box-shadow .2s;
          margin-top:4px; position:relative; overflow:hidden;
        }
        .al-submit::before { content:''; position:absolute; top:0; left:-100%; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); transition:left .5s; }
        .al-submit:not(:disabled):hover::before { left:150%; }
        .al-submit:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,99,235,0.46); }
        .al-submit:disabled { opacity:.6; cursor:not-allowed; }

        /* Register link */
        .al-register {
          margin-top:20px; padding-top:18px;
          border-top:1px solid rgba(255,255,255,0.05);
          display:flex; align-items:center; justify-content:center; gap:8px;
          font-size:12px; color:#475569;
        }
        .al-register-link {
          display:inline-flex; align-items:center; gap:5px;
          padding:6px 13px;
          border:1px solid rgba(59,130,246,0.2);
          border-radius:8px;
          background:rgba(59,130,246,0.06);
          color:#60a5fa; font-weight:600; font-size:12px;
          text-decoration:none;
          transition:all .18s;
        }
        .al-register-link:hover { background:rgba(59,130,246,0.12); border-color:rgba(59,130,246,0.35); color:#93c5fd; }

        /* Footer */
        .al-footer { margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:space-between; }
        .al-footer-mono { font-family:'JetBrains Mono',monospace; font-size:9px; color:#1e293b; letter-spacing:1.2px; text-transform:uppercase; }
        .al-status-dots { display:flex; gap:6px; align-items:center; }
        .al-sdot { width:5px; height:5px; border-radius:50%; }
        .al-sdot.g { background:#10b981; box-shadow:0 0 5px rgba(16,185,129,.6); animation:pulse-glow 2s infinite; }
        .al-sdot.b { background:#3b82f6; box-shadow:0 0 5px rgba(59,130,246,.6); animation:pulse-glow 2.5s infinite; }
        .al-sdot.a { background:#f59e0b; box-shadow:0 0 5px rgba(245,158,11,.6); animation:pulse-glow 3s infinite; }
      `}</style>

      <div className="al-root">
        <div className="al-blob al-blob-1" />
        <div className="al-blob al-blob-2" />
        <div className="al-grid" />

        <div className="al-card">

          {/* Logo */}
          <div className="al-logo">
            <div className="al-logo-icon"><Shield size={21} color="white" /></div>
            <div>
              <div className="al-logo-text">Admin<span style={{ color:'#3b82f6' }}>Portal</span></div>
              <div className="al-logo-sub">EngageX Platform</div>
            </div>
          </div>

          {/* Role tag */}
          <div className="al-role-tag">
            <ShieldCheck size={15} className="al-role-icon" />
            <div>
              <div className="al-role-label">Authorised Role</div>
              <div className="al-role-value">Administrator</div>
            </div>
          </div>

          <div className="al-divider" />

          {/* Form */}
          <form className="al-form" onSubmit={handleLogin}>

            {/* Success banner (after register) */}
            {successMsg && (
              <div className="al-success">
                <CheckCircle2 size={14} style={{ flexShrink:0, marginTop:2 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div
                className="al-error"
                style={{ background:errStyle.bg, border:`1px solid ${errStyle.border}`, color:errStyle.color }}
              >
                {errorType === 'access'
                  ? <ShieldOff size={14} style={{ flexShrink:0, marginTop:2 }} />
                  : <AlertTriangle size={14} style={{ flexShrink:0, marginTop:2 }} />
                }
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="al-field-label">System Email</label>
              <div className="al-input-wrap">
                <Mail size={15} className="al-input-icon" />
                <input
                  type="email" className="al-input"
                  placeholder="admin@engagex.lk"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required disabled={isLoading} autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="al-field-label">Access Token</label>
              <div className="al-input-wrap">
                <Lock size={15} className="al-input-icon" />
                <input
                  type={showPassword ? "text" : "password"} className="al-input"
                  placeholder="••••••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required disabled={isLoading} autoComplete="current-password"
                />
                <button type="button" className="al-eye-btn" onClick={() => setShowPassword(s => !s)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={isLoading}>
              {isLoading
                ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> Verifying…</>
                : <><Shield size={15} /> Login <ChevronRight size={13} style={{ opacity:.65 }} /></>
              }
            </button>
          </form>

         
          <div className="al-footer">
            <div className="al-footer-mono">Secure Terminal v2.0</div>
            <div className="al-status-dots">
              <span className="al-sdot g" title="Auth online" />
              <span className="al-sdot b" title="DB connected" />
              <span className="al-sdot a" title="Admin required" />
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </>
  );
}