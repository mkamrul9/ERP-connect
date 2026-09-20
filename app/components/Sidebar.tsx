'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, LayoutDashboard, Users, Wallet, FileText, Phone,
  MessageCircle, Zap, Key, Shield, LogOut, X, Sun, Moon
, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const closeSide = () => {
    if (typeof document !== 'undefined') {
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('side-overlay')?.classList.remove('show');
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <aside className="side" id="sidebar">

      {/* ── Logo ────────────────────────────────────────── */}
      <div className="side-logo" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="logo-icon">
            <Zap color="#fff" size={17} strokeWidth={2.5} />
          </div>
          <div>
            <div className="logo-text">ERP-connect</div>
            <div className="logo-sub">Enterprise Platform</div>
          </div>
        </div>
        {/* Mobile drawer close button */}
        <button
          type="button"
          className="side-close-btn"
          onClick={closeSide}
          aria-label="Close menu"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── User Pill ────────────────────────────────────── */}
      {user && (
        <div style={{ padding: '10px 10px 4px' }}>
          <div className="side-user">
            <div className="side-avatar">{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div className="side-uname" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div className="side-urole">{user.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="nav" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="nav-section">Workspace</div>

        <Link href="/" className={pathname === '/' ? 'on' : ''} onClick={closeSide}>
          <Home size={17} /> Home
        </Link>

        <Link href="/dashboard" className={pathname === '/dashboard' ? 'on' : ''} onClick={closeSide}>
          <LayoutDashboard size={17} /> Daily Tasks
        </Link>

        <Link href="/hr" className={pathname === '/hr' ? 'on' : ''} onClick={closeSide}>
          <Users size={17} /> HR &amp; Attendance
        </Link>

        {user?.role === 'Admin' && (
          <>
            <div className="nav-section">Finance &amp; Ops</div>

            <Link href="/accounts" className={pathname === '/accounts' ? 'on' : ''} onClick={closeSide}>
              <Wallet size={17} /> Accounts
            </Link>

            <Link href="/meetings" className={pathname === '/meetings' ? 'on' : ''} onClick={closeSide}>
              <Phone size={17} /> Meetings
            </Link>

            <Link href="/tenders" className={pathname === '/tenders' ? 'on' : ''} onClick={closeSide}>
              <FileText size={17} /> Tenders
            </Link>

            <div className="nav-section">System</div>

            <Link href="/credentials" className={pathname === '/credentials' ? 'on' : ''} onClick={closeSide}>
              <Key size={17} /> Credentials
            </Link>

          <Link href="/crm" className={pathname === '/crm' ? 'on' : ''} onClick={closeSide}>
          <Users size={17} /> CRM
        </Link>
        <Link href="/inventory" className={pathname === '/inventory' ? 'on' : ''} onClick={closeSide}>
          <Package size={17} /> Inventory
        </Link>
        <Link href="/automations" className={pathname === '/automations' ? 'on' : ''} onClick={closeSide}>
          <Zap size={17} /> Automations
        </Link>
        <Link href="/admin" className={pathname === '/admin' ? 'on' : ''} onClick={closeSide}>
              <Shield size={17} /> Admin Panel
            </Link>
          </>
        )}

        <div className="nav-section">Bot</div>
        <Link href="/chat" className={pathname === '/chat' ? 'on' : ''} onClick={closeSide}>
          <MessageCircle size={17} /> ERP Chat
        </Link>
      </nav>

      {/* ── Theme Toggle ─────────────────────────────────── */}
      <div
        className="theme-toggle-compact"
        onClick={toggleTheme}
        role="button"
        aria-label="Toggle theme"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && toggleTheme()}
      >
        <span className="theme-label">
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </span>
        <div className={`toggle-track${theme === 'light' ? ' on' : ''}`}>
          <div className="toggle-thumb" />
        </div>
      </div>

      {/* ── Logout ───────────────────────────────────────── */}
      {user && (
        <button className="side-logout" onClick={logout}>
          <LogOut size={15} /> Sign Out
        </button>
      )}
    </aside>
  );
}
