import { Skeleton } from "@/components/ui/skeleton";

export function EntregaCardSkeleton() {
  return (
    <div className="relative bg-fondo-card rounded-xl border border-borde/30 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-fondo-oscuro" />
      <div className="p-4 pl-5 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="w-16 h-7 rounded-lg" />
          <Skeleton className="w-14 h-4" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
        <Skeleton className="w-full h-px" />
        <div className="flex justify-between items-center">
          <Skeleton className="w-12 h-5" />
          <Skeleton className="w-20 h-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
