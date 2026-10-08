import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8" role="status" aria-label="Loading page">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-16 w-full max-w-xl rounded-2xl" />
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-11 w-36 rounded-xl" />
          <Skeleton className="h-11 w-36 rounded-xl" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-lg mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
