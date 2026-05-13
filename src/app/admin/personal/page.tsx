import { obtenerPerfiles, crearPerfil, eliminarPerfil } from "@/lib/acciones/admin";
import { crearCliente } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GestionPersonal } from "@/components/admin/gestionPersonal";

export default async function PaginaPersonal() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const perfiles = await obtenerPerfiles();

  return (
    <div className="min-h-dvh bg-[#FEFAF6] flex">
      <aside className="w-[200px] bg-[#FEFAF6] border-r border-[#E7E0D8] p-4 flex flex-col gap-1 shrink-0">
        <div className="mb-4">
          <span className="text-lg">🍽️</span>
          <span className="ml-1 font-[Playfair_Display] text-sm font-semibold text-[#2D2A26]">
            Admin
          </span>
        </div>
        <a href="/admin" className="px-3 py-2 rounded-lg text-sm text-[#78716C] hover:bg-[#F5F0EB] transition-colors">🏠 Inicio</a>
        <a href="/admin/personal" className="px-3 py-2 rounded-lg text-sm font-medium bg-[#F5F0EB] text-[#C44536] border-l-[3px] border-[#C44536]">👥 Personal</a>
        <a href="/admin/mesas" className="px-3 py-2 rounded-lg text-sm text-[#78716C] hover:bg-[#F5F0EB] transition-colors">🪑 Mesas</a>
      </aside>
      <GestionPersonal perfilesIniciales={perfiles} />
    </div>
  );
}
