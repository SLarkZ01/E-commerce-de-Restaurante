import { Skeleton } from "@/components/ui/skeleton";

export function EntregaCardSkeleton() {
  return (
    <div className="bg-fondo-card rounded-xl border-2 border-borde/60 overflow-hidden">
      <div className="h-1 bg-fondo-oscuro" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="w-28 h-9 rounded-xl" />
          <Skeleton className="w-14 h-4" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-5/6 h-4" />
        </div>
        <Skeleton className="w-full h-px" />
        <div className="flex justify-between">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-20 h-5" />
        </div>
        <Skeleton className="w-full h-11 rounded-xl" />
      </div>
    </div>
  );
}
