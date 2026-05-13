# 08 — Evaluación Arquitectónica

Respuestas a los criterios de evaluación del trabajo académico (`docs/trabajo_arquitectura.md`).

---

## 1. ¿Qué problema resuelve?

La latencia en la comunicación entre salón y cocina en restaurantes. E-Kitchen elimina:
- El papel (pedidos digitales directos desde la mesa)
- La espera del mesero para tomar el pedido
- La incertidumbre del cliente sobre el estado de su comida
- Los errores de transcripción de comandas

---

## 2. ¿Qué riesgo evita?

Ver análisis completo en [`docs/07-riesgos/analisis.md`](07-riesgos/analisis.md). Principales riesgos mitigados:

- **Venta de platos agotados:** menú en tiempo real (Observer Pattern)
- **Pedidos duplicados:** idempotencia vía `paypal_pedido_id`
- **Acceso no autorizado:** RLS + autenticación solo para staff

---

## 3. ¿Qué costo añade?

| Costo | Tipo | Estimación |
|---|---|---|
| Supabase | Suscripción mensual | ~$25/mes (plan Pro, 1 proyecto) |
| Cloudinary | Gratuito hasta 25GB | $0/mes inicial |
| PayPal | Comisión por transacción | 2.9% + $0.30 por pago |
| Brevo | Gratuito hasta 300 emails/día | $0/mes inicial |
| Vercel (deploy) | Gratuito (plan Hobby) | $0/mes inicial |

**Costo total estimado inicial:** ~$25/mes + comisiones de PayPal. Escala con el volumen de pedidos, no con usuarios.

---

## 4. ¿Cómo se probará?

Ver detalle completo en `docs/06-pruebas/`:

- **Unitarias (19 casos):** Store del carrito, validaciones de estado, Factory, Strategy
- **Integración (12 casos):** CRUD plato → visibilidad, compra → notificación, ciclo completo de pedido, RLS
- **Carga (5 escenarios):** 50 clientes simultáneos, Realtime broadcast, concurrencia

Herramientas: Vitest, Testing Library, jsdom, k6/Artillery.

---

## 5. ¿Cómo crecerá luego?

| Escenario de crecimiento | Solución arquitectónica |
|---|---|
| Más sucursales | Extraer módulo de Administración a servicio separado. Cada sucursal tiene su propia instancia de Supabase. |
| Más tipos de productos | Factory Method: agregar nueva clase concreta sin modificar el factory existente. |
| Más pasarelas de pago | Strategy Pattern en el Facade de pagos: nueva estrategia sin tocar la UI. |
| Alta concurrencia (>500 pedidos/hora) | Migrar Server Actions a Route Handlers con edge runtime. Agregar Redis para caché de catálogo. |
| App móvil nativa | La API ya existe (Server Actions). Migrar a REST o tRPC exponiendo los mismos endpoints. |

---

## 6. ¿Qué mejora incluye frente a otras existentes?

| Solución existente | Limitación | Mejora de E-Kitchen |
|---|---|---|
| Menú QR genérico (link a PDF) | Estático, no refleja disponibilidad | Catálogo dinámico sincronizado con cocina |
| Apps de delivery (Rappi, Uber Eats) | Comisión alta (20-30%), no integrado con cocina | Sin comisión externa, integración directa cocina-mesero |
| TPV tradicional | Solo caja, no comunicación con cocina | Flujo completo: mesa → cocina → mesa, con trazabilidad |
| Pedidos por WhatsApp | Pérdida de pedidos, sin estructura | Pedidos estructurados con estados y auditoría |
