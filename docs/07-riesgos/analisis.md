# 07 — Análisis de Riesgos

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R-01 | **Inconsistencia de datos por red inestable** (cliente pierde conexión durante el pago) | Media | Alto | Optimistic Updates en frontend con rollback. Server Action valida estrictamente antes de escribir. Wompi maneja reintentos. |
| R-02 | **Supabase Realtime pierde mensajes** (WebSocket desconectado) | Baja | Alto | Reconexión automática del cliente Supabase. Polling de respaldo cada 30s en paneles críticos (cocina). |
| R-03 | **Pago duplicado** (cliente hace doble clic en "Pagar") | Media | Alto | Idempotencia vía `wompi_transaccion_id` único. Server Action verifica que no exista pedido con ese ID antes de crear. |
| R-04 | **Chef deshabilita plato que está en un carrito activo** | Alta | Medio | El carrito no se modifica. Al intentar pagar, Server Action valida que todos los platos sigan `disponibles = true`. Si no, muestra error y actualiza carrito. |
| R-05 | **Escalación de costos de Supabase** en producción | Media | Medio | Plan gratuito generoso para desarrollo. En producción, límites de RLS + connection pooling. Monitoreo de uso. |
| R-06 | **Brecha de seguridad RLS mal configurada** (cliente anónimo modifica datos) | Baja | Crítico | Tests automatizados de RLS (I-10, I-11). Revisión manual de políticas antes de deploy. |
| R-07 | **Imágenes grandes degradan rendimiento del menú** | Alta | Bajo | Cloudinary optimiza automáticamente (compresión, WebP, tamaños responsivos). Lazy loading en frontend. |
| R-08 | **Dependencia de servicio externo caído** (Wompi, Cloudinary, Brevo) | Baja | Alto | Fallback graceful: si Wompi falla, el pedido no se crea (no hay pérdida de dinero). Si Cloudinary falla, se muestra placeholder. Si Brevo falla, el pedido se crea igual (el email es secundario). |

## Supuestos

1. El restaurante tiene conexión a internet estable (WiFi para mesas, ethernet para cocina)
2. Una sola sucursal en la versión inicial (el monolito es suficiente)
3. El personal (chef, mesero, admin) tiene acceso a un dispositivo con navegador (tablet, laptop o teléfono)
4. Los clientes tienen un smartphone con lector de QR y conexión a internet
5. Wompi está disponible en el país del restaurante (Colombia)
