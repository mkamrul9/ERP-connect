"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

// Routes that only Admins can access
const ADMIN_ONLY_ROUTES = ['/accounts', '/credentials', '/meetings', '/tenders', '/admin'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  const pathname = usePathname();

  // Intercept all fetch requests to automatically add the Authorization header
  if (typeof window !== "undefined" && !(window as any).__fetchIntercepted) {
    (window as any).__fetchIntercepted = true;
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      let [resource, config] = args;
      if (typeof resource === "string" && resource.startsWith("/api") && !resource.startsWith("/api/auth/login")) {
        config = config || {};
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token || (document.cookie.match(/(?:^|; )token=([^;]*)/)?.[1])}`,
        };
      }
      const response = await originalFetch(resource, config);
      if (response.status === 401 || response.status === 403) {
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      return response;
    };
  }

  // While auth state is loading from cookies, show spinner � never redirect
  if (loading) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", background: "var(--bg)", color: "var(--muted)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #6366f1, #14b8a6)",
            marginBottom: 16,
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)"
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8, color: "var(--text)", letterSpacing: "-0.02em" }}>ERP-connect</div>
          <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Loading platform...</div>
        </div>
      </div>
    );
  }

  // Login page � render without sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Not authenticated � redirect to login
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // Non-admin trying to access an admin-only route � redirect to home
  if (user.role !== "Admin" && ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  // Authenticated � render with sidebar
  return (
    <div className="app">
      <Sidebar />
      <div className="main">{children}</div>
    </div>
  );
}
