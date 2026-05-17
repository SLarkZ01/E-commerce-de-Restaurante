import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function SkeletonKanban() {
  return (
    <div className="flex-1 flex flex-col md:flex-row gap-5 p-6 overflow-auto">
      {["Pendiente", "Preparando", "Listo"].map((estado) => (
        <Card
          key={estado}
          className="flex-1 min-w-0 md:min-w-[340px] md:max-w-[440px] flex flex-col border-borde/20 rounded-2xl shadow-sm"
        >
          <CardHeader className="pb-4 border-b border-borde/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-8 h-7 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card
                  key={i}
                  className="border-borde/30 rounded-2xl overflow-hidden shadow-sm"
                >
                  <Skeleton className="h-1.5 w-full" />
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex justify-between">
                      <Skeleton className="w-28 h-9 rounded-xl" />
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-14 h-4 mt-2" />
                  </CardHeader>
                  <CardContent className="pb-3 px-4">
                    <Skeleton className="w-full h-16 rounded-xl" />
                    <Skeleton className="w-full h-px my-3" />
                    <div className="flex justify-between">
                      <Skeleton className="w-10 h-4" />
                      <Skeleton className="w-20 h-5" />
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 pb-3 pt-1.5">
                    <Skeleton className="w-full h-10 rounded-lg" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
