import { obtenerPlatosDisponibles } from "@/lib/acciones/platos";
import { obtenerMesaPorUuid } from "@/lib/acciones/pago";
import { CatalogoPlatos, SkeletonCatalogo } from "@/components/cliente/catalogoPlatos";
import { BarraMesa } from "@/components/cliente/barraMesa";
import { CarritoSheet } from "@/components/cliente/carritoSheet";
import { WompiProvider } from "@/components/cliente/WompiProvider";
import { WompiModalProvider } from "@/components/cliente/WompiModalContext";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MesaLayout } from "@/components/cliente/MesaLayout";

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
    <WompiProvider>
      <WompiModalProvider>
        <MesaLayout>
          <BarraMesa numeroMesa={mesa.numero} />
          <Suspense fallback={<SkeletonCatalogo />}>
            <CatalogoPlatos
              platos={datosCatalogo.platos}
              categorias={datosCatalogo.categorias}
            />
          </Suspense>
          <CarritoSheet mesaUuid={uuid} />
        </MesaLayout>
      </WompiModalProvider>
    </WompiProvider>
  );
}
