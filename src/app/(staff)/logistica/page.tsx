import { obtenerPedidosPorEstado } from "@/lib/acciones/cocina";
import { ListaEntregas, SkeletonListaEntregas } from "@/components/logistica/listaEntregas";
import { Suspense } from "react";

export default async function PaginaLogistica() {
  const pedidosListos = await obtenerPedidosPorEstado("listo");

  return (
    <Suspense fallback={<SkeletonListaEntregas />}>
      <ListaEntregas pedidosIniciales={pedidosListos} />
    </Suspense>
  );
}
