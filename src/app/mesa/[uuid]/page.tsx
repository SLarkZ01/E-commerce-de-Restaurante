import { obtenerPlatosDisponibles } from "@/lib/acciones/platos";
import { obtenerMesaPorUuid } from "@/lib/acciones/pago";
import { CatalogoPlatos, SkeletonCatalogo } from "@/components/cliente/catalogoPlatos";
import { BarraMesa } from "@/components/cliente/barraMesa";
import { CarritoSheet } from "@/components/cliente/carritoSheet";
import { CarritoSidebar } from "@/components/cliente/CarritoSidebar";
import { WompiProvider } from "@/components/cliente/WompiProvider";
import { WompiModalProvider } from "@/components/cliente/WompiModalContext";
import { RastrearPedidoProvider } from "@/components/cliente/RastrearPedidoProvider";
import { PagoExitoProvider } from "@/components/cliente/PagoExitoProvider";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { MesaLayout } from "@/components/cliente/MesaLayout";

const RastrearPedidoModal = dynamic(
  () => import("@/components/cliente/rastrearPedidoModal").then((m) => ({ default: m.RastrearPedidoModal }))
);

const PagoExitoModal = dynamic(
  () => import("@/components/cliente/PagoExitoModal").then((m) => ({ default: m.PagoExitoModal }))
);

export default async function PaginaMesa({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const mesa = await obtenerMesaPorUuid(uuid);

  if (!mesa) {
    notFound();
  }

  return (
    <WompiProvider>
      <WompiModalProvider>
        <RastrearPedidoProvider>
          <PagoExitoProvider>
            <MesaLayout carritoSidebar={<CarritoSidebar mesaUuid={uuid} />}>
              <BarraMesa numeroMesa={mesa.numero} />
              <Suspense fallback={<SkeletonCatalogo />}>
                <ContenidoCatalogo />
              </Suspense>
              <CarritoSheet mesaUuid={uuid} />
            </MesaLayout>
            <RastrearPedidoModal />
            <PagoExitoModal />
          </PagoExitoProvider>
        </RastrearPedidoProvider>
      </WompiModalProvider>
    </WompiProvider>
  );
}

async function ContenidoCatalogo() {
  const datosCatalogo = await obtenerPlatosDisponibles();
  return (
    <CatalogoPlatos
      platos={datosCatalogo.platos}
      categorias={datosCatalogo.categorias}
    />
  );
}
