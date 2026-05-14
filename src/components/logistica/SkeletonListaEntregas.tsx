import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonListaEntregas() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border-2 border-borde/60 p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="w-28 h-6 rounded-full" />
              <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="w-20 h-7" />
            <Skeleton className="w-full h-px" />
            <div className="flex justify-between">
              <Skeleton className="w-10 h-4" />
              <Skeleton className="w-20 h-5" />
            </div>
            <Skeleton className="w-full h-11 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
