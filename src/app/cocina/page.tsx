import { obtenerTodosPedidos } from "@/lib/acciones/cocina";
import { crearCliente } from "@/lib/supabase/server";
import { KanbanPedidos } from "@/components/cocina/kanbanPedidos";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PaginaCocina() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const pedidos = await obtenerTodosPedidos();

  return (
    <div className="min-h-dvh bg-[#FEFAF6] flex flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#FEFAF6] border-b border-[#E7E0D8] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <span className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
            E-Kitchen Cocina
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/cocina/platos"
            className="text-sm font-medium text-[#C44536] hover:underline"
          >
            Gestionar Menú
          </Link>
          <span className="text-xs text-[#78716C]">
            {user.email}
          </span>
        </div>
      </header>

      <KanbanPedidos pedidosIniciales={pedidos} />
    </div>
  );
}
