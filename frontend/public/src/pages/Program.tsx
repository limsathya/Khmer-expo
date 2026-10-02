import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, ArrowRight, Users } from "lucide-react";
import { EVENTS, typeVariant, type EventType } from "@/data/events";

type Filter = "All" | EventType;

const FILTERS: Filter[] = ["All", "Keynote", "Workshop", "Panel", "Networking", "Ceremony"];

export default function Program() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("All");

  const visible = filter === "All" ? EVENTS : EVENTS.filter((e) => e.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("program.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("program.subtitle")}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className="rounded-full"
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="text-muted-foreground text-center py-8">{t("register.noSessions")}</p>
        )}
        {visible.map((row, i) => {
          const lowSeats = row.remaining < 20;
          const full = row.remaining === 0;
          return (
            <Card
              key={row.id}
              className="transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{
                animation: "progIn 0.4s ease-out both",
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  <div className="flex items-center gap-3 sm:w-44 shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{row.time}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {row.room}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{row.name}</p>
                      <Badge variant={typeVariant[row.type]}>{row.type}</Badge>
                      {lowSeats && !full && (
                        <Badge variant="destructive" className="text-[10px]">
                          {t("register.seatsLeft", { count: row.remaining })}
                        </Badge>
                      )}
                      {full && (
                        <Badge variant="outline" className="text-[10px]">{t("register.soldOut")}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{row.description}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {t("register.seatsAvailable", { remaining: row.remaining, capacity: row.capacity })}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Button
                      asChild={!full}
                      size="sm"
                      disabled={full}
                      className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      {full ? (
                        <span>{t("register.soldOut")}</span>
                      ) : (
                        <Link to={`/register?event=${row.id}`}>
                          {t("register.registerBtn")} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <style>{`
        @keyframes progIn {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}