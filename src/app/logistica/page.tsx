import { obtenerPedidosPorEstado } from "@/lib/acciones/cocina";
import { crearCliente } from "@/lib/supabase/server";
import { ListaEntregas, SkeletonListaEntregas } from "@/components/logistica/listaEntregas";
import { SidebarCocina } from "@/components/cocina/sidebarCocina";
import { HeaderCocina } from "@/components/cocina/headerCocina";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function PaginaLogistica() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const pedidosListos = await obtenerPedidosPorEstado("listo");

  return (
    <div className="flex min-h-dvh bg-fondo">
      <SidebarCocina userEmail={user.email ?? ""} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderCocina titulo="Platos Listos" userEmail={user.email ?? ""} />

        <Suspense fallback={<SkeletonListaEntregas />}>
          <ListaEntregas pedidosIniciales={pedidosListos} />
        </Suspense>
      </div>
    </div>
  );
}
