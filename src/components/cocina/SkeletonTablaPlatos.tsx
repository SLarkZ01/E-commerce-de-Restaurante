import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTablaPlatos() {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-fondo">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-fondo-card rounded-xl overflow-hidden border border-borde/50 shadow-sm"
          >
            <div className="p-4 pt-4 pb-0">
              <div className="flex items-start justify-between mb-3 px-1">
                <Skeleton className="w-7 h-7 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
              <div className="aspect-[4/3] rounded-xl bg-fondo-oscuro" />
            </div>
            <div className="p-4 pt-3 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <div className="flex justify-between items-center pt-3 border-t border-borde/30">
                <Skeleton className="h-6 w-24" />
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
