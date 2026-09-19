'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Wallet, FileText, Phone, Home, MessageCircle, Zap, Key, Shield, LogIn, LogOut } from 'lucide-react';
import Topbar from './components/Topbar';
import { useAuth } from './context/AuthContext';
import Cookies from 'js-cookie';

const ADMIN_MODULES = [
  { href: '/accounts',    icon: Wallet,          title: 'Accounts',        desc: 'Track expenses and billing',               color: '#eab308' },
  { href: '/credentials', icon: Key,             title: 'Credentials',     desc: 'Securely store and share access keys',     color: '#a855f7' },
  { href: '/dashboard',   icon: LayoutDashboard, title: 'Daily Tasks',     desc: 'Manage daily status and assignments',      color: '#4f7eff' },
  { href: '/hr',          icon: Users,           title: 'HR & Attendance',  desc: 'Mark attendance and leave requests',       color: '#22c55e' },
  { href: '/meetings',    icon: Phone,           title: 'Meetings',         desc: 'Schedule and track client calls',          color: '#f97316' },
  { href: '/tenders',     icon: FileText,        title: 'Tenders',          desc: 'Manage tender documents and status',       color: '#0ea5e9' },
  { href: '/admin',       icon: Shield,          title: 'Admin Panel',      desc: 'System settings and member management',   color: '#ef4444' },
  { href: '/chat.html',   icon: MessageCircle,   title: 'ERP Chat',         desc: 'Talk to the automated ERP Bot',           color: '#14b8a6' },
];

const EMPLOYEE_MODULES = [
  { href: '/dashboard',   icon: LayoutDashboard, title: 'Daily Tasks',     desc: 'View your assigned tasks',                 color: '#4f7eff' },
  { href: '/hr',          icon: Users,           title: 'HR & Attendance',  desc: 'Mark attendance and leave requests',       color: '#22c55e' },
  { href: '/chat.html',   icon: MessageCircle,   title: 'ERP Chat',         desc: 'Talk to the automated ERP Bot',           color: '#14b8a6' },
];

function nowDhaka(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Dhaka'
  });
}

function parseTimestamp(ts: string): Date {
  if (!ts) return new Date();
  const s = String(ts).trim();
  if (s.endsWith('Z') || s.includes('+') || (s.includes('-') && s.lastIndexOf('-') > 10)) {
    return new Date(s);
  }
  if (s.includes('T')) return new Date(s + 'Z');
  return new Date(s.replace(' ', 'T') + 'Z');
}

export default function HomePage() {
  const { user, token: ctxToken } = useAuth();
  const modules = user?.role === 'Admin' ? ADMIN_MODULES : EMPLOYEE_MODULES;

  const getAuthToken = useCallback(() => {
    return ctxToken || Cookies.get('token') || (typeof window !== 'undefined' ? (localStorage.getItem('erp_token') || localStorage.getItem('token')) : '') || '';
  }, [ctxToken]);

  const [attStatus, setAttStatus] = useState<{ checkedIn: boolean; checkedOut: boolean; inTime?: string | undefined; outTime?: string | undefined }>({
    checkedIn: false,
    checkedOut: false
  });

  const [attLoading, setAttLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const loadAttendance = useCallback(async () => {
    if (!user?.id) return;
    try {
      const token = getAuthToken();
      const res = await fetch('/api/attendance', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        const myAtt = data.filter((a: any) => String(a.member_id) === String(user.id));
        const inRec = myAtt.find((a: any) => a.action_type === 'IN');
        const outRec = myAtt.find((a: any) => a.action_type === 'OUT');
        
        const inTimeStr = inRec ? parseTimestamp(inRec.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Dhaka' }) : undefined;
        const outTimeStr = outRec ? parseTimestamp(outRec.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Dhaka' }) : undefined;

        setAttStatus({
          checkedIn: !!inRec,
          checkedOut: !!outRec,
          inTime: inTimeStr,
          outTime: outTimeStr
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [user?.id, getAuthToken]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const markAttendance = async (type: 'IN' | 'OUT') => {
    if (!user?.id) {
      showToast('Not logged in.');
      return;
    }
    setAttLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ member_id: user.id, action_type: type })
      });
      if (res.ok) {
        showToast(`✅ ${type === 'IN' ? 'Checked In' : 'Checked Out'} at ${nowDhaka()}`);
        await loadAttendance();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast('❌ ' + (err.error || 'Failed to record attendance'));
      }
    } catch (e) {
      showToast('Failed to reach server.');
    } finally {
      setAttLoading(false);
    }
  };

  return (
    <>
      <Topbar title="Home" />
      <div className="scroll">

        {/* ── In & Out Buttons (Before welcoming message) ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <button
            className="btn btn-green"
            disabled={attLoading || attStatus.checkedIn}
            onClick={() => markAttendance('IN')}
            title="Check In"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 22px',
              fontSize: '.88rem',
              fontWeight: 700,
              borderRadius: '9px',
              opacity: attStatus.checkedIn ? 0.45 : 1,
              cursor: attStatus.checkedIn ? 'not-allowed' : 'pointer',
              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)',
              transition: 'all .2s ease'
            }}
          >
            <LogIn size={15} /> In
          </button>

          <button
            className="btn btn-red"
            disabled={attLoading || !attStatus.checkedIn || attStatus.checkedOut}
            onClick={() => markAttendance('OUT')}
            title="Check Out"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 22px',
              fontSize: '.88rem',
              fontWeight: 700,
              borderRadius: '9px',
              opacity: (!attStatus.checkedIn || attStatus.checkedOut) ? 0.45 : 1,
              cursor: (!attStatus.checkedIn || attStatus.checkedOut) ? 'not-allowed' : 'pointer',
              boxShadow: '0 3px 10px rgba(244, 63, 94, 0.3)',
              transition: 'all .2s ease'
            }}
          >
            <LogOut size={15} /> Out
          </button>
        </div>

        {/* Welcome Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px', paddingTop: '8px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 60, height: 60, borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(20,184,166,0.15))',
            border: '1px solid rgba(99,102,241,0.25)',
            marginBottom: 18,
            boxShadow: '0 8px 24px rgba(99,102,241,0.2)',
          }}>
            <Zap size={28} color="#6366f1" />
          </div>
          <h1 style={{
            fontSize: '1.9rem', fontWeight: 800, color: 'var(--text)',
            marginBottom: 8, margin: '0 0 10px',
            letterSpacing: '-0.03em',
          }}>
            {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome to ERP-connect'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            Your enterprise platform — select a module to get started
          </p>
        </div>


        {/* Module Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px',
        }}>
          {modules.map(({ href, icon: Icon, title, desc, color }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  borderRadius: '14px',
                  border: `1px solid ${color}2a`,
                  background: `linear-gradient(135deg, ${color}0f 0%, var(--card) 55%)`,
                  marginBottom: 0,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = `0 12px 32px ${color}28`;
                  el.style.borderColor = `${color}60`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                  el.style.borderColor = `${color}2a`;
                }}
              >
                {/* Color accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg, ${color}, transparent)`,
                  borderRadius: '14px 14px 0 0',
                }} />
                <div style={{
                  background: `${color}20`,
                  color: color,
                  padding: '13px',
                  borderRadius: '12px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${color}30`,
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.94rem', fontWeight: 700, color: 'var(--text)',
                    marginBottom: 4, letterSpacing: '-0.01em'
                  }}>
                    {title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem', color: 'var(--muted)',
                    lineHeight: 1.45, overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {desc}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {toastMsg && <div className="toast on">{toastMsg}</div>}
    </>
  );
}
