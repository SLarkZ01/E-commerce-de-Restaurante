"use client";

import { useState, useMemo, useEffect } from "react";
import { useRealtime } from "@/hooks/useRealtime";
import type { IServicioRealtime } from "@/lib/servicios/realtimeService";
import type {
  StatsAdmin,
  EstadisticaDashboard,
  IngresoPorHora,
  IngresoPorDia,
  DistribucionEstado,
  PlatoPopular,
  PedidoConDetalles,
  EstadoPedido,
} from "@/types";
import { obtenerStatsAdmin } from "@/lib/acciones/admin";

const PAGINA_TAMANO = 10;
const COLORES_ESTADO: Record<string, string> = {
  pendiente: "#3B82F6",
  preparando: "#F59E0B",
  listo: "#65A30D",
  entregado: "#C44536",
};

function recalcularEstadisticas(pedidos: PedidoConDetalles[]): EstadisticaDashboard {
  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString();
  const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1).toISOString();

  const ventasTotales = pedidos
    .filter((p) => p.estado !== "pendiente")
    .reduce((sum, p) => sum + p.total, 0);

  const pedidosHoy = pedidos.filter((p) => p.creado_en >= inicioHoy && p.creado_en < finHoy);
  const ventasHoy = pedidosHoy
    .filter((p) => p.estado !== "pendiente")
    .reduce((sum, p) => sum + p.total, 0);

  const completadosHoy = pedidosHoy.filter(
    (p) => p.estado === "entregado" || p.estado === "listo"
  ).length;

  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const preparando = pedidos.filter((p) => p.estado === "preparando").length;
  const listos = pedidos.filter((p) => p.estado === "listo").length;

  const pedidosConTotal = pedidos.filter((p) => p.estado !== "pendiente");
  const promedioPorPedido =
    pedidosConTotal.length > 0
      ? Math.round(pedidosConTotal.reduce((sum, p) => sum + p.total, 0) / pedidosConTotal.length)
      : 0;

  return {
    ventasTotales,
    ventasHoy,
    pedidosHoy: pedidosHoy.length,
    completadosHoy,
    pendientes,
    preparando,
    listos,
    promedioPorPedido,
  };
}

function recalcularIngresosPorHora(pedidos: PedidoConDetalles[]): IngresoPorHora[] {
  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString();
  const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1).toISOString();

  const mapa = new Map<number, number>();
  for (let h = 0; h < 24; h++) mapa.set(h, 0);

  for (const p of pedidos) {
    if (p.creado_en >= inicioHoy && p.creado_en < finHoy) {
      const hora = new Date(p.creado_en).getHours();
      mapa.set(hora, (mapa.get(hora) ?? 0) + p.total);
    }
  }

  return Array.from(mapa.entries()).map(([hora, total]) => ({ hora, total }));
}

