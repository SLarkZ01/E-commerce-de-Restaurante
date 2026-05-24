import { obtenerPerfiles } from "@/lib/acciones/admin";
import { GestionPersonal, SkeletonGestionPersonal } from "@/components/admin/gestionPersonal";
import { Suspense } from "react";

export default function PaginaPersonal() {
  return (
    <Suspense fallback={<SkeletonGestionPersonal />}>
      <ContenidoPersonal />
    </Suspense>
  );
}

async function ContenidoPersonal() {
  const perfiles = await obtenerPerfiles();
  return <GestionPersonal perfilesIniciales={perfiles} />;
}
