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

La máquina de estados se implementa en la **Server Action** `cambiarEstadoPedido`. Antes de actualizar, se validan dos cosas:

1. **Transición válida:** `TRANSICIONES_VALIDAS[estadoActual]` contiene `nuevoEstado`
2. **Rol autorizado:** solo `mesero` puede marcar como `entregado`

### Referencia en el código

| Componente | Archivo | Descripción |
|---|---|---|
| **Máquina de estados** | `src/lib/acciones/cocina.ts:6-11` | `TRANSICIONES_VALIDAS` — mapa de estados → transiciones permitidas |
| **Validación de transición** | `src/lib/acciones/cocina.ts:50-58` | Verifica que `nuevoEstado` esté en las transiciones válidas |
| **Validación de rol** | `src/lib/acciones/cocina.ts:60-65` | Solo mesero puede marcar `entregado` |
| **Actualización** | `src/lib/acciones/cocina.ts:67-70` | `UPDATE pedidos SET estado = nuevoEstado` |
| **Strategy integrado** | `src/lib/acciones/cocina.ts:73-76` | Al llegar a `entregado`, ejecuta `crearEstrategiaDespacho().alEntregar()` |
| **Enum de estados** | `src/lib/db/schema.ts` | `estadoPedidoEnum` |
| **Tipos** | `src/types/index.ts` | `EstadoPedido` |
| **Hook consumidor** | `src/hooks/usePedidos.ts` | `cambiarEstado()` expone la acción a los componentes |

### Flujo de validación

```typescript
// src/lib/acciones/cocina.ts — cambiarEstadoPedido
const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente: ["preparando"],
  preparando: ["listo"],
  listo: ["entregado"],
  entregado: [],
};

// 1. Validar transición
const validas = TRANSICIONES_VALIDAS[estadoActual];
if (!validas.includes(nuevoEstado)) {
  return { exito: false, error: `Transición inválida: ${estadoActual} → ${nuevoEstado}` };
}

// 2. Validar rol
if (nuevoEstado === "entregado" && rolUsuario !== "mesero") {
  return { exito: false, error: "Solo el mesero puede marcar como entregado" };
}

// 3. Actualizar
await supabase.from("pedidos").update({ estado: nuevoEstado }).eq("id", pedidoId);

// 4. Strategy (cuando llega a entregado)
if (nuevoEstado === "entregado") {
  const estrategia = crearEstrategiaDespacho(pedidoActual.tipo_despacho);
  await estrategia.alEntregar(pedidoActual);
}
```

### Diagrama de estados

```
     ┌──────────┐     ┌────────────┐     ┌───────┐     ┌───────────┐
     │ pendiente │ ──→ │ preparando │ ──→ │ listo │ ──→ │ entregado │
     └──────────┘     └────────────┘     └───────┘     └───────────┘
       (cocinero)        (cocinero)       (mesero)        (terminal)
```
