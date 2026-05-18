# 03 — API: Server Actions

Todas las operaciones de lectura/escritura se hacen mediante Server Actions. Cada acción usa el cliente Supabase (`@supabase/ssr`) y aplica RLS automáticamente.

---

## Módulo Cliente — Lectura pública

### `obtenerPlatosDisponibles()`
- **Archivo:** `src/lib/acciones/platos.ts`
- **Quién:** Cliente anónimo (sin sesión)
- **Devuelve:** `{ platos: Plato[], categorias: Categoria[] }`
- **Qué hace:** Consulta todos los platos con `disponible = true` y todas las categorías

### `obtenerPlatoPorId(id: string)`
- **Archivo:** `src/lib/acciones/platos.ts`
- **Quién:** Cliente anónimo
- **Devuelve:** `Plato | null`
- **Qué hace:** Busca un plato por ID, solo si está disponible

### `obtenerMesaPorUuid(uuid: string)`
- **Archivo:** `src/lib/acciones/pago.ts`
- **Quién:** Cliente anónimo
- **Devuelve:** `Mesa | null`
- **Qué hace:** Busca una mesa por su `codigo_qr`

### `prepararPagoWompi(referencia, montoEnCentavos)`
- **Archivo:** `src/lib/acciones/pago.ts`
- **Quién:** Cliente anónimo
- **Parámetros:** `referencia: string`, `montoEnCentavos: number`
- **Devuelve:** `{ publicKey: string, firma: string, error?: string }`
- **Qué hace:** Genera la llave pública y firma de integridad para el widget Wompi (server-side, sin exponer el secreto)

### `crearPedidoWompi(mesaUuid, items, total, wompiTransactionId, emailCliente?)`
- **Archivo:** `src/lib/acciones/pago.ts`
- **Quién:** Cliente anónimo
- **Parámetros:** `mesaUuid: string`, `items: ItemCarrito[]`, `total: number`, `wompiTransactionId: string`, `emailCliente?: string`
- **Devuelve:** `{ pedidoId: string, error?: string }`
- **Qué hace:** Consulta la transacción en Wompi para extraer el email, valida la mesa, genera el `pedidoId` con `crypto.randomUUID()`, inserta el pedido con ID pre-generado (sin `.select()` para evitar necesidad de permiso SELECT anónimo), inserta sus items, envía factura por Brevo. Retorna el ID o un error
- **Nota:** Se usa `crypto.randomUUID()` del lado del servidor para evitar el patrón `.insert().select("id").single()` que requiere permiso SELECT en la tabla `pedidos`, el cual está restringido a `authenticated` por RLS

---

## Módulo Cocina — Lectura y escritura (chef/admin)

### `obtenerTodosPedidos()`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero, admin, mesero (requiere sesión)
- **Devuelve:** `Pedido[]`
- **Qué hace:** Retorna todos los pedidos ordenados del más reciente al más antiguo

### `obtenerPedidosPorEstado(estado: EstadoPedido)`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero, admin, mesero
- **Devuelve:** `Pedido[]`
- **Qué hace:** Filtra pedidos por estado, ordenados del más antiguo al más reciente

### `obtenerPedidosConItems()`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero, admin
- **Devuelve:** `PedidoConItems[]` (incluye items con nombre del plato)
- **Qué hace:** Join de pedidos + items_pedido + platos. Útil para mostrar detalle completo

### `obtenerItemsPorPedido(pedidoId)`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero, admin (requiere sesión)
- **Parámetros:** `pedidoId: string`
- **Devuelve:** `ItemPedidoConPlato[]`
- **Qué hace:** Consulta los items de un pedido específico con JOIN a `platos(nombre)`. Usada por `usePedidosRealtime` para resolver la race condition entre INSERT pedido e INSERT items_pedido. Corre del lado del servidor para garantizar que la sesión del staff esté disponible y RLS permita el SELECT anidado en `platos`
- **Nota técnica:** PostgREST devuelve `platos` como objeto (no array) porque la FK es many-to-one. Se accede como `item.platos?.nombre`, no como `item.platos?.[0]?.nombre`

### `obtenerStatsCocina()`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero, admin
- **Devuelve:** `{ pendientes, preparando, listos, tiempoPromedioMin }`
- **Qué hace:** Contadores por estado y tiempo promedio de pedidos completados hoy

### `cambiarEstadoPedido(pedidoId, nuevoEstado)`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero o mesero (ambos pueden cambiar entre pendiente↔preparando↔listo). Solo mesero puede marcar "entregado"
- **Parámetros:** `pedidoId: string`, `nuevoEstado: EstadoPedido`
- **Devuelve:** `{ exito: boolean, error?: string }`
- **Validaciones:**
  - Solo cocinero o mesero pueden cambiar estados (obtenido del contexto de autenticación)
  - Transición válida según máquina de estados (ver `state-machine.md`)
  - Solo mesero puede marcar como "entregado"
- **Errores:** "No autenticado", "No tienes permiso", "Pedido no encontrado", "Transición inválida: X → Y"

### `obtenerTodosPlatos()` (catálogo para gestión)
- **Archivo:** `src/lib/acciones/catalogo.ts`
- **Quién:** Cocinero, admin (verifica rol internamente)
- **Devuelve:** `Plato[]`
- **Qué hace:** Retorna todos los platos (incluyendo inactivos)

### `crearPlato(datos)`
- **Archivo:** `src/lib/acciones/catalogo.ts`
- **Quién:** Cocinero, admin
- **Parámetros:** `{ nombre, descripcion?, precio, tipoPlato, categoriaId?, ingredientes?, imagenUrl? }`
- **Devuelve:** El plato creado
- **Errores:** Lanza si no está autorizado o falla la inserción

