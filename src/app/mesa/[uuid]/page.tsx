import { obtenerPlatosDisponibles } from "@/lib/acciones/platos";
import { obtenerMesaPorUuid } from "@/lib/acciones/pago";
import { CatalogoPlatos, SkeletonCatalogo } from "@/components/cliente/catalogoPlatos";
import { BarraMesa } from "@/components/cliente/barraMesa";
import { CarritoSheet } from "@/components/cliente/carritoSheet";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function PaginaMesa({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const [datosCatalogo, mesa] = await Promise.all([
    obtenerPlatosDisponibles(),
    obtenerMesaPorUuid(uuid),
  ]);

  if (!mesa) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-dvh bg-fondo">
      <BarraMesa numeroMesa={mesa.numero} />
      <Suspense fallback={<SkeletonCatalogo />}>
          <CatalogoPlatos
            platos={datosCatalogo.platos}
            categorias={datosCatalogo.categorias}
          />
      </Suspense>
      <CarritoSheet mesaUuid={uuid} />
    </div>
  );
}
