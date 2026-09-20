"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Mail, Lock, LogIn, Zap } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        login(data.token, data.user);
        setTimeout(() => router.push("/"), 50);
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--bg)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none"
      }}>
        <div style={{
          position: "absolute", width: 600, height: 600,
          borderRadius: "50%", top: "-200px", left: "-200px",
          background: "radial-gradient(circle, rgba(37, 99, 235,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500,
          borderRadius: "50%", bottom: "-150px", right: "-100px",
          background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300,
          borderRadius: "50%", top: "50%", left: "60%",
          background: "radial-gradient(circle, rgba(37, 99, 235,0.08) 0%, transparent 70%)",
        }} />
      </div>

      {/* Left panel — branding (desktop only) */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px",
        background: "linear-gradient(145deg, rgba(37, 99, 235,0.1) 0%, rgba(20,184,166,0.06) 100%)",
        borderRight: "1px solid var(--border)",
        position: "relative",
      }} className="login-left-panel">
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 400 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 72, height: 72, borderRadius: 20,
            background: "linear-gradient(135deg, #2563eb, #14b8a6)",
            marginBottom: 28,
            boxShadow: "0 12px 36px rgba(37, 99, 235,0.45)",
          }}>
            <Zap color="#fff" size={34} strokeWidth={2.5} />
          </div>
          <h1 style={{
            fontSize: "2.4rem", fontWeight: 800,
            background: "linear-gradient(135deg, #e2e8f8, #2563eb)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-0.03em", marginBottom: 12,
          }}>
            ERP-connect
          </h1>
          <p style={{ color: "var(--text-sec)", fontSize: "1rem", lineHeight: 1.6, marginBottom: 40 }}>
            Modern Enterprise Resource Planning Platform — connecting your business operations in one place.
          </p>

          {/* Feature pills */}
          {[
            { icon: "📊", label: "Real-time Analytics" },
            { icon: "", label: "HR & Attendance" },
            { icon: "", label: "Tender Management" },
            { icon: "🔒", label: "Secure & Auditable" },
          ].map(f => (
            <div key={f.label} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(37, 99, 235,0.1)", border: "1px solid rgba(37, 99, 235,0.2)",
              borderRadius: 20, padding: "6px 14px",
              fontSize: "0.8rem", fontWeight: 600, color: "var(--text-sec)",
              margin: "4px",
            }}>
              {f.icon} {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        width: "100%", maxWidth: 480,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 36px",
        position: "relative",
      }}>
        <div style={{
          width: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}>
          {/* Form header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 56, height: 56, borderRadius: 14,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              marginBottom: 18,
              boxShadow: "0 8px 24px rgba(37, 99, 235,0.45)",
            }}>
              <ShieldCheck size={28} color="#fff" />
            </div>
            <h2 style={{
              margin: 0, fontSize: "1.45rem", fontWeight: 800,
              color: "var(--text)", letterSpacing: "-0.02em"
            }}>
              Welcome back
            </h2>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: "0.88rem" }}>
              Sign in to your ERP-connect account
            </p>
            
            {/* Demo Credentials Box */}
            <div style={{
              marginTop: 20,
              padding: "12px 16px",
              background: "var(--primary-dim)",
              borderRadius: 10,
              border: "1px solid var(--border)",
              textAlign: "left",
              fontSize: "0.8rem",
              color: "var(--text-sec)"
            }}>
              <div style={{ fontWeight: 700, color: "var(--primary)", marginBottom: 6, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Demo Credentials</div>
              <div style={{ marginBottom: 4 }}><strong>Admin:</strong> admin@erp.com / admin123</div>
              <div><strong>Employee:</strong> employee@erp.com / emp123</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.35)",
              color: "var(--red)",
              padding: "11px 14px",
              borderRadius: 10,
              fontSize: "0.84rem",
              marginBottom: 22,
              display: "flex", alignItems: "center", gap: 8,
            }}>
               {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: "block", marginBottom: 7,
                fontSize: "0.74rem", fontWeight: 700,
                color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em"
              }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{
                  position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                  color: "var(--muted)", pointerEvents: "none"
                }} />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 13px 12px 40px",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10, color: "var(--text)",
                    outline: "none", fontSize: "0.92rem",
                    fontFamily: "inherit",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                    e.target.style.boxShadow = "0 0 0 3px var(--primary-dim)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: "block", marginBottom: 7,
                fontSize: "0.74rem", fontWeight: 700,
                color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{
                  position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                  color: "var(--muted)", pointerEvents: "none"
                }} />
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 13px 12px 40px",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10, color: "var(--text)",
                    outline: "none", fontSize: "0.92rem",
                    fontFamily: "inherit",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                    e.target.style.boxShadow = "0 0 0 3px var(--primary-dim)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading
                  ? "var(--border)"
                  : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: loading ? "var(--muted)" : "#fff",
                border: "none",
                padding: "14px",
                borderRadius: 10,
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s ease",
                boxShadow: loading ? "none" : "0 4px 16px rgba(37, 99, 235,0.45)",
                letterSpacing: "0.01em",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(37, 99, 235,0.55)";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? "none" : "0 4px 16px rgba(37, 99, 235,0.45)";
              }}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <LogIn size={17} />
                </>
              )}
            </button>
          </form>

          <p style={{
            textAlign: "center", marginTop: 24,
            fontSize: "0.76rem", color: "var(--muted)"
          }}>
            Secured by ERP-connect © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Responsive: hide left panel on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
