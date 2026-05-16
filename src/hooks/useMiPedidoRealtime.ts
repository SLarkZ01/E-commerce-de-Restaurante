"use client";

import { useCallback } from "react";
import { useRealtime } from "./useRealtime";
import type { IServicioRealtime } from "@/lib/servicios/realtimeService";
import type { Pedido, EstadoPedido } from "@/types";

export interface CallbacksMiPedido {
  onEstadoCambiado: (nuevoEstado: EstadoPedido, pedido: Pedido) => void;
}

export function useMiPedidoRealtime(
  pedidoId: string | null,
  callbacks: CallbacksMiPedido,
  servicio?: IServicioRealtime
) {
  const { onEstadoCambiado } = callbacks;

  const onUpdate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any) => {
      const nuevo = payload.new as Pedido;
      if (!nuevo?.estado) return;
      onEstadoCambiado(nuevo.estado, nuevo);
    },
    [onEstadoCambiado]
  );

  const filtro = pedidoId ? `id=eq.${pedidoId}` : undefined;

  useRealtime("pedidos", "UPDATE", onUpdate, filtro, servicio);
}
