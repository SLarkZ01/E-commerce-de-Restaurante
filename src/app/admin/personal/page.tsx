import { obtenerPerfiles } from "@/lib/acciones/admin";
import { crearCliente } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GestionPersonal, SkeletonGestionPersonal } from "@/components/admin/gestionPersonal";
import { LayoutDashboard, Users, Armchair } from "lucide-react";
import { Suspense } from "react";

export default async function PaginaPersonal() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const perfiles = await obtenerPerfiles();

  return (
    <div className="min-h-dvh bg-fondo flex">
      <aside className="w-[220px] bg-fondo border-r border-borde/60 p-4 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-primario/10 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primario" />
          </div>
          <span className="font-playfair text-sm font-bold text-texto">
            Admin
          </span>
        </div>
        <a href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-texto-secundario hover:bg-fondo-oscuro hover:text-texto transition-colors">
          <LayoutDashboard className="w-4 h-4" />
          Inicio
        </a>
        <a href="/admin/personal" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-primario/10 text-primario border-l-[3px] border-primario transition-all">
          <Users className="w-4 h-4" />
          Personal
        </a>
        <a href="/admin/mesas" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-texto-secundario hover:bg-fondo-oscuro hover:text-texto transition-colors">
          <Armchair className="w-4 h-4" />
          Mesas
        </a>
      </aside>
      <Suspense fallback={<SkeletonGestionPersonal />}>
        <GestionPersonal perfilesIniciales={perfiles} />
      </Suspense>
    </div>
  );
}
