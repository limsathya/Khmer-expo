import { useEffect } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Heart,
  Ticket,
  Award,
  LogOut,
  Mail,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL as string | undefined) || "http://localhost:5174";

export default function Account() {
  const { t } = useTranslation();
  const { member, logout } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const signupMode = params.get("signup") === "1";

  useEffect(() => {
    document.title = signupMode
      ? `${t("account.welcome")} — Expo`
      : `${t("nav.account")} — Expo`;
  }, [signupMode, t]);

  if (!member) return <Navigate to="/login" replace />;

  const stats = [
    { icon: Ticket,     label: t("account.tickets"),     value: "3"  },
    { icon: CalendarDays,label: t("account.upcoming"),   value: "5"  },
    { icon: Heart,      label: t("account.favorites"),   value: "12" },
    { icon: Award,      label: t("account.points"),      value: "480"},
  ];

  const activities = [
    { icon: CalendarDays, text: "Reserved seat — Keynote: Innovation", time: "2 days ago" },
    { icon: Ticket,       text: "Picked up visitor badge #EX-2026-0142", time: "1 week ago" },
    { icon: Award,        text: "Earned 50 points for attending workshop", time: "2 weeks ago" },
  ];

  return (
    <div className="space-y-6">
      {signupMode && (
        <div
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 shadow-lg"
          style={{ animation: "bannerIn 0.5s ease-out both" }}
        >
          <p className="font-semibold">🎉 {t("account.welcomeMsg")}</p>
          <p className="text-sm text-white/90 mt-1">{t("account.welcomeSub")}</p>
        </div>
      )}

      <div
        className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white p-6 sm:p-8 overflow-hidden relative"
        style={{ animation: "cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/50">
              {member.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-200/80">
                {t("account.memberSince")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-0.5">{member.name}</h1>
              <p className="text-sm text-slate-300 flex items-center gap-1 mt-1">
                <Mail className="h-3.5 w-3.5" /> {member.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
            >
              <a href={ADMIN_URL} target="_blank" rel="noreferrer">
                <ShieldCheck className="h-4 w-4 mr-2" />
                {t("nav.adminDashboard")}
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("nav.logout")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card
            key={s.label}
            style={{
              animation: `statIn 0.4s ease-out both`,
              animationDelay: `${0.1 + i * 0.08}s`,
            }}
          >
            <CardContent className="pt-6 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-black tabular-nums">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <s.icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card style={{ animation: "cardIn 0.5s ease-out 0.3s both" }}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("account.recentActivity")}
          </CardTitle>
          <CardDescription>{t("account.activitySub")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Separator />
          {activities.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              style={{
                animation: `rowIn 0.4s ease-out both`,
                animationDelay: `${0.5 + i * 0.08}s`,
              }}
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-full shrink-0">
                <a.icon className="h-4 w-4 text-blue-600" />
              </div>
              <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">{a.text}</p>
              <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <style>{`
        @keyframes bannerIn {
          0%   { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes statIn {
          0%   { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes rowIn {
          0%   { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}