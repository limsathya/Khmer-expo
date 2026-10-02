import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const dims =
    size === "sm" ? "h-7 w-7 text-xs" :
    size === "lg" ? "h-10 w-10 text-base" :
                    "h-8 w-8 text-sm";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-blue-900/20",
        dims,
        className
      )}
    >
      <Sparkles className={cn(size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
    </span>
  );
}
