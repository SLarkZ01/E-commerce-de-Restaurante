"use client";

import { useState, useMemo, useCallback } from "react";
import type { StatsAdmin } from "@/types";

const PAGINA_TAMANO = 10;

export function useDashboardAdmin(statsIniciales: StatsAdmin) {
  const [pagina, setPagina] = useState(1);

  const pedidos = statsIniciales.pedidosRecientes;

  const totalPaginas = Math.max(1, Math.ceil(pedidos.length / PAGINA_TAMANO));
  const paginaActual = Math.min(pagina, totalPaginas);

  const pedidosPaginados = useMemo(
    () => pedidos.slice((paginaActual - 1) * PAGINA_TAMANO, paginaActual * PAGINA_TAMANO),
    [pedidos, paginaActual]
  );

  const cambiarPagina = useCallback(
    (nuevaPagina: number) => setPagina(Math.max(1, Math.min(nuevaPagina, totalPaginas))),
    [totalPaginas]
  );

  return {
    estadisticas: statsIniciales.estadisticas,
    ingresosPorHora: statsIniciales.ingresosPorHora,
    ingresosPorDia: statsIniciales.ingresosPorDia,
    distribucionEstado: statsIniciales.distribucionEstado,
    platosPopulares: statsIniciales.platosPopulares,
    pedidos: pedidosPaginados,
    pagina: paginaActual,
    totalPaginas,
    cambiarPagina,
    totalPedidos: pedidos.length,
  };
}
