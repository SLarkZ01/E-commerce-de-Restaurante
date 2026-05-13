import { obtenerTodosPedidos } from "@/lib/acciones/cocina";
import { formatearPrecio } from "@/lib/formato";
import { TrendingUp, ShoppingCart, CheckCircle2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function PaginaAdmin() {
  const [pedidos] = await Promise.all([obtenerTodosPedidos()]);

  const totalVentas = pedidos
    .filter((p) => p.estado !== "pendiente")
    .reduce((sum, p) => sum + p.total, 0);

  const pedidosHoy = pedidos.filter((p) => {
    const hoy = new Date();
    const creado = new Date(p.creado_en);
    return (
      creado.getDate() === hoy.getDate() &&
      creado.getMonth() === hoy.getMonth() &&
      creado.getFullYear() === hoy.getFullYear()
    );
  });

  const entregadosHoy = pedidosHoy.filter(
    (p) => p.estado === "entregado" || p.estado === "listo"
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        <Suspense fallback={<SkeletonDashboard />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              iconBg="bg-primario/10"
              iconColor="text-primario"
              label="Ventas del día"
              valor={formatearPrecio(totalVentas)}
              subtitulo={`${pedidosHoy.length} pedidos procesados`}
            />
            <StatCard
              icon={<ShoppingCart className="w-5 h-5" />}
              iconBg="bg-info/10"
              iconColor="text-info"
              label="Total pedidos"
              valor={pedidos.length.toString()}
              subtitulo="Todas las transacciones"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              iconBg="bg-exito/10"
              iconColor="text-exito"
              label="Completados hoy"
              valor={entregadosHoy.length.toString()}
              subtitulo="Listos o entregados"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              iconBg="bg-advertencia/10"
              iconColor="text-advertencia"
              label="Pendientes"
              valor={pedidos.filter((p) => p.estado === "pendiente").length.toString()}
              subtitulo="En espera de atención"
            />
          </div>

          <div className="bg-fondo-card rounded-2xl border border-borde/60 shadow-[0_1px_3px_rgba(45,42,38,0.04)] overflow-hidden">
            <div className="px-6 py-5 border-b border-borde/60">
              <h2 className="text-base font-semibold text-texto">
                Últimos pedidos
              </h2>
              <p className="text-sm text-texto-secundario mt-1">
                Historial reciente de transacciones
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-fondo-oscuro">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                      Hora
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                      Pedido
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                      Total
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 10).map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-borde/40 hover:bg-fondo-oscuro/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-texto-secundario text-sm tabular-nums">
                        {new Date(p.creado_en).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-texto text-sm">
                        #{p.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-texto text-sm tabular-nums">
                        {formatearPrecio(p.total)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            p.estado === "entregado"
                              ? "bg-exito/10 text-exito"
                              : p.estado === "listo"
                              ? "bg-info/10 text-info"
                              : p.estado === "preparando"
                              ? "bg-advertencia/10 text-advertencia"
                              : "bg-fondo-oscuro text-texto-secundario"
                          }`}
                        >
                          {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
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
  subtitulo,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  valor: string;
  subtitulo: string;
}) {
  return (
    <div className="bg-fondo-card rounded-2xl border border-borde/60 p-6 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all group">
      <div className="flex items-start justify-between mb-5">
        <p className="text-sm font-medium text-texto-secundario">{label}</p>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
      <p className="font-playfair text-3xl font-bold text-texto tabular-nums mb-1">
        {valor}
      </p>
      <p className="text-xs text-texto-terciario">{subtitulo}</p>
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-fondo-card rounded-2xl border border-borde/60 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-10 h-10 rounded-xl" />
            </div>
            <Skeleton className="w-32 h-9" />
            <Skeleton className="w-40 h-3" />
          </div>
        ))}
      </div>
      <div className="bg-fondo-card rounded-2xl border border-borde/60 overflow-hidden">
        <div className="px-6 py-5 border-b border-borde/60">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-48 h-4 mt-2" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-6">
              <Skeleton className="w-16 h-5" />
              <Skeleton className="w-20 h-5" />
              <Skeleton className="w-24 h-5 ml-auto" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
