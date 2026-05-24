import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function SkeletonKanban() {
  return (
    <div className="flex-1 flex md:flex-row gap-3 md:gap-4 px-3 md:px-4 overflow-x-auto scrollbar-hide">
      {["Pendiente", "Preparando", "Listo"].map((estado) => (
        <div key={estado} className="snap-start shrink-0 w-[85vw] md:w-auto md:flex-1 h-full">
          <Card className="flex flex-col h-full border-borde/20 rounded-2xl shadow-sm">
            <CardHeader className="pb-3 pt-3.5 px-5 border-b border-borde/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <Skeleton className="w-8 h-7 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-3">
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
        </div>
      ))}
    </div>
  );
}
