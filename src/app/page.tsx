import { obtenerPlatosDisponibles } from "@/lib/acciones/platos";
import { CatalogoPlatos, SkeletonCatalogo } from "@/components/cliente/catalogoPlatos";
import { BarraSuperior } from "@/components/cliente/barraSuperior";
import { CarritoSheet } from "@/components/cliente/carritoSheet";
import { Suspense } from "react";

export default async function PaginaInicio() {
  const { platos, categorias } = await obtenerPlatosDisponibles();

  return (
    <div className="flex flex-col min-h-dvh bg-fondo">
      <BarraSuperior />
      <Suspense fallback={<SkeletonCatalogo />}>
          <CatalogoPlatos
            platos={platos}
            categorias={categorias}
          />
      </Suspense>
      <CarritoSheet mesaUuid={null} />
    </div>
  );
}
