'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = {
  variant: {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/30 active:scale-[0.98]',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-900/30 active:scale-[0.98]',
    outline: 'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white active:scale-[0.98]',
    ghost: 'text-slate-300 hover:bg-slate-800/60 hover:text-white',
    link: 'text-blue-400 underline-offset-4 hover:underline p-0 h-auto',
    bilateral: 'bg-gradient-to-r from-[#c8102e] to-[#1d4ed8] text-white shadow-lg shadow-red-900/30 hover:opacity-95 active:scale-[0.98]',
  },
  size: {
    default: 'h-11 min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-xl',
    sm: 'h-9 min-h-[36px] px-3.5 py-1.5 text-xs font-semibold rounded-lg',
    lg: 'h-12 min-h-[48px] px-8 text-base font-bold rounded-xl',
    icon: 'h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center p-0',
  },
};

export const Button = React.forwardRef(function Button(
  {
    className,
    variant = 'default',
    size = 'default',
    isLoading = false,
    disabled = false,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const variantClass = buttonVariants.variant[variant] || buttonVariants.variant.default;
  const sizeClass = buttonVariants.size[size] || buttonVariants.size.default;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060911]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none cursor-pointer',
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
