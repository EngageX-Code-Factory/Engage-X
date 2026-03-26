"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Shield, Eye, EyeOff, Lock, Mail,
  AlertTriangle, Loader2, ChevronRight, UserCheck, UserPlus
} from "lucide-react";
import Link from "next/link"; // Import Link for navigation

export default function AdminLoginPage() {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [mounted, setMounted]         = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError("Invalid credentials. Access denied.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setError("Profile not found. Contact system administrator.");
        return;
      }

      if (profile.role !== "admin") {
        await supabase.auth.signOut();
        setError("Access restricted to administrators only.");
        return;
      }

      router.push("/admin");

    } catch {
      setError("A system error occurred. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes shake      { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        @keyframes fadein     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drift      { from{transform:translate(0,0)} to{transform:translate(40px,30px)} }

        .al-root {
          min-height: 100vh;
          background: #080c14;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .al-blob {
          position: absolute; border-radius: 50%;
          filter: blur(110px); pointer-events: none; z-index: 0;
        }
        .al-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(29,78,216,0.28) 0%, transparent 70%);
          top: -180px; left: -140px;
          animation: drift 20s ease-in-out infinite alternate;
        }
        .al-blob-2 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation: drift 26s ease-in-out infinite alternate-reverse;
        }

        .al-grid {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: radial-gradient(circle, rgba(59,130,246,0.12) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        .al-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 420px;
          background: #0d1320;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 40px 36px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.55);
          animation: fadein .3s ease;
        }

        .al-role-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          padding: 10px 16px;
          border-radius: 12px;
          margin-bottom: 30px;
        }
        .al-role-icon { color: #3b82f6; }
        .al-role-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 1px; }
        .al-role-value { font-weight: 700; color: #60a5fa; font-size: 13px; }

        .al-logo {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
        }
        .al-logo-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 24px rgba(59,130,246,0.3);
        }
        .al-logo-text { font-size: 17px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.4px; }
        .al-logo-sub { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #3b82f6; letter-spacing: 2px; text-transform: uppercase; }

        .al-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); margin-bottom: 28px; }

        .al-form { display: flex; flex-direction: column; gap: 18px; }
        .al-field-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; color: #334155; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 7px; }

        .al-input-wrap {
          display: flex; align-items: center; gap: 11px; height: 48px;
          background: rgba(8, 12, 20, 0.7);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px; padding: 0 14px;
          transition: border-color .2s;
        }
        .al-input-wrap:focus-within { border-color: rgba(59,130,246,0.45); box-shadow: 0 0 18px rgba(59,130,246,0.08); }
        .al-input-icon { color: #2d3f55; }
        .al-input-wrap:focus-within .al-input-icon { color: #3b82f6; }
        .al-input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Sora', sans-serif; font-size: 14px; color: #e2e8f0; }
        .al-input::placeholder { color: #1e2d42; }

        .al-eye-btn { background: none; border: none; cursor: pointer; color: #2d3f55; display: flex; align-items: center; }

        .al-error {
          display: flex; align-items: flex-start; gap: 9px; padding: 11px 13px;
          background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18);
          border-radius: 10px; font-size: 13px; color: #f87171; animation: shake .3s ease;
        }

        .al-submit {
          width: 100%; height: 48px; border: none; border-radius: 11px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb 60%, #3b82f6);
          color: white; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 18px rgba(37,99,235,0.32); transition: transform .2s, box-shadow .2s;
          margin-top: 4px;
        }
        .al-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,0.48); }
        .al-submit:disabled { opacity: .6; cursor: not-allowed; }

        .al-register-link {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: #475569;
        }
        .al-register-link a {
          color: #3b82f6;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }
        .al-register-link a:hover {
          color: #60a5fa;
          text-decoration: underline;
        }

        .al-footer { margin-top: 26px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; }
        .al-footer-mono { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #1e293b; letter-spacing: 1.5px; text-transform: uppercase; }
      `}</style>

      <div className="al-root">
        <div className="al-blob al-blob-1" />
        <div className="al-blob al-blob-2" />
        <div className="al-grid" />

        <div className="al-card">
          {/* Logo Section */}
          <div className="al-logo">
            <div className="al-logo-icon">
              <Shield size={22} color="white" />
            </div>
            <div>
              <div className="al-logo-text">EngageX</div>
              <div className="al-logo-sub">Portal System</div>
            </div>
          </div>

          {/* Role Identifier */}
          <div className="al-role-tag">
            <UserCheck className="al-role-icon" size={18} />
            <div>
              <div className="al-role-label">Authorised Role</div>
              <div className="al-role-value">Administrator</div>
            </div>
          </div>

          <div className="al-divider" />

          <form className="al-form" onSubmit={handleLogin}>
            {error && (
              <div className="al-error">
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="al-field-label">System Email</label>
              <div className="al-input-wrap">
                <Mail size={15} className="al-input-icon" />
                <input
                  type="email"
                  className="al-input"
                  placeholder="admin@engagex.lk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="al-field-label">Access Token</label>
              <div className="al-input-wrap">
                <Lock size={15} className="al-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="al-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="al-eye-btn"
                  onClick={() => setShowPassword(s => !s)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Verifying Identity…
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Login
                  <ChevronRight size={14} style={{ marginLeft: 2, opacity: .7 }} />
                </>
              )}
            </button>
          </form>

          {/* New Create Account Section */}
          <div className="al-register-link">
            No administrative credentials? <br />
            <Link href="/admin/register">
              <UserPlus size={14} /> Signin here
            </Link>
          </div>

          <div className="al-footer">
            <div className="al-footer-mono">
              Secure Terminal <span>v2.0</span> // BALANGODA_SRI_LANKA
            </div>
          </div>
        </div>
      </div>
    </>
  );
}