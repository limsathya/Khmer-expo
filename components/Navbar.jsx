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
  ShieldCheck,
  Building2,
  MapPin,
  Award,
  FileText,
  Image,
  Info,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const { expoConfig, getExpoName, getExpoShortName } = useSettings();
  
  const [rippleKey, setRippleKey] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Full International Official Navigation Suite
  const navLinks = [
    { 
      href: '/about', 
      label: language === 'km' ? 'អំពីពិព័រណ៍' : language === 'zh' ? '关于博览会' : 'About', 
      icon: Info 
    },
    { 
      href: '/program', 
      label: language === 'km' ? 'កម្មវិធី' : language === 'zh' ? '活动日程' : 'Program', 
      icon: Calendar 
    },
    { 
      href: '/exhibitors', 
      label: language === 'km' ? 'អ្នកតាំងពិព័រណ៍' : language === 'zh' ? '参展商' : 'Exhibitors', 
      icon: Building2 
    },
    { 
      href: '/speakers', 
      label: language === 'km' ? 'វាគ្មិន' : language === 'zh' ? '主讲嘉宾' : 'Speakers', 
      icon: Award 
    },
    { 
      href: '/committees', 
      label: language === 'km' ? 'គណៈកម្មការ' : language === 'zh' ? '组委会' : 'Committees', 
      icon: Users 
    },
    { 
      href: '/venue', 
      label: language === 'km' ? 'ទីតាំង & ស្តង់' : language === 'zh' ? '展馆导览' : 'Venue', 
      icon: MapPin 
    },
    { 
      href: '/news', 
      label: language === 'km' ? 'ព័ត៌មាន' : language === 'zh' ? '新闻动态' : 'News', 
      icon: FileText 
    },
    { 
      href: '/gallery', 
      label: language === 'km' ? 'វិចិត្រសាល' : language === 'zh' ? '媒体图库' : 'Gallery', 
      icon: Image 
    },
  ];

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    router.push('/');
  };

  return (
    <header className="glass-header sticky top-0 z-50 w-full backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Logo & Title */}
          <Link 
            href="/" 
            className="flex items-center gap-3 shrink-0 no-underline group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-700 to-red-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-900/40 group-hover:scale-105 transition-transform">
              🇰🇭
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base text-[var(--text-main)] tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                {getExpoName(language)}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Kunming 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex nav-menu shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${
                    isActive 
                      ? 'text-white bg-blue-600/20 border border-blue-500/30' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={13} className={`self-center shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="leading-none">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Suite */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* CTA Button: Register Now */}
            <Link
              href="/registration"
              className="btn-register"
            >
              <UserCheck size={14} className="shrink-0" />
              <span className="hidden sm:inline">
                {language === 'km' ? 'ចុះឈ្មោះចូលរួម' : language === 'zh' ? '参会注册' : 'REGISTER NOW'}
              </span>
              <span className="sm:hidden">
                {language === 'km' ? 'ចុះឈ្មោះ' : language === 'zh' ? '注册' : 'REGISTER'}
              </span>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Dark / Light / System Theme Switcher */}
            <ThemeSwitcher />

            {/* User Profile or Admin Link */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                  aria-label={`User menu for ${user.name}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 min-h-[40px] rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="text-sm">{user.avatar || '👤'}</span>
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">{user.name}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <div className="font-bold text-white text-xs truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">@{user.username}</div>
                    </div>
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-blue-400 hover:bg-blue-900/20 transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span>{t('nav.admin', 'Admin Dashboard')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-900/20 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>{t('nav.logout', 'Log Out')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 min-h-[40px] rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <LogIn size={13} />
                <span>{t('nav.signIn', 'Sign In')}</span>
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="xl:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav id="mobile-nav-drawer" aria-label="Mobile Navigation" className="xl:hidden border-t border-[var(--border-subtle)] bg-[var(--header-bg)] px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'text-white bg-blue-600/20 border border-blue-500/30' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <Link
              href="/registration"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-blue-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              {language === 'km' ? 'ចុះឈ្មោះចូលរួម (Register Now)' : language === 'zh' ? '立即在线注册 (Register)' : 'Register for Expo 2026'}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
