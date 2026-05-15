"use client";

import { useCallback } from "react";
import { crearCliente } from "@/lib/supabase/browser";
import { useRealtime } from "./useRealtime";
import type { PedidoConItems, Pedido, ItemPedidoConPlato } from "@/types";

/**
 * Fetch los items de un pedido sin recargar la página.
 * Se usa en el Observer para completar los datos del pedido nuevo.
 */
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

/**
 * Hook de negocio: Observer para pedidos.
 * Encapsula la suscripción Realtime + fetch de items.
 * El componente solo recibe el callback para agregar al estado.
 */
export function usePedidosRealtime(
  onNuevoPedido: (pedido: PedidoConItems) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callback = useCallback((payload: any) => {
    const nuevo = payload.new as Pedido;
    if (nuevo?.estado !== "pendiente") return;

    obtenerItemsPedido(nuevo.id).then((items) => {
      onNuevoPedido({ ...nuevo, items } as PedidoConItems);
    });
  }, [onNuevoPedido]);

  useRealtime("pedidos", "INSERT", callback);
}
