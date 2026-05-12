# 04 — State Pattern

## Concepto

El patrón State permite que un objeto altere su comportamiento cuando su estado interno cambia. El objeto parecerá cambiar de clase. Cada estado es una clase que define las transiciones válidas hacia otros estados.

## Aplicación en E-Kitchen

El ciclo de vida de un pedido es una **máquina de estados finitos** con 4 estados y transiciones estrictamente controladas.

### Estados y transiciones

| Estado actual | Transición permitida | ¿Quién la ejecuta? | Validación |
|---|---|---|---|
| `pendiente` | → `preparando` | Cocinero | El pedido debe estar en `pendiente` |
| `preparando` | → `listo` | Cocinero | El pedido debe estar en `preparando` |
| `listo` | → `entregado` | Mesero | El pedido debe estar en `listo` |
| `entregado` | — (terminal) | — | No se permiten más transiciones |

### Transiciones inválidas (bloqueadas)

- ❌ `pendiente` → `listo` (debe pasar por `preparando`)
- ❌ `pendiente` → `entregado` (debe pasar por `preparando` y `listo`)
- ❌ `preparando` → `entregado` (solo el mesero puede entregar)
- ❌ `listo` → `preparando` (no se puede retroceder)
- ❌ `entregado` → cualquier estado (terminal)

### Implementación

La validación se hace a nivel de **Server Action**. Antes de actualizar el estado, se verifica que la transición sea válida:

- **Schema:** `src/lib/db/schema.ts:14-19` — enum `estadoPedidoEnum`
- **Tabla pedidos:** `src/lib/db/schema.ts:66-77` — columna `estado` usa el enum

Cada Server Action de cambio de estado incluye una validación:
```
SI estado_actual NO es el esperado → error 400
SI rol del usuario NO coincide con el requerido → error 403
```

## Diagrama de estados

Ver `docs/03-arquitectura/flujos.md` — Flujo 2: Ciclo de vida del pedido.