function recalcularIngresosPorDia(pedidos: PedidoConDetalles[]): IngresoPorDia[] {
  const hoy = new Date();
  const mapa = new Map<string, { total: number; cantidad: number }>();

  for (let d = 0; d < 7; d++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - d);
    const clave = fecha.toISOString().slice(0, 10);
    mapa.set(clave, { total: 0, cantidad: 0 });
  }

  for (const p of pedidos) {
    const clave = p.creado_en.slice(0, 10);
    const entrada = mapa.get(clave);
    if (entrada) {
      entrada.total += p.total;
      entrada.cantidad += 1;
    }
  }

  return Array.from(mapa.entries())
    .map(([fecha, val]) => ({ fecha, total: val.total, cantidad: val.cantidad }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function recalcularDistribucionEstado(pedidos: PedidoConDetalles[]): DistribucionEstado[] {
  const cuenta = new Map<string, number>();
  for (const p of pedidos) {
    cuenta.set(p.estado, (cuenta.get(p.estado) ?? 0) + 1);
  }
  return Array.from(cuenta.entries()).map(([estado, cantidad]) => ({
    estado,
    cantidad,
    color: COLORES_ESTADO[estado] ?? "#78716C",
  }));
}

export function useDashboardAdminRealtime(
  statsIniciales: StatsAdmin,
  servicio?: IServicioRealtime
) {
  const [pedidos, setPedidos] = useState<PedidoConDetalles[]>(statsIniciales.pedidosRecientes);
  const [platosPopulares, setPlatosPopulares] = useState<PlatoPopular[]>(statsIniciales.platosPopulares);
  const [pagina, setPagina] = useState(1);

  const estadisticas = useMemo(() => recalcularEstadisticas(pedidos), [pedidos]);
  const ingresosPorHora = useMemo(() => recalcularIngresosPorHora(pedidos), [pedidos]);
  const ingresosPorDia = useMemo(() => recalcularIngresosPorDia(pedidos), [pedidos]);
  const distribucionEstado = useMemo(() => recalcularDistribucionEstado(pedidos), [pedidos]);

  useRealtime(
    "pedidos",
    "*",
    (payload: any) => {
      const eventType = payload.eventType as string;
      const nuevo = payload.new as Record<string, unknown> | undefined;
      const viejo = payload.old as Record<string, unknown> | undefined;

      if (eventType === "INSERT" && nuevo?.id) {
        setPedidos((prev) => {
          if (prev.some((p) => p.id === String(nuevo.id))) return prev;
          const pedidoNuevo: PedidoConDetalles = {
            id: String(nuevo.id),
            mesa_id: (nuevo.mesa_id as string) ?? null,
            mesa_numero: null,
            tipo_despacho: (nuevo.tipo_despacho as "mesa" | "para_llevar") ?? "mesa",
            estado: (nuevo.estado as EstadoPedido) ?? "pendiente",
            correo_cliente: (nuevo.correo_cliente as string) ?? null,
            total: Number(nuevo.total ?? 0),
            paypal_pedido_id: (nuevo.paypal_pedido_id as string) ?? null,
            cocinero_id: (nuevo.cocinero_id as string) ?? null,
            creado_en: (nuevo.creado_en as string) ?? new Date().toISOString(),
            actualizado_en: (nuevo.actualizado_en as string) ?? new Date().toISOString(),
            items: [],
          };
          return [pedidoNuevo, ...prev];
        });
        return;
      }

      if (eventType === "UPDATE" && nuevo?.id) {
        setPedidos((prev) =>
          prev.map((p) =>
            String(p.id) === String(nuevo.id)
              ? {
                  ...p,
                  estado: (nuevo.estado as EstadoPedido) ?? p.estado,
                  total: Number(nuevo.total ?? p.total),
                  actualizado_en: (nuevo.actualizado_en as string) ?? p.actualizado_en,
                }
              : p
          )
        );
        return;
      }

      if (eventType === "DELETE" && viejo?.id) {
        setPedidos((prev) => prev.filter((p) => String(p.id) !== String(viejo.id)));
      }
    },
    undefined,
    servicio
  );

  useEffect(() => {
    let activo = true;
    const id = setTimeout(() => {
      if (!activo) return;
      obtenerStatsAdmin()
        .then((stats) => {
          if (activo) setPlatosPopulares(stats.platosPopulares);
        })
        .catch(() => {});
    }, 500);

    return () => {
      activo = false;
      clearTimeout(id);
    };
  }, [pedidos.length]);

  const totalPaginas = Math.max(1, Math.ceil(pedidos.length / PAGINA_TAMANO));
  const paginaActual = Math.min(pagina, totalPaginas);

  const pedidosPaginados = useMemo(
    () => pedidos.slice((paginaActual - 1) * PAGINA_TAMANO, paginaActual * PAGINA_TAMANO),
    [pedidos, paginaActual]
  );

  const cambiarPagina = (nuevaPagina: number) => {
    setPagina(Math.max(1, Math.min(nuevaPagina, totalPaginas)));
  };

  return {
    estadisticas,
    ingresosPorHora,
    ingresosPorDia,
    distribucionEstado,
    platosPopulares,
    pedidos: pedidosPaginados,
    pagina: paginaActual,
    totalPaginas,
    cambiarPagina,
    totalPedidos: pedidos.length,
  };
}
