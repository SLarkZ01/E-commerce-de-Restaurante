"use server";

import { PagoFacade } from "@/lib/servicios/PagoFacade";
import { NotificacionFacade } from "@/lib/servicios/NotificacionFacade";
import { crearCliente } from "@/lib/supabase/server";
import type { ItemCarrito } from "@/types";
import type { Mesa } from "@/types";

export async function prepararPagoWompi(
  referencia: string,
  montoEnCentavos: number
): Promise<{ publicKey: string; firma: string; error?: string }> {
  if (!PagoFacade.estaConfigurado()) {
    return { publicKey: "", firma: "", error: "Wompi no configurado" };
  }
  const firma = PagoFacade.generarFirma(referencia, montoEnCentavos);
  return { publicKey: PagoFacade.getPublicKey(), firma };
}

export async function crearPedidoWompi(
  mesaUuid: string,
  items: ItemCarrito[],
  total: number,
  wompiTransactionId: string
): Promise<{ pedidoId: string; error?: string }> {
  // 1. Obtener el email del cliente desde Wompi
  const tx = await PagoFacade.obtenerTransaccion(wompiTransactionId);

  // 2. Crear pedido en BD
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
      total,
      correo_cliente: tx.email ?? null,
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

  // 3. Enviar factura por email (no bloquea)
  if (tx.email) {
    const facturaItems = items.map((i) => ({
      nombre: i.nombre,
      cantidad: i.cantidad,
      precio: i.precio,
    }));
    NotificacionFacade.enviarComprobante(
      tx.email,
      nuevoPedido.id,
      total,
      facturaItems,
      mesa.numero
    ).catch((err) => console.error("Error enviando factura:", err));
  }

  return { pedidoId: nuevoPedido.id };
}

export async function obtenerMesaPorUuid(uuid: string): Promise<Mesa | null> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("mesas")
    .select("*")
    .eq("codigo_qr", uuid)
    .single();
  return (data as Mesa) ?? null;
}
