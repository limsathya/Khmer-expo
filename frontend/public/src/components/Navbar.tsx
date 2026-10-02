import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, User, LogOut, ChevronDown, ShieldCheck, ExternalLink, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthContext";
import { useTheme } from "@/theme/ThemeContext";

const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL as string | undefined) || "http://localhost:5174";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "km", label: "ខ្មែរ" },
  { code: "zh", label: "中文" },
];

const NAV = [
  { to: "/",        key: "home"    },
  { to: "/about",   key: "about"   },
  { to: "/program", key: "program" },
  { to: "/faq",     key: "faq"     },
  { to: "/contact", key: "contact" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { member, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const initials = member
    ? member.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out",
          "animate-[navbarSlide_0.6s_ease-out_both]",
          scrolled
            ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 shadow-sm"
            : "bg-white/55 dark:bg-slate-950/55 backdrop-blur-md border-b border-transparent dark:border-transparent"
        )}
        style={{
          animation: "navbarSlide 0.6s ease-out both",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-lg tracking-tight transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm shadow-md">
              🌐
            </span>
            <span>Expo</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {t(`nav.${item.key}`)}
                  <span
                    className={cn(
                      "absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400 transition-all duration-300",
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-slate-100/70 dark:bg-slate-800/70 p-0.5">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => i18n.changeLanguage(code)}
                  className={cn(
                    "h-7 px-2.5 text-xs font-medium rounded-full transition-all duration-200",
                    i18n.language === code
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={toggle}
              title={t("nav.themeToggle")}
              aria-label={t("nav.themeToggle")}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:rotate-12"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {member ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold">
                    {initials}
                  </span>
                  <span className="hidden md:inline text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                    {member.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-500 dark:text-slate-400 transition-transform",
                      menuOpen && "rotate-180"
                    )}
                  />
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 top-12 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-1"
                    style={{ animation: "menuFade 0.15s ease-out both" }}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{member.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <User className="h-4 w-4" /> {t("nav.account")}
                    </Link>
                    <a
                      href={ADMIN_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> {t("nav.adminDashboard")}
                      <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
                    </a>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                    >
                      <LogOut className="h-4 w-4" /> {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button asChild size="sm" className="hidden md:inline-flex rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm">
                  <Link to="/register">{t("nav.register")}</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex rounded-full">
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
              </>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className="lg:hidden border-t border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl"
            style={{ animation: "mobileSlide 0.25s ease-out both" }}
          >
            <div className="px-4 py-3 space-y-1">
              {NAV.map((item) => {
                const isActive =
                  item.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                );
              })}
              {!member && (
                <>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  >
                    {t("nav.register")}
                  </Link>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  >
                    {t("nav.login")}
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                {LANGS.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => i18n.changeLanguage(code)}
                    className={cn(
                      "h-7 px-2.5 text-xs font-medium rounded-full transition-all",
                      i18n.language === code
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="h-16" />

      <style>{`
        @keyframes navbarSlide {
          0%   { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0);     opacity: 1; }
        }
        @keyframes menuFade {
          0%   { opacity: 0; transform: translateY(-4px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes mobileSlide {
          0%   { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
