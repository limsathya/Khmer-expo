import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="p-5 bg-red-50 dark:bg-red-950/40 rounded-full">
        <AlertTriangle className="h-16 w-16 text-red-500" />
      </div>
      <div>
        <h1 className="text-7xl font-black text-slate-200 dark:text-slate-700">404</h1>
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mt-2">{t("notfound")}</p>
        <p className="text-muted-foreground mt-1 text-sm">The page you're looking for doesn't exist.</p>
      </div>
      <Button asChild>
        <Link to="/">← Go back home</Link>
      </Button>
    </div>
  );
}
