"use client";

import { useCallback } from "react";
import { crearPedido as crearPedidoAction } from "@/lib/acciones/pago";
import type { ItemCarrito } from "@/types";

export interface ResultadoPago {
  exito: boolean;
  pedidoId?: string;
  error?: string;
}

export function usePago() {
  const crearPedido = useCallback(async (
    mesaUuid: string,
    items: ItemCarrito[],
    total: number
  ): Promise<ResultadoPago> => {
    try {
      const resultado = await crearPedidoAction(mesaUuid, items, total);

      if (resultado.error) {
        return { exito: false, error: resultado.error };
      }

      return { exito: true, pedidoId: resultado.pedidoId };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      return { exito: false, error: msg };
    }
  }, []);

  return { crearPedido };
}
