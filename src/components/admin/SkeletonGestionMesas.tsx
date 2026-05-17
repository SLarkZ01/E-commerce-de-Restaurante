import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonGestionMesas() {
  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
        <Skeleton className="w-48 h-10" />
        <Skeleton className="w-32 h-10" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border border-borde/60 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-10 h-3" />
                <Skeleton className="w-16 h-6" />
              </div>
            </div>
            <Skeleton className="w-full h-8 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
