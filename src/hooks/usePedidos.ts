"use client";

import { useCallback } from "react";
import { cambiarEstadoPedido as cambiarEstadoPedidoAction } from "@/lib/acciones/cocina";
import type { EstadoPedido } from "@/types";

export interface ResultadoPedido {
  exito: boolean;
  error?: string;
}

export function usePedidos() {
  const cambiarEstado = useCallback(async (
    pedidoId: string,
    nuevoEstado: EstadoPedido,
    rolUsuario: string
  ): Promise<ResultadoPedido> => {
    const resultado = await cambiarEstadoPedidoAction(pedidoId, nuevoEstado, rolUsuario);

    if (resultado.error) {
      return { exito: false, error: resultado.error };
    }

    return { exito: true };
  }, []);

  return { cambiarEstado };
}
