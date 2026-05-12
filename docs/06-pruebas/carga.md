# 06 — Pruebas de Carga

## Objetivo

Validar que el sistema soporta la concurrencia esperada de un restaurante en hora pico, especialmente el bus de eventos (Supabase Realtime) y las operaciones de lectura/escritura simultáneas.

## Escenarios de carga

| Escenario | Usuarios simultáneos | Operación | Métrica objetivo |
|---|---|---|---|
| C-01: Catálogo concurrente | 50 clientes | Lectura de `platos` (GET) | p95 < 200ms |
| C-02: Creación de pedidos | 20 clientes | POST crear pedido (Server Action) | p95 < 1s |
| C-03: Realtime: actualización de menú | 50 suscriptores | `UPDATE platos` → broadcast | Latencia de broadcast < 500ms |
| C-04: Realtime: cambio de estado | 10 pedidos activos | `UPDATE pedidos.estado` | Panel cocina recibe en < 300ms |
| C-05: Multiple chefs + meseros | 5 chefs, 5 meseros | Lectura/escritura concurrente en `pedidos` | Sin deadlocks ni race conditions |

## Herramientas recomendadas

| Herramienta | Uso |
|---|---|
| **k6** (Grafana) | Scripts de carga en JavaScript, soporte para WebSockets |
| **Artillery** | Alternativa ligera, YAML-based, buena para APIs HTTP |
| **Supabase Dashboard** | Monitoreo de conexiones Realtime, queries lentas |

## Métricas a observar

- **Supabase:** conexiones activas, queries lentas (>100ms), uso de CPU
- **Next.js:** tiempo de respuesta de Server Actions, cold starts
- **Realtime:** latencia de broadcast, mensajes perdidos

## Mitigaciones si no se cumplen objetivos

| Problema | Acción |
|---|---|
| Realtime lento (>500ms) | Aumentar recursos de Supabase, filtrar canales por mesa/pedido |
| Server Actions lentas (>1s) | Optimistic updates en frontend, caché de platos con `unstable_cache` |
| Muchas conexiones WebSocket | Limitar suscripciones a canales necesarios, no broadcast global |
