"use client";

import { useCallback } from "react";
import { prepararPagoWompi, crearPedidoWompi } from "@/lib/acciones/pago";
import type { ItemCarrito } from "@/types";

export interface ResultadoPago {
  exito: boolean;
  pedidoId?: string;
  error?: string;
}

export interface DatosWompi {
  publicKey: string;
  referencia: string;
  montoEnCentavos: number;
  firma: string;
  moneda: string;
}

export function usePago() {
  /** Prepara los datos para el widget de Wompi. */
  const prepararWompi = useCallback(async (
    referencia: string,
    montoEnCentavos: number
  ): Promise<DatosWompi | null> => {
    const resultado = await prepararPagoWompi(referencia, montoEnCentavos);
    if (resultado.error || !resultado.publicKey) return null;

    return {
      publicKey: resultado.publicKey,
      referencia,
      montoEnCentavos,
      firma: resultado.firma,
      moneda: "COP",
    };
  }, []);

  /**
   * Crea el pedido después de que Wompi confirma el pago.
   * Recibe el transactionId para obtener el email del cliente desde Wompi.
   */
  const confirmarPedido = useCallback(async (
    mesaUuid: string,
    items: ItemCarrito[],
    total: number,
    transactionId: string
  ): Promise<ResultadoPago> => {
    try {
      const resultado = await crearPedidoWompi(mesaUuid, items, total, transactionId);
      if (resultado.error) return { exito: false, error: resultado.error };
      return { exito: true, pedidoId: resultado.pedidoId };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      return { exito: false, error: msg };
    }
  }, []);

  return { prepararWompi, confirmarPedido };
}
