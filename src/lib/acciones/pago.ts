"use server";

import { db } from "@/lib/db";
import { pedidos, itemsPedido, mesas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { ItemCarrito } from "@/stores/cart";
import type { Pedido, Mesa } from "@/types";

export async function crearPedido(
  mesaUuid: string,
  items: ItemCarrito[],
  total: number,
  correoCliente?: string
): Promise<{ pedidoId: string; error?: string }> {
  const mesa = await db
    .select()
    .from(mesas)
    .where(eq(mesas.codigoQr, mesaUuid))
    .limit(1);

  if (!mesa.length) {
    return { pedidoId: "", error: "Mesa no encontrada" };
  }

  const mesaId = mesa[0].id;

  const [nuevoPedido] = await db
    .insert(pedidos)
    .values({
      mesaId,
      estado: "pendiente",
      total: total.toString(),
      correoCliente: correoCliente ?? null,
    })
    .returning({ id: pedidos.id });

  const itemsInsert = items.map((item) => ({
    pedidoId: nuevoPedido.id,
    platoId: item.id,
    cantidad: item.cantidad,
    precioUnitario: item.precio.toString(),
  }));

  await db.insert(itemsPedido).values(itemsInsert);

  return { pedidoId: nuevoPedido.id };
}

export async function obtenerMesaPorUuid(
  uuid: string
): Promise<Mesa | null> {
  const result = await db
    .select()
    .from(mesas)
    .where(eq(mesas.codigoQr, uuid))
    .limit(1);

  return (result[0] as Mesa) ?? null;
}
