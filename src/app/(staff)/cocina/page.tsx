import { obtenerTodosPedidosConImagenes, obtenerStatsCocina } from "@/lib/acciones/cocina";
import { KanbanPedidos, SkeletonKanban } from "@/components/cocina/kanbanPedidos";
import { StatsBar, SkeletonStatsBar } from "@/components/cocina/statsBar";
import { Suspense } from "react";

export default async function PaginaCocina() {
  const [pedidos, stats] = await Promise.all([
    obtenerTodosPedidosConImagenes(),
    obtenerStatsCocina(),
  ]);

  return (
    <>
      <Suspense fallback={<SkeletonStatsBar />}>
        <StatsBar stats={stats} />
      </Suspense>

      <Suspense fallback={<SkeletonKanban />}>
        <KanbanPedidos pedidosIniciales={pedidos} />
      </Suspense>
    </>
  );
}
