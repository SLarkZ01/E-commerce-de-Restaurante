"use server";

import { crearCliente } from "@/lib/supabase/server";
import type { Pedido } from "@/types";

/**
 * Server Action pública para consultar un pedido por ID (anónimo).
 * Usada por el modal de rastreo del cliente.
 *
 * Soporta búsqueda por prefijo (8 caracteres mostrados en email/sheet).
 * Usa la función RPC `buscar_pedido_por_prefijo` que castea UUID → text
 * y aplica ILIKE para búsqueda case-insensitive.
 */
export async function obtenerEstadoPedidoPublico(
  pedidoId: string
): Promise<Pedido | null> {
  const supabase = await crearCliente();
  const idLimpio = pedidoId.trim().replace(/^#/, "");

  if (!idLimpio) return null;

  const { data, error } = await supabase
    .rpc("buscar_pedido_por_prefijo", { prefijo: idLimpio });

  if (error) {
    console.error("[pedidoPublico] Error buscando pedido:", error);
    return null;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) return null;

  return (Array.isArray(data) ? data[0] : data) as Pedido;
}
