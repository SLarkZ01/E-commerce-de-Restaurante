"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-fondo-card rounded-2xl border border-borde/60 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="size-10 rounded-xl" />
            </div>
            <Skeleton className="w-32 h-9" />
            <Skeleton className="w-40 h-3" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-48 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-[280px] rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-40 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-[280px] rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-48 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-[280px] rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-40 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-[280px] rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <div className="bg-fondo-card rounded-2xl border border-borde/60 overflow-hidden">
        <div className="px-6 py-5 border-b border-borde/60">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-48 h-4 mt-2" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-6">
              <Skeleton className="w-12 h-5" />
              <Skeleton className="w-20 h-5" />
              <Skeleton className="w-14 h-5" />
              <Skeleton className="w-24 h-5 ml-auto" />
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
