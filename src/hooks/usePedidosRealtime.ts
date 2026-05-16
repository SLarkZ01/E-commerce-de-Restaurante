"use client";

import { useCallback } from "react";
import { crearCliente } from "@/lib/supabase/browser";
import { useRealtime } from "./useRealtime";
import type { IServicioRealtime } from "@/lib/servicios/realtimeService";
import type { PedidoConItems, Pedido, ItemPedidoConPlato } from "@/types";

interface FilaItemPedido {
  cantidad: number;
  precio_unitario: number;
  platos: Array<{ nombre: string }> | null;
}

async function obtenerItemsPedido(pedidoId: string): Promise<ItemPedidoConPlato[]> {
  const supabase = crearCliente();
  const { data } = await supabase
    .from("items_pedido")
    .select("cantidad, precio_unitario, platos(nombre)")
    .eq("pedido_id", pedidoId);

  if (!data) return [];

  return (data as unknown as FilaItemPedido[]).map((item: FilaItemPedido) => ({
    plato_nombre: item.platos?.[0]?.nombre ?? "Plato",
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }));
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

      obtenerItemsPedido(nuevo.id).then((items) => {
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
