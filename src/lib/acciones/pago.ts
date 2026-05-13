"use server";

import { crearCliente } from "@/lib/supabase/server";
import type { ItemCarrito } from "@/stores/cart";
import type { Mesa } from "@/types";

export async function crearPedido(
  mesaUuid: string,
  items: ItemCarrito[],
  total: number,
  correoCliente?: string
): Promise<{ pedidoId: string; error?: string }> {
  const supabase = await crearCliente();

  const { data: mesa } = await supabase
    .from("mesas")
    .select("*")
    .eq("codigo_qr", mesaUuid)
    .single();

  if (!mesa) {
    return { pedidoId: "", error: "Mesa no encontrada" };
  }

  const { data: nuevoPedido, error: errPedido } = await supabase
    .from("pedidos")
    .insert({
      mesa_id: mesa.id,
      estado: "pendiente",
      total: total,
      correo_cliente: correoCliente ?? null,
    })
    .select("id")
    .single();

  if (errPedido || !nuevoPedido) {
    return { pedidoId: "", error: "Error al crear el pedido" };
  }

  const itemsInsert = items.map((item) => ({
    pedido_id: nuevoPedido.id,
    plato_id: item.id,
    cantidad: item.cantidad,
    precio_unitario: item.precio,
  }));

  await supabase.from("items_pedido").insert(itemsInsert);

  return { pedidoId: nuevoPedido.id };
}

export async function obtenerMesaPorUuid(
  uuid: string
): Promise<Mesa | null> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("mesas")
    .select("*")
    .eq("codigo_qr", uuid)
    .single();

  return (data as Mesa) ?? null;
}
