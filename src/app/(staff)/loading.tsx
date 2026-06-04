import { Skeleton } from "@/components/ui/skeleton";

export default function CargandoStaff() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-40 h-4" />
      </div>
    </div>
  );
}
