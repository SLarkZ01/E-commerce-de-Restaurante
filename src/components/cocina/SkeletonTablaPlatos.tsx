import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTablaPlatos() {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-[#F7F8FC]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-[#C0C0C0] shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
          >
            <div className="p-4 pt-4 pb-0">
              <div className="flex items-start justify-between mb-3 px-1">
                <Skeleton className="w-7 h-7 rounded-xl" />
                <Skeleton className="w-8 h-8 rounded-xl" />
              </div>
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-r from-[#F1F5F9] via-[#E2E8F0] to-[#F1F5F9] bg-[length:200%_100%] animate-shimmer-skeleton" />
            </div>
            <div className="p-5 pt-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-6 w-24 rounded-full bg-[#F1F5F9]" />
              <div className="flex justify-between items-center pt-4 border-t border-[#F1F5F9]">
                <Skeleton className="h-8 w-28" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="w-9 h-9 rounded-xl bg-[#F1F5F9]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
