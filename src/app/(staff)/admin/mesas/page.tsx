import { obtenerMesas } from "@/lib/acciones/admin";
import { GestionMesas, SkeletonGestionMesas } from "@/components/admin/gestionMesas";
import { Suspense } from "react";

export default function PaginaMesas() {
  return (
    <Suspense fallback={<SkeletonGestionMesas />}>
      <ContenidoMesas />
    </Suspense>
  );
}

async function ContenidoMesas() {
  const mesas = await obtenerMesas();
  return <GestionMesas mesasIniciales={mesas} />;
}
