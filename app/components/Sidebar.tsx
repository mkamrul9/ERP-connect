'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, LayoutDashboard, Users, Wallet, FileText, Phone,
  MessageCircle, Zap, Key, Shield, LogOut, X, Sun, Moon,
  Package, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <aside className={`side ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">

      {/* ── Logo ────────────────────────────────────────── */}
      <div className="side-logo" style={{ justifyContent: isCollapsed ? 'center' : 'space-between', padding: isCollapsed ? '18px 0 16px' : '18px 16px 16px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
          <div className="logo-icon">
            <Zap color="#fff" size={17} strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div>
              <div className="logo-text">ERP-connect</div>
              <div className="logo-sub">Enterprise Platform</div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button type="button" className="side-close-btn" onClick={closeSide} aria-label="Close menu" title="Close">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute', top: 24, right: -12, zIndex: 10,
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '50%', width: 24, height: 24, display: 'none',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          color: 'var(--text)'
        }}
        className="collapse-btn"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="nav" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="nav-section">OPERATIONS</div>

        <Link href="/" className={pathname === '/' ? 'on' : ''} onClick={closeSide} title="Home">
          <Home size={17} /> {!isCollapsed && <span>Home</span>}
        </Link>

        <Link href="/dashboard" className={pathname === '/dashboard' ? 'on' : ''} onClick={closeSide} title="Daily Tasks">
          <LayoutDashboard size={17} /> {!isCollapsed && <span>Daily Tasks</span>}
        </Link>

        <Link href="/hr" className={pathname === '/hr' ? 'on' : ''} onClick={closeSide} title="HR & Attendance">
          <Users size={17} /> {!isCollapsed && <span>HR &amp; Attendance</span>}
        </Link>

        {user?.role === 'Admin' && (
          <>
            <div className="nav-section">MANAGEMENT</div>

            <Link href="/accounts" className={pathname === '/accounts' ? 'on' : ''} onClick={closeSide} title="Accounts">
              <Wallet size={17} /> {!isCollapsed && <span>Accounts</span>}
            </Link>

            <Link href="/meetings" className={pathname === '/meetings' ? 'on' : ''} onClick={closeSide} title="Meetings">
              <Phone size={17} /> {!isCollapsed && <span>Meetings</span>}
            </Link>

            <Link href="/tenders" className={pathname === '/tenders' ? 'on' : ''} onClick={closeSide} title="Tenders">
              <FileText size={17} /> {!isCollapsed && <span>Tenders</span>}
            </Link>

            <Link href="/crm" className={pathname === '/crm' ? 'on' : ''} onClick={closeSide} title="CRM">
              <Users size={17} /> {!isCollapsed && <span>CRM</span>}
            </Link>
            
            <Link href="/inventory" className={pathname === '/inventory' ? 'on' : ''} onClick={closeSide} title="Inventory">
              <Package size={17} /> {!isCollapsed && <span>Inventory</span>}
            </Link>

            <div className="nav-section">SYSTEM</div>

            <Link href="/credentials" className={pathname === '/credentials' ? 'on' : ''} onClick={closeSide} title="Credentials">
              <Key size={17} /> {!isCollapsed && <span>Credentials</span>}
            </Link>

            <Link href="/automations" className={pathname === '/automations' ? 'on' : ''} onClick={closeSide} title="Automations">
              <Zap size={17} /> {!isCollapsed && <span>Automations</span>}
            </Link>
            
            <Link href="/admin" className={pathname === '/admin' ? 'on' : ''} onClick={closeSide} title="Admin Panel">
              <Shield size={17} /> {!isCollapsed && <span>Admin Panel</span>}
            </Link>
          </>
        )}

        <div className="nav-section">BOT</div>
        <Link href="/chat" className={pathname === '/chat' ? 'on' : ''} onClick={closeSide} title="ERP Chat">
          <MessageCircle size={17} /> {!isCollapsed && <span>ERP Chat</span>}
        </Link>
      </nav>

      {/* ── Footer Area (Theme Toggle & User) ──────────────── */}
      <div style={{ padding: isCollapsed ? '10px 0' : '10px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          className="theme-toggle-compact"
          onClick={toggleTheme}
          role="button"
          aria-label="Toggle theme"
          title="Toggle Theme"
          style={{ justifyContent: isCollapsed ? 'center' : 'space-between', margin: isCollapsed ? '0 auto' : '0 10px' }}
        >
          {!isCollapsed && (
            <span className="theme-label">
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          )}
          {isCollapsed ? (
            theme === 'dark' ? <Moon size={16} color="var(--muted)" /> : <Sun size={16} color="var(--muted)" />
          ) : (
            <div className={`toggle-track${theme === 'light' ? ' on' : ''}`}>
              <div className="toggle-thumb" />
            </div>
          )}
        </div>

        {user && (
          <div style={{ padding: isCollapsed ? '0' : '0 10px', display: 'flex', justifyContent: 'center' }}>
            {!isCollapsed ? (
              <div className="side-user" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 0, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div className="side-avatar">{initials}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="side-uname" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name}
                    </div>
                    <div className="side-urole">{user.role}</div>
                  </div>
                </div>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }} title="Sign Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="side-user" style={{ margin: 0, padding: 0, background: 'transparent', cursor: 'pointer' }} onClick={logout} title="Sign Out">
                <div className="side-avatar">{initials}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .collapse-btn { display: flex !important; }
        }
      `}</style>
    </aside>
  );
}
