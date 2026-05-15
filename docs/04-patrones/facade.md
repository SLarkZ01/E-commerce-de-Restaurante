# 04 — Facade Pattern

## Concepto

El patrón Facade proporciona una interfaz unificada para un conjunto de interfaces en un subsistema. Define un punto de entrada de nivel superior que hace que el subsistema sea más fácil de usar.

## Aplicación en E-Kitchen

Tres servicios externos requieren integración: **PayPal** (pagos), **Cloudinary** (imágenes) y **Brevo** (emails). Cada uno tiene su propia API, autenticación y manejo de errores. El Facade centraliza estas interacciones para que el resto de la aplicación no dependa directamente de ellas.

### Fachadas implementadas

| Fachada | Archivo | Servicio | Estado | Métodos expuestos |
|---|---|---|---|---|
| `MediaFacade` | `src/lib/servicios/mediaFacade.ts` | Cloudinary | ✅ **Implementado** | `subirImagen()`, `eliminarImagen()`, `firmarParametros()` |
| `PagoFacade` | `src/lib/servicios/PagoFacade.ts` | PayPal | ✅ **Implementado** | `crearOrden()`, `capturarOrden()` |
| `NotificacionFacade` | `src/lib/servicios/NotificacionFacade.ts` | Brevo | ✅ **Implementado** | `enviarComprobante()` |

> **Nota:** Los archivos con prefijo `_` (ej: `_PagoFacade.ts`) son esqueletos listos para implementar. Las interfaces, métodos y tipos ya están definidos. Solo falta integrar los SDKs correspondientes.

### MediaFacade — Implementación real

| Método | Descripción | ¿Quién lo usa? |
|---|---|---|
| `crearOrden(total)` | Crea una orden de pago en PayPal (COP) | `acciones/pago.ts` → `PayPalButton.tsx` |
| `capturarOrden(ordenId)` | Captura el pago después de aprobación del cliente | `acciones/pago.ts` → `capturarYCrearPedido()` |

```typescript
// src/lib/acciones/pago.ts — uso real de PagoFacade
export async function capturarYCrearPedido(ordenId, mesaUuid, items, total) {
  // 1. Capturar el pago en PayPal
  const captura = await PagoFacade.capturarOrden(ordenId);
  if (!captura.exito) return { pedidoId: "", error: captura.error };

  // 2. Crear el pedido en Supabase
  const { data: nuevoPedido } = await supabase.from("pedidos").insert(...);
  return { pedidoId: nuevoPedido.id };
}
```

### PayPalButton — Componente cliente

```typescript
// src/components/cliente/PayPalButton.tsx
<PayPalScriptProvider options={{ clientId, currency: "COP", intent: "capture" }}>
  <PayPalButtons
    createOrder={onCrearOrden}       // → PagoFacade.crearOrden()
    onApprove={onAprobar}            // → capturarYCrearPedido()
    onError={onError}
  />
</PayPalScriptProvider>
```

### Beneficio clave

Si mañana se cambia PayPal por Stripe, o Brevo por SendGrid, **solo se modifica la fachada correspondiente**. El resto del código (UI, Server Actions, lógica de negocio) no se toca. Los archivos con prefijo `_` están diseñados para que al implementar el SDK real, solo haya que rellenar los métodos sin cambiar la interfaz.
