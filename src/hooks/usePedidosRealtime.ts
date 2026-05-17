"use client";

import { useCallback } from "react";
import { obtenerItemsPorPedido } from "@/lib/acciones/cocina";
import { useRealtime } from "./useRealtime";
import type { IServicioRealtime } from "@/lib/servicios/realtimeService";
import type { PedidoConItems, Pedido, ItemPedidoConPlato } from "@/types";

const RETRASOS_REINTENTO = [200, 400];
const MAX_REINTENTOS = RETRASOS_REINTENTO.length;

async function obtenerItemsConReintento(pedidoId: string): Promise<ItemPedidoConPlato[]> {
  for (let intento = 0; intento <= MAX_REINTENTOS; intento++) {
    const items = await obtenerItemsPorPedido(pedidoId);

    if (items.length > 0) {
      return items;
    }

    if (intento < MAX_REINTENTOS) {
      await new Promise((r) => setTimeout(r, RETRASOS_REINTENTO[intento]));
    }
  }

  return [];
}

export interface CallbacksPedido {
  onNuevoPedido: (pedido: PedidoConItems) => void;
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

      obtenerItemsConReintento(nuevo.id).then((items) => {
        onNuevoPedido({ ...nuevo, items } as PedidoConItems);
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
