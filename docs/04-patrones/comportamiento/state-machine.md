# 04 — State Machine (Table-Driven)

## Concepto

Una máquina de estados finitos (FSM) define los estados posibles de una entidad y las transiciones permitidas entre ellos. En la variante **table-driven**, las reglas de transición se definen como datos (tabla/diccionario) en lugar de lógica condicional dispersa. Es una alternativa más mantenible que los `switch` o `if/else` anidados.

Se diferencia del patrón State clásico de GoF (que usa clases polimórficas por estado) en que aquí los estados y transiciones son **datos**, no clases.

---

## Aplicación en E-Kitchen

El ciclo de vida de un pedido es una máquina de estados finitos con 4 estados y transiciones estrictamente controladas.

### Estados y transiciones

```
     ┌──────────┐     ┌────────────┐     ┌───────┐     ┌───────────┐
     │ pendiente │ ──▶ │ preparando │ ──▶ │ listo │ ──▶ │ entregado │
     └──────────┘     └────────────┘     └───────┘     └───────────┘
```

| Estado actual | Transición permitida | ¿Quién la ejecuta? |
|---|---|---|
| `pendiente` | → `preparando` | Cocinero o mesero |
| `preparando` | → `listo` | Cocinero o mesero |
| `listo` | → `entregado` | Solo mesero |
| `entregado` | — (terminal) | — |

### Transiciones inválidas (bloqueadas)

- ❌ `pendiente` → `listo` (debe pasar por `preparando`)
- ❌ `pendiente` → `entregado` (debe pasar por `preparando` y `listo`)
- ❌ `preparando` → `entregado` (no en las transiciones válidas)
- ❌ `listo` → `preparando` (no se puede retroceder)
- ❌ `entregado` → cualquier estado (terminal)

---

## Implementación

La máquina de estados se define como una **tabla de transiciones** (diccionario `Record<Estado, Estado[]>`), no como clases polimórficas.

**Archivo:** `src/lib/acciones/cocina.ts:7-12`

```typescript
const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente: ["preparando"],
  preparando: ["listo"],
  listo: ["entregado"],
  entregado: [],
};
```

La validación es O(1) — búsqueda en diccionario + `includes()`:

```typescript
// src/lib/acciones/cocina.ts:68-75
const estadoActual = pedidoActual.estado as EstadoPedido;
const validas = TRANSICIONES_VALIDAS[estadoActual];

if (!validas.includes(nuevoEstado)) {
  return {
    exito: false,
    error: `Transición inválida: ${estadoActual} → ${nuevoEstado}`,
  };
}
```

### Integración con Strategy

Cuando el pedido llega al estado terminal (`entregado`), la máquina invoca el patrón Strategy para ejecutar la lógica de despacho:

```typescript
// src/lib/acciones/cocina.ts:89-92
if (nuevoEstado === "entregado") {
  const estrategia = crearEstrategiaDespacho(pedidoActual.tipo_despacho as TipoDespacho);
  await estrategia.alEntregar(pedidoActual as Pedido);
}
```

### Validación de roles

El acceso a las transiciones está protegido por el patrón Guard:

```typescript
// src/lib/acciones/cocina.ts:53-54
if (rolUsuario !== "cocinero" && rolUsuario !== "mesero")
  return { exito: false, error: "No tienes permiso" };

// src/lib/acciones/cocina.ts:77-82
if (nuevoEstado === "entregado" && rolUsuario !== "mesero")
  return { exito: false, error: "Solo el mesero puede marcar como entregado" };
```

---

## Referencia completa en el código

| Componente | Archivo | Rol |
|---|---|---|
| **Tabla de transiciones** | `src/lib/acciones/cocina.ts:7-12` | `TRANSICIONES_VALIDAS` |
| **Validación de transición** | `src/lib/acciones/cocina.ts:68-75` | `validas.includes(nuevoEstado)` |
| **Validación de rol** | `src/lib/acciones/cocina.ts:53-54, 77-82` | Guards de acceso |
| **Actualización BD** | `src/lib/acciones/cocina.ts:84-87` | `UPDATE pedidos SET estado` |
| **Integración Strategy** | `src/lib/acciones/cocina.ts:89-92` | `crearEstrategiaDespacho().alEntregar()` |
| **Tipos de dominio** | `src/types/index.ts:6` | `EstadoPedido` |
| **Hook consumidor** | `src/hooks/usePedidos.ts` | `cambiarEstado()` |
| **Componente Kanban** | `src/components/cocina/kanbanPedidos.tsx:50+` | `handleCambiarEstado` |
| **Componente Logística** | `src/hooks/useEntregaPedidos.ts:34-36` | `handleEntregar` |
| **Tests** | `tests/unitarias/servicios/stateMachine.test.ts` | 14 tests de transiciones y roles |

---

## Beneficio clave

Si se necesita agregar un nuevo estado (ej: "cancelado"), solo se modifica la tabla `TRANSICIONES_VALIDAS` y se agrega el nuevo valor al enum `EstadoPedido`. La lógica de validación no cambia porque es genérica: `TRANSICIONES_VALIDAS[estadoActual].includes(nuevoEstado)`.
