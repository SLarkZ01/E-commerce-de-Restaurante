import { obtenerTodosPlatos } from "@/lib/acciones/catalogo";
import { obtenerCategorias } from "@/lib/acciones/categorias";
import { TablaPlatos, SkeletonTablaPlatos } from "@/components/cocina/tablaPlatos";
import { Suspense } from "react";

export default function PaginaPlatos() {
  return (
    <Suspense fallback={<SkeletonTablaPlatos />}>
      <ContenidoTablaPlatos />
    </Suspense>
  );
}

async function ContenidoTablaPlatos() {
  const [platos, categorias] = await Promise.all([
    obtenerTodosPlatos(),
    obtenerCategorias(),
  ]);
  return <TablaPlatos platosIniciales={platos} categorias={categorias} />;
}
