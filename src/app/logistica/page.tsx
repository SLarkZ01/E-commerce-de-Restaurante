import { obtenerPedidosPorEstado } from "@/lib/acciones/cocina";
import { crearCliente } from "@/lib/supabase/server";
import { ListaEntregas } from "@/components/logistica/listaEntregas";
import { redirect } from "next/navigation";

export default async function PaginaLogistica() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const pedidosListos = await obtenerPedidosPorEstado("listo");

  return (
    <div className="min-h-dvh bg-[#FEFAF6] flex flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#FEFAF6] border-b border-[#E7E0D8] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <span className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
            Platos Listos
          </span>
        </div>
        <span className="text-xs text-[#78716C]">{user.email}</span>
      </header>

      <ListaEntregas pedidosIniciales={pedidosListos} />
    </div>
  );
}
