import { obtenerTodosPlatos } from "@/lib/acciones/catalogo";
import { obtenerPlatosDisponibles } from "@/lib/acciones/platos";
import { TablaPlatos } from "@/components/cocina/tablaPlatos";
import { crearCliente } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <div className="min-h-dvh bg-[#FEFAF6] flex flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#FEFAF6] border-b border-[#E7E0D8] shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/cocina" className="text-[#C44536] text-sm font-medium">
            ← Volver
          </Link>
          <span className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
            Gestión de Platos
          </span>
        </div>
      </header>

      <TablaPlatos platosIniciales={platos} categorias={categorias} />
    </div>
  );
}
