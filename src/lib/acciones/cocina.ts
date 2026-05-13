"use server";

import { crearCliente } from "@/lib/supabase/server";
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

  const supabase = await crearCliente();
  const { data: pedidoActual } = await supabase
    .from("pedidos")
    .select("*")
    .eq("id", pedidoId)
    .single();

  if (!pedidoActual) {
    return { exito: false, error: "Pedido no encontrado" };
  }

  const estadoActual = pedidoActual.estado as EstadoPedido;
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

  await supabase
    .from("pedidos")
    .update({ estado: nuevoEstado, actualizado_en: new Date().toISOString() })
    .eq("id", pedidoId);

  return { exito: true };
}

export async function obtenerPedidosPorEstado(
  estado: EstadoPedido
): Promise<Pedido[]> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("pedidos")
    .select("*")
    .eq("estado", estado)
    .order("creado_en", { ascending: true });

  return (data ?? []) as Pedido[];
}

export async function obtenerTodosPedidos(): Promise<Pedido[]> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("pedidos")
    .select("*")
    .order("creado_en", { ascending: false });

  return (data ?? []) as Pedido[];
}
