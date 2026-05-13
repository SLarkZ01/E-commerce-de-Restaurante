import { obtenerMesas } from "@/lib/acciones/admin";
import { GestionMesas, SkeletonGestionMesas } from "@/components/admin/gestionMesas";
import { Suspense } from "react";

export default async function PaginaMesas() {
  const mesas = await obtenerMesas();

  return (
    <div className="flex-1 overflow-y-auto">
      <Suspense fallback={<SkeletonGestionMesas />}>
        <GestionMesas mesasIniciales={mesas} />
      </Suspense>
    </div>
  );
}
