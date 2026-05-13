import { obtenerTodosPlatos } from "@/lib/acciones/catalogo";
import { obtenerPlatosDisponibles } from "@/lib/acciones/platos";
import { TablaPlatos, SkeletonTablaPlatos } from "@/components/cocina/tablaPlatos";
import { Suspense } from "react";

export default async function PaginaPlatos() {
  const [platos, { categorias }] = await Promise.all([
    obtenerTodosPlatos(),
    obtenerPlatosDisponibles(),
  ]);

  return (
    <Suspense fallback={<SkeletonTablaPlatos />}>
      <TablaPlatos platosIniciales={platos} categorias={categorias} />
    </Suspense>
  );
}