### `actualizarPlato(id, datos)`
- **Archivo:** `src/lib/acciones/catalogo.ts`
- **Quién:** Cocinero, admin
- **Parámetros:** `id: string`, `datos: { nombre?, descripcion?, precio?, disponible?, tipoPlato?, categoriaId?, ingredientes?, imagenUrl? }`
- **Qué hace:** Actualiza solo los campos provistos. Revalida la caché de `/cocina/platos`

### `eliminarPlato(id)`
- **Archivo:** `src/lib/acciones/catalogo.ts`
- **Quién:** Cocinero, admin
- **Qué hace:** Elimina el plato. Revalida la caché

---

## Módulo Admin — Gestión (solo admin)

### `obtenerPerfiles()`
- **Archivo:** `src/lib/acciones/admin.ts`
- **Quién:** Admin
- **Devuelve:** `Perfil[]`

### `obtenerMesas()`
- **Archivo:** `src/lib/acciones/admin.ts`
- **Quién:** Admin
- **Devuelve:** `Mesa[]`

### `crearPerfil({ email, nombre, rol })`
- **Archivo:** `src/lib/acciones/admin.ts`
- **Quién:** Admin
- **Devuelve:** El perfil creado

### `eliminarPerfil(id)`
- **Archivo:** `src/lib/acciones/admin.ts`
- **Quién:** Admin

### `crearMesa(numero)`
- **Archivo:** `src/lib/acciones/admin.ts`
- **Quién:** Admin
- **Devuelve:** La mesa creada (con `codigo_qr` autogenerado)

### `eliminarMesa(id)`
- **Archivo:** `src/lib/acciones/admin.ts`
- **Quién:** Admin

---

## Módulo Categorías — Gestión del menú

### `obtenerCategorias()`
- **Archivo:** `src/lib/acciones/categorias.ts`
- **Quién:** Cualquiera (público)
- **Devuelve:** `Categoria[]`

### `crearCategoria({ nombre, slug })`
- **Archivo:** `src/lib/acciones/categorias.ts`
- **Quién:** Cocinero, admin
- **Devuelve:** La categoría creada

### `actualizarCategoria(id, { nombre?, slug? })`
- **Archivo:** `src/lib/acciones/categorias.ts`
- **Quién:** Cocinero, admin

### `eliminarCategoria(id)`
- **Archivo:** `src/lib/acciones/categorias.ts`
- **Quién:** Cocinero, admin

---

## Módulo Auth — Sesión del staff

### `cerrarSesion()`
- **Archivo:** `src/lib/acciones/auth.ts`
- **Quién:** Cualquier usuario autenticado
- **Qué hace:** Cierra la sesión en Supabase Auth y redirige a `/login`

---

## Servicios (patrones de diseño)

### `crearEstrategiaDespacho(tipoDespacho)`
- **Archivo:** `src/lib/servicios/estrategiaDespacho.ts`
- **Devuelve:** `EstrategiaDespacho` (instancia de `DespachoMesa` o `DespachoParaLlevar`)

### `EstrategiaDespacho.alEntregar(pedido)`
- **Qué hace:** Define el comportamiento post-entrega según el tipo de despacho
  - `DespachoMesa`: ejecuta lógica de entrega para pedidos en mesa
  - `DespachoParaLlevar`: ejecuta lógica de entrega para pedidos para llevar

---

## Servicio de Realtime (Observer + DIP)

### `crearRealtimeService()`
- **Archivo:** `src/lib/servicios/realtimeService.ts`
- **Patrón:** Singleton
- **Devuelve:** `IServicioRealtime`
- **Qué hace:** Retorna la instancia global del servicio de canales WebSocket. Expone `suscribir()` y `desconectarTodo()`

### `IServicioRealtime.suscribir(opciones, callback)`
- **Parámetros:**
  - `opciones.tabla: string` — Tabla a observar
  - `opciones.evento: "INSERT" | "UPDATE" | "DELETE" | "*"` — Tipo de evento
  - `opciones.filtro?: string` — Filtro PostgREST (ej: `"estado=eq.listo"`)
  - `opciones.schema?: string` — Schema (default: `"public"`)
  - `callback: (payload: RealtimePostgresChangesPayload) => void` — Se ejecuta por cada cambio
- **Devuelve:** `Promise<ISuscripcionRealtime>` con método `cancelar()`
- **Qué hace:** Obtiene la sesión, configura `setAuth()` para RLS, crea un canal WebSocket único y se suscribe a `postgres_changes`
- **Implementación:** `SupabaseRealtimeService` (concreta)

### Hooks del patrón Pub/Sub (Realtime)

| Hook | Archivo | Suscripción | Uso |
|---|---|---|---|
| `useRealtime(tabla, evento, cb, filtro?, servicio?)` | `src/hooks/useRealtime.ts` | Genérico | Cualquier tabla, cualquier evento |
| `usePedidosRealtime(callbacks, servicio?)` | `src/hooks/usePedidosRealtime.ts` | `pedidos` INSERT + UPDATE | Panel cocina (kanban) |
| `usePlatosRealtime(callbacks, servicio?)` | `src/hooks/usePlatosRealtime.ts` | `platos` INSERT + UPDATE + DELETE | Menú cliente (catálogo) |
| `useMiPedidoRealtime(pedidoId, callbacks, servicio?)` | `src/hooks/useMiPedidoRealtime.ts` | `pedidos` UPDATE filtrado por ID | Cliente (estado de su pedido) |
| `useEntregaPedidos(pedidosIniciales)` | `src/hooks/useEntregaPedidos.ts` | `pedidos` UPDATE filtrado `estado=eq.listo` | Panel logística (mesero) |

Todos los hooks genéricos aceptan un `IServicioRealtime` opcional para inyección de dependencias (testing).
