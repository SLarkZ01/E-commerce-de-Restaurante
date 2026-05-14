import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonGestionPersonal() {
  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
        <Skeleton className="w-36 h-10" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border border-borde/60 p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-11 h-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-28 h-5" />
                <Skeleton className="w-36 h-4" />
              </div>
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
