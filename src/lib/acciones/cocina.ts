"use server";

import { db } from "@/lib/db";
import { pedidos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { EstadoPedido, Pedido } from "@/types";

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente: ["preparando"],
  preparando: ["listo"],
  listo: ["entregado"],
  entregado: [],
};

export async function cambiarEstadoPedido(
  pedidoId: string,
  nuevoEstado: EstadoPedido,
  rolUsuario: string
): Promise<{ exito: boolean; error?: string }> {
  if (rolUsuario !== "cocinero" && rolUsuario !== "mesero") {
    return { exito: false, error: "No tienes permiso para cambiar el estado" };
  }

  const pedidoActual = await db
    .select()
    .from(pedidos)
    .where(eq(pedidos.id, pedidoId))
    .limit(1);

  if (!pedidoActual.length) {
    return { exito: false, error: "Pedido no encontrado" };
  }

  const estadoActual = pedidoActual[0].estado as EstadoPedido;
  const validas = TRANSICIONES_VALIDAS[estadoActual];

  if (!validas.includes(nuevoEstado)) {
    return {
      exito: false,
      error: `Transición inválida: ${estadoActual} → ${nuevoEstado}`,
    };
  }

  if (nuevoEstado === "entregado" && rolUsuario !== "mesero") {
    return {
      exito: false,
      error: "Solo el mesero puede marcar como entregado",
    };
  }

  await db
    .update(pedidos)
    .set({ estado: nuevoEstado, actualizadoEn: new Date() })
    .where(eq(pedidos.id, pedidoId));

  return { exito: true };
}

export async function obtenerPedidosPorEstado(
  estado: EstadoPedido
): Promise<Pedido[]> {
  return (await db
    .select()
    .from(pedidos)
    .where(eq(pedidos.estado, estado))) as Pedido[];
}

export async function obtenerTodosPedidos(): Promise<Pedido[]> {
  return (await db.select().from(pedidos)) as Pedido[];
}
