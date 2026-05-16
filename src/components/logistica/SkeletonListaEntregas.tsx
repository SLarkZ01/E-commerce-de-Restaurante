import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonListaEntregas() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-fondo-card rounded-xl border-2 border-borde/60 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="w-16 h-5 rounded-full" />
                <Skeleton className="w-12 h-4" />
              </div>
              <Skeleton className="w-20 h-6" />
              <div className="flex gap-1.5">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
              <Skeleton className="w-full h-px" />
              <div className="flex justify-between">
                <Skeleton className="w-10 h-4" />
                <Skeleton className="w-16 h-5" />
              </div>
              <Skeleton className="w-full h-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
