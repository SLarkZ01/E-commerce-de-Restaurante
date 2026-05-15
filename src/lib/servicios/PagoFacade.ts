// Patrón: Facade
// Encapsula la interacción con la API de Wompi.
import { createHash } from "crypto";

const BASE_URL = "https://sandbox.wompi.co/v1";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMBI_PUBLIC_KEY ?? process.env.WOMBI_PUBLIC_KEY ?? "";
const INTEGRITY_SECRET = process.env.WOMBI_INTEGRITY_SECRET ?? "";

export class PagoFacade {
  static getPublicKey(): string {
    return PUBLIC_KEY;
  }

  static estaConfigurado(): boolean {
    return PUBLIC_KEY.length > 0 && INTEGRITY_SECRET.length > 0;
  }

  static generarFirma(referencia: string, montoEnCentavos: number, moneda = "COP"): string {
    const cadena = `${referencia}${montoEnCentavos}${moneda}${INTEGRITY_SECRET}`;
    return createHash("sha256").update(cadena).digest("hex");
  }

  /**
   * Consulta una transacción en Wompi para obtener datos del cliente.
   * Útil para extraer el email del pagador sin pedirlo en nuestro UI.
   */
  static async obtenerTransaccion(id: string): Promise<{
    exito: boolean;
    email?: string;
    estado?: string;
    referencia?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${PUBLIC_KEY}` },
      });

      if (!res.ok) {
        return { exito: false, error: `Wompi API error: ${res.status}` };
      }

      const json = (await res.json()) as {
        data?: {
          status: string;
          reference: string;
          customer_email?: string;
        };
      };

      const data = json.data;
      return {
        exito: true,
        email: data?.customer_email ?? undefined,
        estado: data?.status,
        referencia: data?.reference,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      return { exito: false, error: msg };
    }
  }
}
