import { crearCliente } from "@/lib/supabase/server";
import { obtenerTodosPlatos } from "@/lib/acciones/catalogo";
import { obtenerTodosPedidos } from "@/lib/acciones/cocina";
import { formatearPrecio } from "@/lib/formato";
import { redirect } from "next/navigation";

export default async function PaginaAdmin() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [pedidos] = await Promise.all([obtenerTodosPedidos()]);

  const totalVentas = pedidos
    .filter((p) => p.estado !== "pendiente")
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="min-h-dvh bg-[#FEFAF6] flex">
      <aside className="w-[200px] bg-[#FEFAF6] border-r border-[#E7E0D8] p-4 flex flex-col gap-1 shrink-0">
        <div className="mb-4">
          <span className="text-lg">🍽️</span>
          <span className="ml-1 font-[Playfair_Display] text-sm font-semibold text-[#2D2A26]">
            Admin
          </span>
        </div>
        <a
          href="/admin"
          className="px-3 py-2 rounded-lg text-sm font-medium bg-[#F5F0EB] text-[#C44536] border-l-[3px] border-[#C44536]"
        >
          🏠 Inicio
        </a>
        <a
          href="/admin/personal"
          className="px-3 py-2 rounded-lg text-sm text-[#78716C] hover:bg-[#F5F0EB] transition-colors"
        >
          👥 Personal
        </a>
        <a
          href="/admin/mesas"
          className="px-3 py-2 rounded-lg text-sm text-[#78716C] hover:bg-[#F5F0EB] transition-colors"
        >
          🪑 Mesas
        </a>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 bg-[#FEFAF6] border-b border-[#E7E0D8] shadow-sm">
          <h1 className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
            Dashboard
          </h1>
          <span className="text-xs text-[#78716C]">{user.email}</span>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-[#E7E0D8] shadow-sm">
              <p className="text-xs text-[#78716C] mb-1">💰 Ventas del día</p>
              <p className="text-xl font-bold text-[#2D2A26]">
                {formatearPrecio(totalVentas)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E7E0D8] shadow-sm">
              <p className="text-xs text-[#78716C] mb-1">📋 Total pedidos</p>
              <p className="text-xl font-bold text-[#2D2A26]">
                {pedidos.length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E7E0D8] shadow-sm">
              <p className="text-xs text-[#78716C] mb-1">🟢 Listos hoy</p>
              <p className="text-xl font-bold text-[#65A30D]">
                {pedidos.filter((p) => p.estado === "listo" || p.estado === "entregado").length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E7E0D8] shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E7E0D8]">
              <h2 className="text-sm font-semibold text-[#2D2A26]">
                Últimos pedidos
              </h2>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-[#F5F0EB] text-[#78716C]">
                <tr>
                  <th className="px-3 py-2 text-left">Hora</th>
                  <th className="px-3 py-2 text-left">Pedido</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 10).map((p) => (
                  <tr key={p.id} className="border-t border-[#E7E0D8]">
                    <td className="px-3 py-2 text-[#78716C]">
                      {new Date(p.creado_en).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-3 py-2 font-medium text-[#2D2A26]">
                      #{p.id.slice(0, 6)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-[#2D2A26]">
                      {formatearPrecio(p.total)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          p.estado === "entregado"
                            ? "bg-green-50 text-green-700"
                            : p.estado === "listo"
                              ? "bg-blue-50 text-blue-700"
                              : p.estado === "preparando"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
