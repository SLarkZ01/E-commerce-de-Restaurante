import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCatalogo() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-1">
        <Skeleton className="w-full h-11 rounded-xl" />
      </div>
      <div className="flex gap-2 px-4 py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="w-20 h-8 rounded-full shrink-0" />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-fondo-card rounded-2xl border border-borde/60 overflow-hidden">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
