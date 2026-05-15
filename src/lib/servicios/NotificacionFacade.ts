// Patrón: Facade
// Encapsula la interacción con la API de Brevo para envío de emails.

const API_KEY = process.env.BREVO_API_KEY ?? "";
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? "no-reply@ekitchen.com";
const FROM_NAME = process.env.BREVO_FROM_NAME ?? "E-Kitchen";

export interface ResultadoEnvio {
  exito: boolean;
  error?: string;
}

export interface ItemFactura {
  nombre: string;
  cantidad: number;
  precio: number;
}

function construirFacturaHTML(
  pedidoId: string,
  total: number,
  items: ItemFactura[],
  mesaNumero?: number
): string {
  const fecha = new Date().toLocaleDateString("es-CO", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const filas = items
    .map(
      (item) => `
    <tr style="border-bottom:1px solid #e8e0d5">
      <td style="padding:10px 8px;font-size:14px;color:#2d2a26;font-family:Georgia,serif">
        ${item.nombre}
      </td>
      <td style="padding:10px 8px;text-align:center;font-size:13px;color:#8c8c8c;font-family:Georgia,serif">
        x${item.cantidad}
      </td>
      <td style="padding:10px 8px;text-align:right;font-size:14px;color:#2d2a26;font-family:Georgia,serif;white-space:nowrap">
        $ ${(item.precio * item.cantidad).toLocaleString("es-CO")}
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f0eb">
  <div style="max-width:480px;margin:20px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">

    <!-- Cabecera -->
    <div style="background:linear-gradient(135deg,#c8a96e,#a88b5e);padding:28px 24px;text-align:center">
      <h1 style="color:#fff;font-size:22px;margin:0;font-family:Georgia,serif;font-weight:normal">
        E-Kitchen
      </h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:6px 0 0;font-family:Georgia,serif">
        Gracias por tu compra
      </p>
    </div>

    <!-- Cuerpo -->
    <div style="padding:20px 24px">

      <!-- Info del pedido -->
      <div style="margin-bottom:20px">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="font-size:12px;color:#8c8c8c;padding-bottom:2px;font-family:Georgia,serif">Pedido</td>
            <td style="font-size:12px;color:#8c8c8c;padding-bottom:2px;text-align:right;font-family:Georgia,serif">Fecha</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#2d2a26;font-weight:bold;font-family:Georgia,serif">
              #${pedidoId.slice(0, 8).toUpperCase()}
            </td>
            <td style="font-size:13px;color:#5c5c5c;text-align:right;font-family:Georgia,serif">
              ${fecha}
            </td>
          </tr>
        </table>
        ${mesaNumero ? `<p style="font-size:12px;color:#8c8c8c;margin:4px 0 0;font-family:Georgia,serif">Mesa ${mesaNumero}</p>` : ""}
      </div>

      <div style="height:1px;background:#e8e0d5;margin-bottom:16px"></div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tbody>
          ${filas}
        </tbody>
      </table>

      <div style="height:1px;background:#e8e0d5;margin-bottom:16px"></div>

      <!-- Total -->
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="font-size:16px;font-weight:bold;color:#2d2a26;font-family:Georgia,serif">Total</td>
          <td style="font-size:20px;font-weight:bold;color:#c8a96e;text-align:right;font-family:Georgia,serif">
            $ ${total.toLocaleString("es-CO")}
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;background:#faf8f5;border-top:1px solid #e8e0d5;text-align:center">
      <p style="font-size:11px;color:#8c8c8c;margin:0;font-family:Georgia,serif">
        Pagado con Wompi · Bancolombia<br>
        E-Kitchen — Tu cocina, más cerca
      </p>
    </div>
  </div>
</body>
</html>`;
}

export class NotificacionFacade {
  /**
   * Envía la factura de compra al cliente por email.
   */
  static async enviarComprobante(
    email: string,
    pedidoId: string,
    total: number,
    items: ItemFactura[],
    mesaNumero?: number
  ): Promise<ResultadoEnvio> {
    if (!API_KEY) {
      console.warn("NotificacionFacade: BREVO_API_KEY no configurada — email no enviado");
      return { exito: false, error: "Brevo no configurado" };
    }

    try {
      const html = construirFacturaHTML(pedidoId, total, items, mesaNumero);

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: FROM_NAME, email: FROM_EMAIL },
          to: [{ email }],
          subject: `Tu pedido en E-Kitchen #${pedidoId.slice(0, 8).toUpperCase()}`,
          htmlContent: html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("Brevo error:", res.status, body.slice(0, 200));
        return { exito: false, error: `Brevo: ${res.status}` };
      }

      return { exito: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      console.error("NotificacionFacade error:", msg);
      return { exito: false, error: msg };
    }
  }
}
