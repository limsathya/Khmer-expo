import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, CalendarDays, UserPlus, ArrowRight } from "lucide-react";

// Animated counter hook
function useCounter(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function CounterCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const count = useCounter(value);
  return (
    <div className="text-center">
      <p className="text-4xl font-black tabular-nums">{count}{suffix}</p>
      <p className="text-sm text-slate-300 mt-1">{label}</p>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    { key: "card1", to: "/program",  icon: Image,        desc: "Explore our featured exhibition highlights and galleries." },
    { key: "card2", to: "/program",  icon: CalendarDays, desc: "Check the full schedule of upcoming sessions and events." },
    { key: "card3", to: "/register", icon: UserPlus,     desc: "Register now to secure your spot at Expo 2026." },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white p-10 overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{t("home.title")}</h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl">{t("home.subtitle")}</p>
          <div className="flex gap-3 flex-wrap">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0">
              <Link to="/register">{t("nav.register")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 bg-white/5">
              <Link to="/program">{t("nav.program")}</Link>
            </Button>
          </div>
        </div>
        {/* Animated stats strip */}
        <div className="relative z-10 mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4">
          <CounterCard value={50}   suffix="+" label="Events Hosted" />
          <CounterCard value={10000} suffix="+" label="Visitors"     />
          <CounterCard value={30}   suffix="+" label="Countries"     />
        </div>
      </div>

      {/* Feature cards with hover interaction */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map(({ key, to, icon: Icon, desc }) => (
            <Card
              key={key}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onMouseEnter={() => setHoveredCard(key)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ transform: hoveredCard === key ? "translateY(-4px)" : "none" }}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 rounded-md transition-colors">
                  <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
                <CardTitle className="text-base">{t(`home.${key}`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{desc}</p>
                <Button asChild size="sm" variant="outline" className="group-hover:border-blue-300 group-hover:text-blue-600 transition-colors">
                  <Link to={to}>Learn more <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
