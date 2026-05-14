import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTablaPlatos() {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-fondo-card rounded-xl border border-borde/60 overflow-hidden"
          >
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-px w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
