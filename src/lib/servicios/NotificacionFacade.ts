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
  imagenUrl: string | null;
}

function construirMiniaturaPlato(imagenUrl: string | null, nombre: string): string {
  const inicial = nombre.charAt(0).toUpperCase();
  if (imagenUrl) {
    return `<img src="${imagenUrl}" alt="${nombre}" width="56" height="56" style="display:block;width:56px;height:56px;border-radius:8px;object-fit:cover;border:1px solid #e8e0d5" />`;
  }
  return `<div style="width:56px;height:56px;border-radius:8px;background:linear-gradient(135deg,#d4a574,#c8a96e);text-align:center;line-height:56px;font-family:Georgia,serif;font-size:22px;color:#ffffff;font-weight:bold;border:1px solid #d4a574">${inicial}</div>`;
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
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0ebe3" colspan="3">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="width:56px;vertical-align:top;padding-right:14px">
              ${construirMiniaturaPlato(item.imagenUrl, item.nombre)}
            </td>
            <td style="vertical-align:top">
              <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#2d2a26;font-family:Georgia,serif;line-height:1.3">${item.nombre}</p>
              <p style="margin:0;font-size:13px;color:#a88b5e;font-family:Georgia,serif">x${item.cantidad}</p>
            </td>
            <td style="vertical-align:top;text-align:right;white-space:nowrap">
              <span style="font-size:15px;font-weight:600;color:#2d2a26;font-family:Georgia,serif">
                $ ${(item.precio * item.cantidad).toLocaleString("es-CO")}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#fefaf6">
  <table role="presentation" style="width:100%;border-collapse:collapse">
    <tr>
      <td align="center" style="padding:24px 16px">

        <table role="presentation" style="width:100%;max-width:520px;border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">

          <!-- Cabecera -->
          <tr>
            <td style="background:linear-gradient(135deg,#c44536,#a8382c);padding:32px 28px;text-align:center">
              <table role="presentation" style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="padding-bottom:10px">
                    <span style="display:inline-block;width:44px;height:44px;line-height:44px;background:rgba(255,255,255,0.15);border-radius:12px;font-size:22px;color:#ffffff;text-align:center">&#127860;</span>
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Georgia,serif;font-size:22px;color:#ffffff;font-weight:normal;letter-spacing:0.5px">
                    E-Kitchen
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Georgia,serif;font-size:13px;color:rgba(255,255,255,0.8);padding-top:6px">
                    Gracias por tu compra
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info del pedido -->
          <tr>
            <td style="padding:24px 28px 0">
              <table role="presentation" style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="font-family:Georgia,serif;font-size:11px;color:#a8a29e;text-transform:uppercase;letter-spacing:1px;padding-bottom:4px">Pedido</td>
                  <td style="font-family:Georgia,serif;font-size:11px;color:#a8a29e;text-transform:uppercase;letter-spacing:1px;padding-bottom:4px;text-align:right">Fecha</td>
                </tr>
                <tr>
                  <td style="font-family:Georgia,serif;font-size:16px;color:#2d2a26;font-weight:bold">
                    #${pedidoId.slice(0, 8).toUpperCase()}
                  </td>
                  <td style="font-family:Georgia,serif;font-size:13px;color:#78716c;text-align:right">
                    ${fecha}
                  </td>
                </tr>
                ${mesaNumero ? `<tr><td colspan="2" style="font-family:Georgia,serif;font-size:12px;color:#a8a29e;padding-top:4px">Mesa ${mesaNumero}</td></tr>` : ""}
              </table>
            </td>
          </tr>

          <!-- Divisor -->
          <tr>
            <td style="padding:18px 28px 0">
              <div style="height:1px;background:#e7e0d8"></div>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:4px 28px 0">
              <table role="presentation" style="width:100%;border-collapse:collapse">
                ${filas}
              </table>
            </td>
          </tr>

          <!-- Divisor -->
          <tr>
            <td style="padding:0 28px">
              <div style="height:1px;background:#e7e0d8;margin-top:8px"></div>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding:20px 28px 24px">
              <table role="presentation" style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#2d2a26">Total</td>
                  <td style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#c44536;text-align:right">
                    $ ${total.toLocaleString("es-CO")}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 28px;background:#faf8f5;border-top:1px solid #e7e0d8;text-align:center">
              <table role="presentation" style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="font-family:Georgia,serif;font-size:11px;color:#a8a29e;line-height:1.6">
                    Pagado con Wompi &middot; Bancolombia<br>
                    E-Kitchen &mdash; Tu cocina, m&aacute;s cerca
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
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
