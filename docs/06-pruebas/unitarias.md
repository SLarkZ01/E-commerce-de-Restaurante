# 06 — Pruebas Unitarias

## Casos de prueba planificados

### Store del carrito (`src/stores/cart.ts`)

| ID | Caso | Entrada | Resultado esperado |
|---|---|---|---|
| U-01 | Agregar plato nuevo al carrito vacío | `agregarItem({id: "1", nombre: "Pizza", precio: 12})` | `items.length === 1`, `cantidad === 1` |
| U-02 | Agregar plato existente | Mismo plato 2 veces | `items.length === 1`, `cantidad === 2` |
| U-03 | Eliminar plato del carrito | `eliminarItem("1")` | `items.length === 0` |
| U-04 | Actualizar cantidad a 0 (debe eliminar) | `actualizarCantidad("1", 0)` | `items.length === 0` |
| U-05 | Calcular total con múltiples items | Pizza ($12 x2) + Bebida ($5 x1) | `total() === 29` |
| U-06 | Vaciar carrito | `vaciarCarrito()` | `items.length === 0`, `total() === 0` |
| U-07 | Persistencia en localStorage | Recargar página | Los items se mantienen |

### Validaciones de estado (State Pattern)

| ID | Caso | Estado actual | Transición solicitada | Resultado esperado |
|---|---|---|---|---|
| U-08 | Transición válida: Pendiente → Preparando | `pendiente` | `preparando` | ✅ Permitida |
| U-09 | Transición válida: Preparando → Listo | `preparando` | `listo` | ✅ Permitida |
| U-10 | Transición válida: Listo → Entregado | `listo` | `entregado` | ✅ Permitida |
| U-11 | Transición inválida: Pendiente → Listo | `pendiente` | `listo` | ❌ Error 400 |
| U-12 | Transición inválida: Entregado → Pendiente | `entregado` | `pendiente` | ❌ Error 400 |
| U-13 | Mesero intenta pasar a Preparando | `pendiente` | `preparando` | ❌ Error 403 (solo cocinero) |
| U-14 | Cocinero intenta pasar a Entregado | `listo` | `entregado` | ❌ Error 403 (solo mesero) |

### Factory Method

| ID | Caso | Tipo | Resultado esperado |
|---|---|---|---|
| U-15 | Crear Plato Fuerte | `plato_fuerte` | Campos requeridos: nombre, precio, ingredientes |
| U-16 | Crear Bebida | `bebida` | No requiere ingredientes, permite tamaño |
| U-17 | Crear Combo | `combo` | Requiere lista de platos incluidos |

### Strategy (Despacho)

| ID | Caso | `tipoDespacho` | Comportamiento esperado |
|---|---|---|---|
| U-18 | Despacho en mesa con mesaId | `mesa` | `mesaId` requerido, notifica al panel mesero |
| U-19 | Despacho para llevar sin mesaId | `para_llevar` | `mesaId` nulo, notifica por email |
