"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ShellSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-fondo">
      <div className="hidden md:flex w-[260px] bg-fondo border-r border-borde/60 flex-col shrink-0 h-dvh sticky top-0 p-5 gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <Skeleton className="w-24 h-6" />
        </div>
        <Skeleton className="w-full h-px" />
        <div className="flex-1 space-y-3 pt-2">
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-2/3 h-10 rounded-lg" />
        </div>
        <Skeleton className="w-full h-px" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="w-24 h-3.5" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-fondo/95 backdrop-blur-sm border-b border-borde/60">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5" />
            <div className="space-y-1.5">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
