import { obtenerTodosPedidosConImagenes, obtenerStatsCocina } from "@/lib/acciones/cocina";
import { KanbanPedidos, SkeletonKanban } from "@/components/cocina/kanbanPedidos";
import { StatsBar, SkeletonStatsBar } from "@/components/cocina/statsBar";
import { Suspense } from "react";

export default function PaginaCocina() {
  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)]">
      <Suspense fallback={<SkeletonStatsBar />}>
        <ContenidoStatsBar />
      </Suspense>

      <Suspense fallback={<SkeletonKanban />}>
        <ContenidoKanban />
      </Suspense>
    </div>
  );
}

async function ContenidoStatsBar() {
  const stats = await obtenerStatsCocina();
  return <StatsBar stats={stats} />;
}

async function ContenidoKanban() {
  const pedidos = await obtenerTodosPedidosConImagenes();
  return <KanbanPedidos pedidosIniciales={pedidos} />;
}
