"use client";

import dynamic from "next/dynamic";
import { TrendingUp, ShoppingCart, CheckCircle2, Clock, UtensilsCrossed, PackageCheck } from "lucide-react";
import { useDashboardAdmin } from "@/hooks/useDashboardAdmin";
import { formatearPrecio } from "@/lib/formato";
import { TarjetaEstadistica } from "./tarjetaEstadistica";
import { TablaPedidosAdmin } from "./tablaPedidosAdmin";
import type { StatsAdmin } from "@/types";

const GraficoIngresosHora = dynamic(
  () => import("./graficoIngresosHora").then((m) => ({ default: m.GraficoIngresosHora })),
  { ssr: false }
);
const GraficoTendenciaSemanal = dynamic(
  () => import("./graficoTendenciaSemanal").then((m) => ({ default: m.GraficoTendenciaSemanal })),
  { ssr: false }
);
const GraficoEstadoPedidos = dynamic(
  () => import("./graficoEstadoPedidos").then((m) => ({ default: m.GraficoEstadoPedidos })),
  { ssr: false }
);
const GraficoPlatosPopulares = dynamic(
  () => import("./graficoPlatosPopulares").then((m) => ({ default: m.GraficoPlatosPopulares })),
  { ssr: false }
);

interface DashboardAdminProps {
  statsIniciales: StatsAdmin;
}

export function DashboardAdmin({ statsIniciales }: DashboardAdminProps) {
  const {
    estadisticas,
    ingresosPorHora,
    ingresosPorDia,
    distribucionEstado,
    platosPopulares,
    pedidos,
    pagina,
    totalPaginas,
    cambiarPagina,
    totalPedidos,
  } = useDashboardAdmin(statsIniciales);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-8">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible">
          <TarjetaEstadistica
            icono={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            iconoBg="bg-primario/10"
            iconoColor="text-primario"
            label="Ventas del día"
            valor={formatearPrecio(estadisticas.ventasHoy)}
            subtitulo={`${estadisticas.pedidosHoy} pedidos procesados`}
            variante="horizontal"
          />
          <TarjetaEstadistica
            icono={<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />}
            iconoBg="bg-info/10"
            iconoColor="text-info"
            label="Total pedidos"
            valor={totalPedidos.toString()}
            subtitulo="Todas las transacciones"
            variante="horizontal"
          />
          <TarjetaEstadistica
            icono={<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            iconoBg="bg-exito/10"
            iconoColor="text-exito"
            label="Completados hoy"
            valor={estadisticas.completadosHoy.toString()}
            subtitulo={
              estadisticas.completadosHoy > 0 && estadisticas.pedidosHoy > 0
                ? `${Math.round((estadisticas.completadosHoy / estadisticas.pedidosHoy) * 100)}% completitud`
                : "Sin pedidos hoy"
            }
            variante="horizontal"
          />
          <TarjetaEstadistica
            icono={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            iconoBg="bg-info/10"
            iconoColor="text-info"
            label="Pendientes"
            valor={estadisticas.pendientes.toString()}
            subtitulo="En espera de atención"
            variante="horizontal"
          />
          <TarjetaEstadistica
            icono={<UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />}
            iconoBg="bg-advertencia/10"
            iconoColor="text-advertencia"
            label="En preparación"
            valor={estadisticas.preparando.toString()}
            subtitulo="Cocina trabajando"
            variante="horizontal"
          />
          <TarjetaEstadistica
            icono={<PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />}
            iconoBg="bg-exito/10"
            iconoColor="text-exito"
            label="Listos"
            valor={estadisticas.listos.toString()}
            subtitulo="Para entregar o recoger"
            variante="horizontal"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GraficoIngresosHora datos={ingresosPorHora} />
          <GraficoTendenciaSemanal datos={ingresosPorDia} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GraficoEstadoPedidos datos={distribucionEstado} />
          <GraficoPlatosPopulares datos={platosPopulares} />
        </div>

        <TablaPedidosAdmin
          pedidos={pedidos}
          pagina={pagina}
          totalPaginas={totalPaginas}
          onCambiarPagina={cambiarPagina}
        />
      </div>
    </div>
  );
}
