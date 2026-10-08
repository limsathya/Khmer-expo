import * as React from 'react';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef(function Label(
  { className, required = false, children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={cn(
        'text-xs sm:text-sm font-semibold text-slate-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none inline-flex items-center gap-1',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {required && <span className="text-red-400 font-bold" aria-hidden="true">*</span>}
    </label>
  );
});

Label.displayName = 'Label';
