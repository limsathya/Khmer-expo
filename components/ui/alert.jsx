import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const alertVariants = {
  default: 'border-blue-500/30 bg-blue-950/30 text-blue-200',
  destructive: 'border-red-500/30 bg-red-950/30 text-red-200',
  success: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200',
  warning: 'border-amber-500/30 bg-amber-950/30 text-amber-200',
};

const iconMap = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
};

export const Alert = React.forwardRef(function Alert(
  { className, variant = 'default', children, ...props },
  ref
) {
  const IconComponent = iconMap[variant] || Info;
  const variantClass = alertVariants[variant] || alertVariants.default;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-xl border p-4 text-sm flex items-start gap-3',
        variantClass,
        className
      )}
      {...props}
    >
      <IconComponent className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">{children}</div>
    </div>
  );
});
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef(function AlertTitle({ className, ...props }, ref) {
  return (
    <h5
      ref={ref}
      className={cn('mb-1 font-semibold leading-none tracking-tight text-white', className)}
      {...props}
    />
  );
});
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef(function AlertDescription({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('text-xs leading-relaxed text-slate-300', className)}
      {...props}
    />
  );
});
AlertDescription.displayName = 'AlertDescription';
