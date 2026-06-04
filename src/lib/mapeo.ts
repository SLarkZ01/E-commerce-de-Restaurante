import type { TipoPlato, EstadoPedido, PedidoConDetalles, ItemPedidoConImagen } from "@/types";

export function mapearPedidoADetalles(
  pedido: Record<string, unknown>
): PedidoConDetalles {
  const mesaData = (pedido.mesas as Record<string, unknown> | null) ?? null;
  const itemsRaw = (pedido.items_pedido as Record<string, unknown>[]) ?? [];
  const items: ItemPedidoConImagen[] = itemsRaw.map((item) => {
    const plato = (item.platos as Record<string, unknown>) ?? {};
    return {
      plato_nombre: (plato.nombre as string) ?? "Plato",
      plato_imagen_url: (plato.imagen_url as string) ?? null,
      plato_tipo: (plato.tipo_plato as TipoPlato) ?? "plato_fuerte",
      cantidad: (item.cantidad as number) ?? 1,
      precio_unitario: Number(item.precio_unitario ?? 0),
    };
  });

  return {
    id: pedido.id as string,
    mesa_id: (pedido.mesa_id as string) ?? null,
    mesa_numero: mesaData ? (mesaData.numero as number | null) : null,
    tipo_despacho:
      (pedido.tipo_despacho as "mesa" | "para_llevar") ?? "mesa",
    estado: pedido.estado as EstadoPedido,
    correo_cliente: (pedido.correo_cliente as string) ?? null,
    total: Number(pedido.total ?? 0),
    wompi_transaccion_id:
      (pedido.wompi_transaccion_id as string) ?? null,
    cocinero_id: (pedido.cocinero_id as string) ?? null,
    creado_en: pedido.creado_en as string,
    actualizado_en: pedido.actualizado_en as string,
    items,
  };
}
