import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonGestionMesas() {
  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
        <Skeleton className="w-32 h-9" />
        <Skeleton className="w-24 h-9" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border border-borde/50 p-5 space-y-3">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-32 h-3" />
              </div>
            </div>
            <Skeleton className="w-full h-9 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
