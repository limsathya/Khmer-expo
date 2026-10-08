import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  secondary: 'bg-slate-800 text-slate-300 border-slate-700',
  destructive: 'bg-red-500/20 text-red-400 border-red-500/30',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  gold: 'bg-[#d4af37]/20 text-[#fbbf24] border-[#d4af37]/40',
  outline: 'text-slate-300 border-slate-700 bg-transparent',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  const variantClass = badgeVariants[variant] || badgeVariants.default;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
