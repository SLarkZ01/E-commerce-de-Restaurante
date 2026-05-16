"use client";

import { useCallback } from "react";
import { crearCliente } from "@/lib/supabase/browser";
import { useRealtime } from "./useRealtime";
import type { PedidoConItems, Pedido, ItemPedidoConPlato } from "@/types";

async function obtenerItemsPedido(pedidoId: string): Promise<ItemPedidoConPlato[]> {
  const supabase = crearCliente();
  const { data } = await supabase
    .from("items_pedido")
    .select("cantidad, precio_unitario, platos(nombre)")
    .eq("pedido_id", pedidoId);

  if (!data) return [];

  return (data as unknown[]).map((item: unknown) => {
    const i = item as { cantidad: number; precio_unitario: number; platos: Array<{ nombre: string }> | null };
    return {
      plato_nombre: i.platos?.[0]?.nombre ?? "Plato",
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
    };
  });
}

interface CallbacksPedido {
  onNuevoPedido: (pedido: PedidoConItems) => void;
  onCambioEstado: (pedidoId: string, nuevoEstado: string) => void;
  onPedidoEntregado: (pedidoId: string) => void;
}

/**
 * Hook de negocio: Observer completo para pedidos.
 * Suscribe a INSERT, UPDATE y DELETE para reflejar cambios
 * en tiempo real entre múltiples ventanas/dispositivos.
 */
export function usePedidosRealtime(callbacks: CallbacksPedido) {
  const { onNuevoPedido, onCambioEstado, onPedidoEntregado } = callbacks;

  // INSERT: nuevo pedido creado (desde cualquier cliente/ventana)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInsert = useCallback((payload: any) => {
    console.log("[Realtime Pedidos] INSERT recibido:", payload);
    const nuevo = payload.new as Pedido;
    if (nuevo?.estado !== "pendiente") {
      console.log("[Realtime Pedidos] Ignorando INSERT con estado:", nuevo?.estado);
      return;
    }

    obtenerItemsPedido(nuevo.id).then((items) => {
      console.log("[Realtime Pedidos] Items obtenidos:", items);
      onNuevoPedido({ ...nuevo, items } as PedidoConItems);
    });
  }, [onNuevoPedido]);

  // UPDATE: cambio de estado (desde cualquier ventana)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpdate = useCallback((payload: any) => {
    console.log("[Realtime Pedidos] UPDATE recibido:", payload);
    const nuevo = payload.new as Pedido;
    if (!nuevo?.estado) return;

    if (nuevo.estado === "entregado") {
      console.log("[Realtime Pedidos] Pedido entregado:", nuevo.id);
      onPedidoEntregado(nuevo.id);
    } else {
      console.log("[Realtime Pedidos] Cambio de estado:", nuevo.id, nuevo.estado);
      onCambioEstado(nuevo.id, nuevo.estado);
    }
  }, [onCambioEstado, onPedidoEntregado]);

  useRealtime("pedidos", "INSERT", onInsert);
  useRealtime("pedidos", "UPDATE", onUpdate);
}
