import { Skeleton } from "@/components/ui/skeleton";

export default function CargandoMesa() {
  return (
    <div className="min-h-dvh bg-fondo flex flex-col">
      <div className="sticky top-0 z-30 bg-fondo/95 backdrop-blur-sm border-b border-borde/60 px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-24 h-5" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <Skeleton className="w-full h-11 rounded-xl" />
        </div>

        <div className="px-4 pb-2">
          <div className="bg-fondo-oscuro/50 rounded-xl p-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-20 h-8 rounded-lg shrink-0" />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-24 lg:pb-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="bg-fondo-card rounded-xl border border-borde/40 overflow-hidden"
              >
                <Skeleton className="aspect-[3/2] rounded-none" />
                <div className="p-3.5 space-y-2.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
