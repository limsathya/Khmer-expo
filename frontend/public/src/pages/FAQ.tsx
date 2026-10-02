import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_KEYS = ["q1", "q2", "q3", "q4"] as const;

export default function FAQ() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<string | null>("q1");
  const [search, setSearch] = useState("");

  const filtered = FAQ_KEYS.filter(k =>
    t(`faq.${k}`).toLowerCase().includes(search.toLowerCase()) ||
    t(`faq.${k.replace("q", "a")}`).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("faq.title")}</h1>
        <p className="text-muted-foreground mt-1">Find answers to common questions.</p>
      </div>

      {/* Searchable */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {filtered.length === 0 ? "No results" : `${filtered.length} question${filtered.length > 1 ? "s" : ""}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Try a different search term.</p>
          ) : filtered.map((qk, idx) => {
            const ak = qk.replace("q", "a");
            const isOpen = open === qk;
            return (
              <div key={qk} className={cn(idx !== 0 && "border-t")}>
                <button
                  onClick={() => setOpen(isOpen ? null : qk)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors group"
                >
                  <span className={cn("font-medium text-sm transition-colors", isOpen && "text-primary")}>
                    {t(`faq.${qk}`)}
                  </span>
                  <span className="shrink-0 ml-4">
                    {isOpen
                      ? <ChevronUp className="h-4 w-4 text-primary" />
                      : <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />}
                  </span>
                </button>
                <div className={cn(
                  "overflow-hidden transition-all duration-200",
                  isOpen ? "max-h-40" : "max-h-0"
                )}>
                  <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {t(`faq.${ak}`)}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
