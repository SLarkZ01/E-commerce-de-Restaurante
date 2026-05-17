import { obtenerTodosPlatos } from "@/lib/acciones/catalogo";
import { obtenerCategorias } from "@/lib/acciones/categorias";
import { TablaPlatos, SkeletonTablaPlatos } from "@/components/cocina/tablaPlatos";
import { Suspense } from "react";

export default async function PaginaPlatos() {
  const [platos, categorias] = await Promise.all([
    obtenerTodosPlatos(),
    obtenerCategorias(),
  ]);

  return (
    <Suspense fallback={<SkeletonTablaPlatos />}>
      <TablaPlatos platosIniciales={platos} categorias={categorias} />
    </Suspense>
  );
}
