# 04 — Facade

## Concepto

El patrón Facade proporciona una interfaz unificada para un conjunto de interfaces de un subsistema. Define un punto de entrada de alto nivel que hace que el subsistema sea más fácil de usar, ocultando su complejidad interna.

---

## Aplicación en E-Kitchen

Tres servicios externos requieren integración: **Wompi** (pagos), **Cloudinary** (imágenes) y **Brevo** (emails). Cada uno tiene su propia API, autenticación y manejo de errores. Las fachadas centralizan estas interacciones para que el resto de la aplicación no dependa directamente de ellas.

### Fachadas implementadas

| Fachada | Archivo | Servicio | Métodos expuestos |
|---|---|---|---|
| `PagoFacade` | `src/lib/servicios/PagoFacade.ts` | **Wompi** | `getPublicKey()`, `estaConfigurado()`, `generarFirma()`, `obtenerTransaccion()` |
| `MediaFacade` | `src/lib/servicios/mediaFacade.ts` | **Cloudinary** | `subirImagen()`, `subirImagenDesdeUrl()`, `eliminarImagen()`, `extraerPublicId()`, `firmarParametros()` |
| `NotificacionFacade` | `src/lib/servicios/NotificacionFacade.ts` | **Brevo** | `enviarComprobante()` |

---

### PagoFacade — Wompi

**Archivo:** `src/lib/servicios/PagoFacade.ts`

Encapsula la autenticación (API keys), la generación de firmas de integridad (SHA256) y la consulta de transacciones:

```typescript
export class PagoFacade {
  static getPublicKey(): string { /* retorna NEXT_PUBLIC_WOMBI_PUBLIC_KEY */ }
  static estaConfigurado(): boolean { /* verifica que las keys estén seteadas */ }
  static generarFirma(referencia: string, montoEnCentavos: number, moneda = "COP"): string {
    const cadena = `${referencia}${montoEnCentavos}${moneda}${INTEGRITY_SECRET}`;
    return createHash("sha256").update(cadena).digest("hex");
  }
  static async obtenerTransaccion(id: string): Promise<{ exito, email?, estado?, referencia?, error? }> {
    // HTTP GET a https://sandbox.wompi.co/v1/transactions/{id}
  }
}
```

**Consumidor:** `src/lib/acciones/pago.ts`

```typescript
// prepararPagoWompi() usa PagoFacade.estaConfigurado(), .generarFirma(), .getPublicKey()
// crearPedidoWompi() usa PagoFacade.obtenerTransaccion() para extraer el email
```

---

### MediaFacade — Cloudinary

**Archivo:** `src/lib/servicios/mediaFacade.ts`

Encapsula la configuración del SDK, la subida por stream, la subida desde URL, el borrado y la extracción de public IDs:

```typescript
export class MediaFacade {
  static async subirImagen(fileBuffer: Buffer, options?): Promise<ResultadoSubida> {
    // Configura cloudinary.v2.uploader.upload_stream con folder, resource_type, overwrite
  }
  static async eliminarImagen(publicId: string): Promise<boolean> {
    // cloudinary.v2.uploader.destroy(publicId, { resource_type: "image", invalidate: true })
  }
  static extraerPublicId(url: string): string | null {
    // Extrae el public ID de una URL de Cloudinary usando regex
  }
}
```

**Consumidor:** `src/lib/acciones/imagenes.ts` y `src/lib/acciones/catalogo.ts`

```typescript
// subirImagenPlato() → MediaFacade.subirImagen(buffer, { folder: "e-kitchen/platos" })
// actualizarPlato() → MediaFacade.eliminarImagen(oldPublicId) si cambia la imagen
```

---

### NotificacionFacade — Brevo

**Archivo:** `src/lib/servicios/NotificacionFacade.ts`

Encapsula la API de Brevo, la construcción de la plantilla HTML del comprobante y el envío:

```typescript
export class NotificacionFacade {
  static async enviarComprobante(
    email: string, pedidoId: string, total: number,
    items: ItemFactura[], mesaNumero?: number
  ): Promise<ResultadoEnvio> {
    // Construye HTML completo con cabecera, items con miniaturas, total, footer
    // HTTP POST a https://api.brevo.com/v3/smtp/email
  }
}
```

**Consumidor:** `src/lib/acciones/pago.ts:78-90`

```typescript
// crearPedidoWompi() → NotificacionFacade.enviarComprobante(email, pedidoId, total, facturaItems, mesa.numero)
// Se ejecuta en fire-and-forget (no bloquea la creación del pedido)
```

---

## Referencia completa en el código

| Fachada | Archivo | Consumidores | Tests |
|---|---|---|---|
| `PagoFacade` | `src/lib/servicios/PagoFacade.ts` | `acciones/pago.ts`, `hooks/usePago.ts` | `tests/unitarias/servicios/pagoFacade.test.ts` |
| `MediaFacade` | `src/lib/servicios/mediaFacade.ts` | `acciones/imagenes.ts`, `acciones/catalogo.ts`, `compartidos/ImageDropzone.tsx` | — |
| `NotificacionFacade` | `src/lib/servicios/NotificacionFacade.ts` | `acciones/pago.ts` | `tests/unitarias/servicios/notificacionFacade.test.ts` |

---

## Beneficio clave

Si mañana se cambia Wompi por otra pasarela, Cloudinary por S3, o Brevo por SendGrid, **solo se modifica la fachada correspondiente**. El resto del código (Server Actions, hooks, componentes) no se toca.
