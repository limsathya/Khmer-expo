import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, Users, Award } from "lucide-react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, active, duration]);
  return value;
}

function StatCard({ icon: Icon, target, suffix, label, active }: {
  icon: React.ElementType; target: number; suffix: string; label: string; active: boolean;
}) {
  const count = useCounter(target, active);
  return (
    <Card className="text-center hover:shadow-md transition-shadow">
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Icon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
        </div>
        <p className="text-3xl font-black tabular-nums">{count}{suffix}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function About() {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  const stats = [
    { icon: Globe,  target: 50,   suffix: "+",  label: "Events Hosted" },
    { icon: Users,  target: 10000, suffix: "+", label: "Visitors"       },
    { icon: Award,  target: 2020, suffix: "",   label: "Founded"        },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("about.title")}</h1>
      </div>

      {/* Scroll-triggered animated stats */}
      <div ref={ref} className="grid grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} active={inView} />)}
      </div>

      {/* Story */}
      <Card>
        <CardHeader><CardTitle>Our Story</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p>{t("about.p1")}</p>
          <Separator />
          <p>{t("about.p2")}</p>
          <Separator />
          <p>{t("about.p3")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
