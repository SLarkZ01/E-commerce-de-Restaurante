import { obtenerPedidosListosConDetalles } from "@/lib/acciones/cocina";
import { ListaEntregas, SkeletonListaEntregas } from "@/components/logistica/listaEntregas";
import { Suspense } from "react";

export default function PaginaLogistica() {
  return (
    <Suspense fallback={<SkeletonListaEntregas />}>
      <ContenidoEntregas />
    </Suspense>
  );
}

async function ContenidoEntregas() {
  const pedidosListos = await obtenerPedidosListosConDetalles();
  return <ListaEntregas pedidosIniciales={pedidosListos} />;
}
