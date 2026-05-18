"use server";

import { revalidatePath } from "next/cache";
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
  wompiTransactionId: string,
  emailCliente?: string
): Promise<{ pedidoId: string; error?: string }> {
  // 1. Obtener el email del cliente desde Wompi (API) o del widget (callback)
  const tx = await PagoFacade.obtenerTransaccion(wompiTransactionId);
  const email = tx.email ?? emailCliente ?? null;

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

  const pedidoId = crypto.randomUUID();

  const { error: errPedido } = await supabase
    .from("pedidos")
    .insert({
      id: pedidoId,
      mesa_id: mesa.id,
      estado: "pendiente",
      total,
      correo_cliente: email,
    });

  if (errPedido) {
    return { pedidoId: "", error: "Error al crear el pedido" };
  }

  const itemsInsert = items.map((item) => ({
    pedido_id: pedidoId,
    plato_id: item.id,
    cantidad: item.cantidad,
    precio_unitario: item.precio,
  }));

  await supabase.from("items_pedido").insert(itemsInsert);

  // 3. Enviar factura por email (no bloquea)
  if (email) {
    const facturaItems = items.map((i) => ({
      nombre: i.nombre,
      cantidad: i.cantidad,
      precio: i.precio,
      imagenUrl: i.imagenUrl,
    }));
    NotificacionFacade.enviarComprobante(
      email,
      pedidoId,
      total,
      facturaItems,
      mesa.numero
    ).then((resultado) => {
      if (!resultado.exito) {
        console.error("[Brevo] Error enviando factura:", resultado.error);
      } else {
        console.log("[Brevo] Factura enviada a", email);
      }
    }).catch((err) => console.error("[Brevo] Error enviando factura:", err));
  } else {
    console.warn("[Brevo] Email del cliente no disponible — factura no enviada");
  }

  revalidatePath("/cocina");
  return { pedidoId };
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
