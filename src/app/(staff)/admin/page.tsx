import { obtenerTodosPedidos } from "@/lib/acciones/cocina";
import { formatearPrecio } from "@/lib/formato";
import { TrendingUp, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function PaginaAdmin() {
  const [pedidos] = await Promise.all([obtenerTodosPedidos()]);

  const totalVentas = pedidos
    .filter((p) => p.estado !== "pendiente")
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-6">
        <Suspense fallback={<SkeletonDashboard />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              iconBg="bg-primario/10"
              iconColor="text-primario"
              label="Ventas del día"
              valor={formatearPrecio(totalVentas)}
            />
            <StatCard
              icon={<ShoppingCart className="w-5 h-5" />}
              iconBg="bg-info/10"
              iconColor="text-info"
              label="Total pedidos"
              valor={pedidos.length.toString()}
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              iconBg="bg-exito/10"
              iconColor="text-exito"
              label="Listos hoy"
              valor={pedidos.filter((p) => p.estado === "listo" || p.estado === "entregado").length.toString()}
            />
          </div>

          <div className="bg-fondo-card rounded-xl border border-borde/60 shadow-[0_1px_3px_rgba(45,42,38,0.04)] overflow-hidden">
            <div className="px-4 py-3 border-b border-borde/60">
              <h2 className="text-sm font-semibold text-texto">
                Últimos pedidos
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-fondo-oscuro text-texto-secundario">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold">Hora</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold">Pedido</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold">Total</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 10).map((p) => (
                    <tr key={p.id} className="border-t border-borde/40 hover:bg-fondo-oscuro/50 transition-colors">
                      <td className="px-4 py-2.5 text-texto-secundario text-xs tabular-nums">
                        {new Date(p.creado_en).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-texto text-xs">
                        #{p.id.slice(0, 6)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-texto text-xs tabular-nums">
                        {formatearPrecio(p.total)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                            p.estado === "entregado"
                              ? "bg-exito/10 text-exito"
                              : p.estado === "listo"
                                ? "bg-info/10 text-info"
                                : p.estado === "preparando"
                                  ? "bg-advertencia/10 text-advertencia"
                                  : "bg-fondo-oscuro text-texto-secundario"
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
        </Suspense>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  valor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  valor: string;
}) {
  return (
    <div className="bg-fondo-card rounded-xl border border-borde/60 p-5 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <p className="text-xs font-medium text-texto-secundario">{label}</p>
      </div>
      <p className="font-playfair text-2xl font-bold text-texto tabular-nums">
        {valor}
      </p>
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border border-borde/60 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-20 h-3" />
            </div>
            <Skeleton className="w-28 h-7" />
          </div>
        ))}
      </div>
      <div className="bg-fondo-card rounded-xl border border-borde/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-borde/60">
          <Skeleton className="w-28 h-4" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-20 h-4 ml-auto" />
              <Skeleton className="w-14 h-5 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
