import { Skeleton } from "@/components/ui/skeleton";

export default function CargandoAsistente() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] bg-fondo overflow-hidden">
      <aside className="hidden md:flex w-64 xl:w-72 border-r border-borde/40 bg-fondo-card flex-col h-full shrink-0">
        <div className="px-3 py-3 border-b border-borde/40">
          <Skeleton className="w-28 h-5" />
        </div>
        <div className="mx-3 mt-3">
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
        <div className="flex-1 px-2 py-2 space-y-0.5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="w-full h-10 rounded-lg"
              style={{ opacity: Math.max(0.3, 1 - i * 0.2) }}
            />
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-fondo-oscuro/20">
        <div className="px-4 py-3 border-b border-borde/40 bg-fondo-card flex items-center gap-3">
          <Skeleton className="w-4 h-4 rounded md:hidden" />
          <div className="space-y-1">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-36 h-3" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2 flex flex-col items-center">
              <Skeleton className="w-36 h-6" />
              <Skeleton className="w-72 h-4" />
              <Skeleton className="w-56 h-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-borde/40 bg-fondo-card">
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
