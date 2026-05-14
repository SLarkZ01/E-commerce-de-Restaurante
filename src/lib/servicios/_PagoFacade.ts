// TODO: Implementar cuando se integre PayPal
// Fachada para pagos — encapsula autenticación OAuth2, creación de órdenes y captura

import type { ResultadoOperacion } from "@/types";

interface OrdenPago {
  ordenId: string;
  aprobado: boolean;
}

export class PagoFacade {
  /**
   * Crea una orden de pago en PayPal.
   * @param total - Monto en COP (sin centavos)
   * @returns ID de la orden de PayPal
   */
  static async crearOrden(total: number): Promise<ResultadoOperacion<string>> {
    // TODO: Integrar SDK de PayPal
    // 1. Autenticar con OAuth2 (client_id + secret)
    // 2. POST /v2/checkout/orders con amount en COP
    // 3. Retornar orderID
    throw new Error("PagoFacade.crearOrden: no implementado");
  }

  /**
   * Captura (finaliza) un pago ya aprobado.
   * @param ordenId - ID de la orden de PayPal
   */
  static async capturarPago(ordenId: string): Promise<ResultadoOperacion<OrdenPago>> {
    // TODO: Integrar SDK de PayPal
    // 1. POST /v2/checkout/orders/{ordenId}/capture
    // 2. Verificar estado "COMPLETED"
    throw new Error("PagoFacade.capturarPago: no implementado");
  }
}
