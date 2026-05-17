import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTablaPlatos() {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-fondo">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-fondo-card rounded-xl overflow-hidden border border-borde/40"
          >
            <div className="aspect-[16/10] bg-fondo-oscuro/40" />
            <div className="p-3.5 pt-3 space-y-2.5">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between items-center pt-2 border-t border-borde/20">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="w-7 h-7 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
