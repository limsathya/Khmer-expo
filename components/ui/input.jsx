import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(function Input(
  { className, type = 'text', disabled = false, ...props },
  ref
) {
  return (
    <input
      type={type}
      ref={ref}
      disabled={disabled}
      className={cn(
        'flex h-11 min-h-[44px] w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white',
        'placeholder:text-slate-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060911]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
