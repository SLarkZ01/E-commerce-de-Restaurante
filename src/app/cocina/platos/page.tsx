import { obtenerTodosPlatos } from "@/lib/acciones/catalogo";
import { obtenerPlatosDisponibles } from "@/lib/acciones/platos";
import { TablaPlatos, SkeletonTablaPlatos } from "@/components/cocina/tablaPlatos";
import { SidebarCocina } from "@/components/cocina/sidebarCocina";
import { HeaderCocina } from "@/components/cocina/headerCocina";
import { crearCliente } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function PaginaPlatos() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [platos, { categorias }] = await Promise.all([
    obtenerTodosPlatos(),
    obtenerPlatosDisponibles(),
  ]);

  return (
    <div className="flex min-h-dvh bg-fondo">
      <SidebarCocina userEmail={user.email ?? ""} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderCocina titulo="Gestión de Menú" userEmail={user.email ?? ""} />

        <Suspense fallback={<SkeletonTablaPlatos />}>
          <TablaPlatos platosIniciales={platos} categorias={categorias} />
        </Suspense>
      </div>
    </div>
  );
}
