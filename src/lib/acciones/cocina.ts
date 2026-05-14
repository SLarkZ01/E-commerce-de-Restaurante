"use server";

import { crearCliente } from "@/lib/supabase/server";
import { crearEstrategiaDespacho } from "@/lib/servicios/estrategiaDespacho";
import type { EstadoPedido, Pedido, TipoDespacho } from "@/types";

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente: ["preparando"],
  preparando: ["listo"],
  listo: ["entregado"],
  entregado: [],
};

export interface ItemPedidoConPlato {
  plato_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

export interface PedidoConItems extends Pedido {
  items: ItemPedidoConPlato[];
}

export interface StatsCocina {
  pendientes: number;
  preparando: number;
  listos: number;
  tiempoPromedioMin: number;
}

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

  // Strategy: ejecutar lógica de despacho según tipo (mesa o para llevar)
  if (nuevoEstado === "entregado") {
    const estrategia = crearEstrategiaDespacho(pedidoActual.tipo_despacho as TipoDespacho);
    await estrategia.alEntregar(pedidoActual as Pedido);
  }

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

export async function obtenerPedidosConItems(): Promise<PedidoConItems[]> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("pedidos")
    .select(`
      *,
      items_pedido (
        cantidad,
        precio_unitario,
        platos (
          nombre
        )
      )
    `)
    .order("creado_en", { ascending: false });

  if (!data) return [];

  return data.map((pedido: Record<string, unknown>) => {
    const itemsRaw = (pedido.items_pedido as Record<string, unknown>[]) ?? [];
    const items: ItemPedidoConPlato[] = itemsRaw.map((item) => ({
      plato_nombre: ((item.platos as Record<string, unknown>)?.nombre as string) ?? "Plato",
      cantidad: (item.cantidad as number) ?? 1,
      precio_unitario: Number(item.precio_unitario ?? 0),
    }));

    return {
      id: pedido.id as string,
      mesa_id: (pedido.mesa_id as string) ?? null,
      tipo_despacho: (pedido.tipo_despacho as "mesa" | "para_llevar") ?? "mesa",
      estado: pedido.estado as EstadoPedido,
      correo_cliente: (pedido.correo_cliente as string) ?? null,
      total: Number(pedido.total ?? 0),
      paypal_pedido_id: (pedido.paypal_pedido_id as string) ?? null,
      cocinero_id: (pedido.cocinero_id as string) ?? null,
      creado_en: pedido.creado_en as string,
      actualizado_en: pedido.actualizado_en as string,
      items,
    };
  });
}

export async function obtenerStatsCocina(): Promise<StatsCocina> {
  const supabase = await crearCliente();

  const { data: pendientes } = await supabase
    .from("pedidos")
    .select("id")
    .eq("estado", "pendiente");

  const { data: preparando } = await supabase
    .from("pedidos")
    .select("creado_en")
    .eq("estado", "preparando");

  const { data: listos } = await supabase
    .from("pedidos")
    .select("id")
    .eq("estado", "listo");

  const ahora = Date.now();
  let tiempoTotal = 0;
  let countConTiempo = 0;

  if (preparando) {
    for (const p of preparando) {
      const creado = new Date(p.creado_en as string).getTime();
      const diffMin = (ahora - creado) / 60000;
      if (diffMin > 0) {
        tiempoTotal += diffMin;
        countConTiempo++;
      }
    }
  }

  return {
    pendientes: pendientes?.length ?? 0,
    preparando: preparando?.length ?? 0,
    listos: listos?.length ?? 0,
    tiempoPromedioMin: countConTiempo > 0 ? Math.round(tiempoTotal / countConTiempo) : 0,
  };
}
