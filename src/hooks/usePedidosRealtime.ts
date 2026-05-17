"use client";

import { useCallback } from "react";
import { obtenerPedidoConDetalles } from "@/lib/acciones/cocina";
import { useRealtime } from "./useRealtime";
import type { IServicioRealtime } from "@/lib/servicios/realtimeService";
import type { PedidoConDetalles, Pedido } from "@/types";

const RETRASOS_REINTENTO = [200, 400];
const MAX_REINTENTOS = RETRASOS_REINTENTO.length;

async function obtenerPedidoConReintento(pedidoId: string): Promise<PedidoConDetalles | null> {
  for (let intento = 0; intento <= MAX_REINTENTOS; intento++) {
    const pedido = await obtenerPedidoConDetalles(pedidoId);

    if (pedido && pedido.items.length > 0) {
      return pedido;
    }

    if (intento < MAX_REINTENTOS) {
      await new Promise((r) => setTimeout(r, RETRASOS_REINTENTO[intento]));
    }
  }

  return null;
}

export interface CallbacksPedido {
  onNuevoPedido: (pedido: PedidoConDetalles) => void;
  onCambioEstado: (pedidoId: string, nuevoEstado: string) => void;
  onPedidoEntregado: (pedidoId: string) => void;
}

export function usePedidosRealtime(
  callbacks: CallbacksPedido,
  servicio?: IServicioRealtime
) {
  const { onNuevoPedido, onCambioEstado, onPedidoEntregado } = callbacks;

  const onInsert = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any) => {
      const nuevo = payload.new as Pedido;
      if (!nuevo || nuevo.estado !== "pendiente") {
        return;
      }

      obtenerPedidoConReintento(nuevo.id).then((pedidoCompleto) => {
        if (pedidoCompleto) {
          onNuevoPedido(pedidoCompleto);
        }
      });
    },
    [onNuevoPedido]
  );

  const onUpdate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any) => {
      const nuevo = payload.new as Pedido;
      if (!nuevo?.estado) return;

      if (nuevo.estado === "entregado") {
        onPedidoEntregado(nuevo.id);
      } else {
        onCambioEstado(nuevo.id, nuevo.estado);
      }
    },
    [onCambioEstado, onPedidoEntregado]
  );

  useRealtime("pedidos", "INSERT", onInsert, undefined, servicio);
  useRealtime("pedidos", "UPDATE", onUpdate, undefined, servicio);
}
