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
          className="flex-1 min-w-0 md:min-w-[340px] md:max-w-[440px] flex flex-col border-borde/60 rounded-2xl"
        >
          <CardHeader className="pb-4 bg-fondo-oscuro rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-6 h-5 rounded-full" />
            </div>
            <Skeleton className="w-24 h-3 mt-1" />
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card
                  key={i}
                  className="border-borde/60 border-l-4 border-l-fondo-oscuro rounded-xl"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <Skeleton className="w-20 h-6" />
                      <Skeleton className="w-14 h-5 rounded-full" />
                    </div>
                    <Skeleton className="w-16 h-4 mt-1" />
                  </CardHeader>
                  <CardContent className="pb-3 space-y-2">
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-1/2 h-5" />
                    <Skeleton className="w-full h-px" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="w-10 h-4" />
                      <Skeleton className="w-20 h-5" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3">
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
