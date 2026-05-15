# 04 — Facade Pattern

## Concepto

El patrón Facade proporciona una interfaz unificada para un conjunto de interfaces en un subsistema. Define un punto de entrada de nivel superior que hace que el subsistema sea más fácil de usar.

## Aplicación en E-Kitchen

Tres servicios externos requieren integración: **Wompi** (pagos), **Cloudinary** (imágenes) y **Brevo** (emails). Cada uno tiene su propia API, autenticación y manejo de errores. El Facade centraliza estas interacciones para que el resto de la aplicación no dependa directamente de ellas.

### Fachadas implementadas

| Fachada | Archivo | Servicio | Estado | Métodos expuestos |
|---|---|---|---|---|
| `PagoFacade` | `src/lib/servicios/PagoFacade.ts` | Wompi | ✅ **Implementado** | `getPublicKey()`, `estaConfigurado()`, `generarFirma()`, `obtenerTransaccion()` |
| `MediaFacade` | `src/lib/servicios/mediaFacade.ts` | Cloudinary | ✅ **Implementado** | `subirImagen()`, `eliminarImagen()`, `firmarParametros()` |
| `NotificacionFacade` | `src/lib/servicios/NotificacionFacade.ts` | Brevo | ✅ **Implementado** | `enviarComprobante()` |

### PagoFacade — Wompi

```typescript
// src/lib/servicios/PagoFacade.ts
export class PagoFacade {
  static getPublicKey(): string { ... }
  static estaConfigurado(): boolean { ... }
  static generarFirma(referencia, montoEnCentavos, moneda): string { ... }
  static async obtenerTransaccion(id): Promise<{ exito, email?, estado?, referencia?, error? }> { ... }
}
```

| Método | Descripción | ¿Quién lo usa? |
|---|---|---|
| `generarFirma(ref, monto)` | Genera firma SHA256 de integridad (server-side) | `acciones/pago.ts` → `prepararPagoWompi()` |
| `obtenerTransaccion(id)` | Consulta una transacción en Wompi para extraer el email | `acciones/pago.ts` → `crearPedidoWompi()` |

### MediaFacade — Cloudinary

```typescript
// src/lib/servicios/mediaFacade.ts
export class MediaFacade {
  static async subirImagen(buffer, opciones): Promise<{ secureUrl }> { ... }
  static async eliminarImagen(publicId): Promise<void> { ... }
  static firmarParametros(parametros): string { ... }
}
```

| Método | Descripción | ¿Quién lo usa? |
|---|---|---|
| `subirImagen(buffer, opciones)` | Sube una imagen a Cloudinary | `acciones/imagenes.ts` → `subirImagenPlato()` |

### NotificacionFacade — Brevo

```typescript
// src/lib/servicios/NotificacionFacade.ts
export class NotificacionFacade {
  static async enviarComprobante(email, pedidoId, total, items, mesaNumero?): Promise<ResultadoEnvio> { ... }
}
```

| Método | Descripción | ¿Quién lo usa? |
|---|---|---|
| `enviarComprobante(email, ...)` | Envía factura HTML al cliente | `acciones/pago.ts` → `crearPedidoWompi()` |

### Beneficio clave

Si mañana se cambia Wompi por otra pasarela, o Brevo por SendGrid, **solo se modifica la fachada correspondiente**. El resto del código (UI, Server Actions, lógica de negocio) no se toca.
