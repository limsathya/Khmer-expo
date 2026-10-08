import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard utility function for conditionally combining Tailwind CSS classes.
 * Compatible with shadcn/ui components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
