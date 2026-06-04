"use server";

import { crearCliente } from "@/lib/supabase/server";
import { crearEstrategiaDespacho } from "@/lib/servicios/estrategiaDespacho";
import { mapearPedidoADetalles } from "@/lib/mapeo";
import type { EstadoPedido, Pedido, TipoDespacho, TipoPlato, PedidoConDetalles, ItemPedidoConImagen } from "@/types";

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
  nuevoEstado: EstadoPedido
): Promise<{ exito: boolean; error?: string }> {
  const supabase = await crearCliente();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { exito: false, error: "No autenticado" };
  }

  const rolUsuario = (user.user_metadata?.rol as string | undefined) ??
    ((await supabase.from("perfiles").select("rol").eq("id", user.id).single()).data?.rol as string | undefined);

  if (rolUsuario !== "cocinero" && rolUsuario !== "mesero") {
    return { exito: false, error: "No tienes permiso para cambiar el estado" };
  }

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
      wompi_transaccion_id: (pedido.wompi_transaccion_id as string) ?? null,
      cocinero_id: (pedido.cocinero_id as string) ?? null,
      creado_en: pedido.creado_en as string,
      actualizado_en: pedido.actualizado_en as string,
      items,
    };
  });
}

export async function obtenerItemsPorPedido(
  pedidoId: string
): Promise<ItemPedidoConImagen[]> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("items_pedido")
    .select("cantidad, precio_unitario, platos(nombre, imagen_url, tipo_plato)")
    .eq("pedido_id", pedidoId);

  if (!data) return [];

  return (data as unknown as Array<{
    cantidad: number;
    precio_unitario: number;
    platos: { nombre: string; imagen_url: string | null; tipo_plato: TipoPlato } | null;
  }>).map((item) => ({
    plato_nombre: item.platos?.nombre ?? "Plato",
    plato_imagen_url: item.platos?.imagen_url ?? null,
    plato_tipo: item.platos?.tipo_plato ?? "plato_fuerte",
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }));
}

export async function obtenerStatsCocina(): Promise<StatsCocina> {
  const supabase = await crearCliente();

  const { data } = await supabase
    .from("pedidos")
    .select("estado, creado_en")
    .in("estado", ["pendiente", "preparando", "listo"]);

  let pendientes = 0;
  let preparando = 0;
  let listos = 0;
  let tiempoTotal = 0;
  let countConTiempo = 0;

  if (data) {
    const ahora = Date.now();

    for (const p of data) {
      const estado = p.estado as string;
      if (estado === "pendiente") pendientes++;
      else if (estado === "listo") listos++;
      else if (estado === "preparando") {
        preparando++;
        const creado = new Date(p.creado_en as string).getTime();
        const diffMin = (ahora - creado) / 60000;
        if (diffMin > 0) {
          tiempoTotal += diffMin;
          countConTiempo++;
        }
      }
    }
  }

  return {
    pendientes,
    preparando,
    listos,
    tiempoPromedioMin: countConTiempo > 0 ? Math.round(tiempoTotal / countConTiempo) : 0,
  };
}

export async function obtenerPedidoConDetalles(pedidoId: string): Promise<PedidoConDetalles | null> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("pedidos")
    .select(`
      *,
      mesas (
        numero
      ),
      items_pedido (
        cantidad,
        precio_unitario,
        platos (
          nombre,
          imagen_url,
          tipo_plato
        )
      )
    `)
    .eq("id", pedidoId)
    .single();

  if (!data) return null;
  return mapearPedidoADetalles(data);
}

export async function obtenerTodosPedidosConImagenes(): Promise<PedidoConDetalles[]> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("pedidos")
    .select(`
      *,
      mesas (
        numero
      ),
      items_pedido (
        cantidad,
        precio_unitario,
        platos (
          nombre,
          imagen_url,
          tipo_plato
        )
      )
    `)
    .in("estado", ["pendiente", "preparando", "listo"])
    .order("creado_en", { ascending: false })
    .limit(200);

  if (!data) return [];
  return data.map((pedido) => mapearPedidoADetalles(pedido as Record<string, unknown>));
}

export async function obtenerPedidosListosConDetalles(): Promise<PedidoConDetalles[]> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("pedidos")
    .select(`
      *,
      mesas (
        numero
      ),
      items_pedido (
        cantidad,
        precio_unitario,
        platos (
          nombre,
          imagen_url,
          tipo_plato
        )
      )
    `)
    .eq("estado", "listo")
    .order("creado_en", { ascending: true })
    .limit(100);

  if (!data) return [];
  return data.map((pedido) => mapearPedidoADetalles(pedido as Record<string, unknown>));
}
