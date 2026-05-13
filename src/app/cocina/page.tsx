import { obtenerPedidosConItems, obtenerStatsCocina } from "@/lib/acciones/cocina";
import { crearCliente } from "@/lib/supabase/server";
import { KanbanPedidos, SkeletonKanban } from "@/components/cocina/kanbanPedidos";
import { SidebarCocina } from "@/components/cocina/sidebarCocina";
import { HeaderCocina } from "@/components/cocina/headerCocina";
import { StatsBar, SkeletonStatsBar } from "@/components/cocina/statsBar";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function PaginaCocina() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [pedidos, stats] = await Promise.all([
    obtenerPedidosConItems(),
    obtenerStatsCocina(),
  ]);

  return (
    <div className="flex min-h-dvh bg-fondo">
      <SidebarCocina userEmail={user.email ?? ""} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderCocina titulo="Pedidos" userEmail={user.email ?? ""} />

        <Suspense fallback={<SkeletonStatsBar />}>
          <StatsBar stats={stats} />
        </Suspense>

        <Suspense fallback={<SkeletonKanban />}>
          <KanbanPedidos pedidosIniciales={pedidos} />
        </Suspense>
      </div>
    </div>
  );
}
