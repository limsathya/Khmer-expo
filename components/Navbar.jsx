'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Layers, 
  Sun, 
  Moon, 
  LogIn, 
  LogOut, 
  User, 
  LayoutDashboard, 
  ChevronDown, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const { expoConfig, getExpoName, getExpoShortName } = useSettings();
  
  const [rippleKey, setRippleKey] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // ONLY 3 primary navigation links on the navbar:
  // "Submit Event" and "Admin" are removed per user requirement!
  const navLinks = [
    { href: '/', label: t('nav.overview', 'Overview'), icon: Layers },
    { href: '/timeline', label: t('nav.timeline', 'Timeline'), icon: Calendar },
    { href: '/committee', label: t('nav.committees', 'Committees'), icon: Users },
  ];

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    router.push('/');
  };

  const handleNavigate = (path) => {
    setUserDropdownOpen(false);
    router.push(path);
  };

  return (
    <header className="glass-header sticky top-0 z-50" style={{ width: '100%' }}>
      <div className="nav-header-inner">
        {/* Left: Brand Logo & Name (1 line) */}
        <Link 
          href="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            textDecoration: 'none',
            flexShrink: 0 
          }}
        >
          {expoConfig.logoType === 'image' && expoConfig.logoUrl ? (
            <img 
              src={expoConfig.logoUrl} 
              alt="Expo Logo" 
              style={{ width: '34px', height: '34px', borderRadius: '9px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)' }} 
            />
          ) : expoConfig.logoType === 'text' ? (
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '900',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              flexShrink: 0
            }}>
              {expoConfig.logoText || 'E'}
            </div>
          ) : (
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              flexShrink: 0
            }}>
              <Sparkles size={18} />
            </div>
          )}
          <span className="nav-brand-title nav-brand-full" style={{ 
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', 
            fontWeight: '800', 
            letterSpacing: '-0.02em', 
            color: 'var(--text-main)', 
            lineHeight: '1.2' 
          }}>
            {getExpoName(language)}
          </span>
          <span className="nav-brand-title nav-brand-short" style={{ 
            fontSize: 'clamp(0.82rem, 2.8vw, 0.95rem)', 
            fontWeight: '800', 
            letterSpacing: '-0.02em', 
            color: 'var(--text-main)', 
            lineHeight: '1.2' 
          }}>
            {getExpoShortName(language)}
          </span>
        </Link>

        {/* Center: Main Navigation (Overview, Timeline, Committees only) */}
        <nav className="nav-links-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                title={link.label}
                aria-label={link.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  background: isActive ? 'var(--btn-secondary-bg)' : 'transparent',
                  border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                  lineHeight: '1.4',
                  position: 'relative'
                }}
              >
                <Icon size={14} style={{ flexShrink: 0 }} />
                <span className="nav-link-text">{link.label}</span>
                {isActive && <span className="nav-active-pip" />}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Language Switcher, Theme Toggle, User Profile Menu */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Dark / Light Mode Motion Animated Toggle */}
          <button
            onClick={() => {
              setRippleKey(prev => prev + 1);
              toggleTheme();
            }}
            className="theme-toggle-btn"
            title={theme === 'dark' ? t('nav.lightMode', 'Light Mode') : t('nav.darkMode', 'Dark Mode')}
            aria-label="Toggle Dark/Light Mode"
            style={{ flexShrink: 0 }}
          >
            {rippleKey > 0 && <span key={rippleKey} className="theme-click-pulse" />}
            <div className="theme-toggle-stage">
              {mounted && theme === 'light' ? (
                <div key={`sun-${rippleKey}`} className="theme-motion-sun">
                  <Sun size={18} />
                </div>
              ) : (
                <div key={`moon-${rippleKey}`} className="theme-motion-moon">
                  <Moon size={17} />
                  <span className="theme-motion-star" />
                </div>
              )}
            </div>
          </button>

          {/* User Auth Section */}
          {user ? (
            /* User is logged in: Touch / Click on Name opens Dashboard & Logout Dropdown */
            <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                className="nav-user-btn"
                onClick={() => setUserDropdownOpen(prev => !prev)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  borderRadius: '10px',
                  background: userDropdownOpen 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)' 
                    : 'var(--btn-secondary-bg)',
                  border: userDropdownOpen 
                    ? '1px solid var(--primary)' 
                    : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  whiteSpace: 'nowrap',
                  boxShadow: userDropdownOpen ? '0 0 12px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{user.avatar || '👤'}</span>
                <span className="nav-user-text" style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '700', 
                  maxWidth: '140px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user.name}
                </span>
                <ChevronDown 
                  size={14} 
                  color="var(--text-muted)" 
                  style={{ 
                    transition: 'transform 0.2s ease', 
                    transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
                  }} 
                />
              </button>

              {/* Floating Glass Dropdown Menu on Touch / Click */}
              {userDropdownOpen && (
                <div 
                  className="glass-panel dropdown-fade-in" 
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    minWidth: '260px',
                    padding: '14px',
                    borderRadius: '14px',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35), 0 0 0 1px var(--border-subtle)',
                    zIndex: 100
                  }}
                >
                  {/* User Profile Card Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      flexShrink: 0
                    }}>
                      {user.avatar || '👤'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '800', 
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        @{user.username}
                      </div>
                      <div style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: '700', 
                        color: 'var(--primary)',
                        marginTop: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {user.committee || (user.role === 'admin' ? 'Central Committee' : 'Member')}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Action Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Dashboard Button */}
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.12)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        color: 'var(--primary)',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <LayoutDashboard size={16} style={{ flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{t('nav.admin', 'Open Dashboard')}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '500' }}>
                          {language === 'km' ? 'គ្រប់គ្រងព្រឹត្តិការណ៍ គណៈកម្មការ & ការកំណត់' : language === 'zh' ? '管理活动、委员会与系统设置' : 'Manage events, members & settings'}
                        </span>
                      </div>
                    </Link>

                    {/* Submit Event Shortcut */}
                    <Link
                      href="/submit"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: '1px solid transparent',
                        color: 'var(--text-main)',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <PlusCircle size={15} color="#06b6d4" style={{ flexShrink: 0 }} />
                      <span>{t('nav.submitEvent', 'Submit Event Proposal')}</span>
                    </Link>

                    <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                    {/* Logout Button */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <LogOut size={15} style={{ flexShrink: 0 }} />
                      <span>{t('nav.logout', 'Log Out')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* User is not logged in: Single-line Sign In Button */
            <Link
              href="/login"
              className="btn btn-primary btn-sm nav-signin-btn"
              style={{ 
                fontWeight: '700', 
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px'
              }}
            >
              <LogIn size={14} style={{ flexShrink: 0 }} />
              <span className="nav-signin-text">{t('nav.signIn', 'Sign In')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
