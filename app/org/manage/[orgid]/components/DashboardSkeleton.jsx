import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 shadow-sm ${className}`}
    >
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:auto-rows-fr xl:grid-cols-12">
      <SkeletonCard className="h-full md:col-span-2 xl:col-span-8" />
      <SkeletonCard className="h-full xl:col-span-4" />
      <SkeletonCard className="h-full md:col-span-2 xl:col-span-6" />
      <SkeletonCard className="h-full md:col-span-2 xl:col-span-3 xl:row-span-2" />
      <SkeletonCard className="h-full md:col-span-2 xl:col-span-3" />
      <SkeletonCard className="h-full md:col-span-2 xl:col-span-6" />
      <SkeletonCard className="h-full md:col-span-2 xl:col-span-6" />
    </div>
  );
}

export default DashboardSkeleton;
