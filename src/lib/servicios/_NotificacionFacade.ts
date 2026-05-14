// TODO: Implementar cuando se integre Brevo (Sendinblue)
// Fachada para notificaciones — encapsula templates de email y envío

import type { ResultadoOperacion } from "@/types";

export class NotificacionFacade {
  /**
   * Envía el comprobante de compra al cliente.
   * @param email - Correo del cliente
   * @param pedidoId - ID del pedido creado
   * @param total - Total pagado en COP
   */
  static async enviarComprobante(
    email: string,
    pedidoId: string,
    total: number
  ): Promise<ResultadoOperacion> {
    // TODO: Integrar SDK de Brevo
    // 1. Autenticar con API key
    // 2. Usar template de "comprobante de compra"
    // 3. Reemplazar variables: {{pedidoId}}, {{total}}, {{fecha}}
    throw new Error("NotificacionFacade.enviarComprobante: no implementado");
  }

  /**
   * Notifica al cliente que su pedido está listo para recoger.
   * @param email - Correo del cliente
   * @param pedidoId - ID del pedido
   */
  static async enviarAvisoCocina(
    email: string,
    pedidoId: string
  ): Promise<ResultadoOperacion> {
    // TODO: Integrar SDK de Brevo
    // 1. Usar template de "pedido listo"
    // 2. Reemplazar variables: {{pedidoId}}
    throw new Error("NotificacionFacade.enviarAvisoCocina: no implementado");
  }
}
