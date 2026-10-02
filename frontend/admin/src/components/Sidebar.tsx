import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/theme/ThemeContext";

const navItems = [
  { to: "/",              label: "Dashboard",     icon: LayoutDashboard, end: true  },
  { to: "/registrations", label: "Registrations", icon: ClipboardList,   end: false },
];

export default function Sidebar() {
  const { theme, toggle } = useTheme();

  return (
    <aside className="w-56 min-h-screen bg-slate-900 dark:bg-slate-950 text-slate-100 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5">
        <span className="text-lg font-bold tracking-tight">⚡ Expo Admin</span>
      </div>
      <Separator className="bg-slate-700 dark:bg-slate-800" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-700 dark:bg-slate-800 text-white"
                  : "text-slate-400 dark:text-slate-500 hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Separator className="bg-slate-700 dark:bg-slate-800" />
      <div className="px-6 py-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">v1.0.0</span>
        <button
          onClick={toggle}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          aria-label="Toggle theme"
          className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
