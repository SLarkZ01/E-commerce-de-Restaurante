import { obtenerPerfiles } from "@/lib/acciones/admin";
import { GestionPersonal, SkeletonGestionPersonal } from "@/components/admin/gestionPersonal";
import { Suspense } from "react";

export default async function PaginaPersonal() {
  const perfiles = await obtenerPerfiles();

  return (
    <div className="flex-1 overflow-y-auto">
      <Suspense fallback={<SkeletonGestionPersonal />}>
        <GestionPersonal perfilesIniciales={perfiles} />
      </Suspense>
    </div>
  );
}
