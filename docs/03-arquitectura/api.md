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

### `crearPedido(mesaUuid, items, total, correoCliente?)`
- **Archivo:** `src/lib/acciones/pago.ts`
- **Quién:** Cliente anónimo
- **Parámetros:** `mesaUuid: string`, `items: ItemCarrito[]`, `total: number`, `correoCliente?: string`
- **Devuelve:** `{ pedidoId: string, error?: string }`
- **Qué hace:** Valida que la mesa exista, inserta el pedido y sus items. Retorna el ID o un error

---

## Módulo Cocina — Lectura y escritura (chef/admin)

### `obtenerTodosPedidos()`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero, admin (requiere sesión)
- **Devuelve:** `Pedido[]`
- **Qué hace:** Retorna todos los pedidos ordenados del más reciente al más antiguo

### `obtenerPedidosPorEstado(estado: EstadoPedido)`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero, admin, mesero
- **Devuelve:** `Pedido[]`
- **Qué hace:** Filtra pedidos por estado, ordenados del más antiguo al más reciente

### `cambiarEstadoPedido(pedidoId, nuevoEstado, rolUsuario)`
- **Archivo:** `src/lib/acciones/cocina.ts`
- **Quién:** Cocinero (pendiente→preparando, preparando→listo), Mesero (listo→entregado)
- **Devuelve:** `{ exito: boolean, error?: string }`
- **Validaciones:**
  - Solo cocinero o mesero pueden cambiar estados
  - Transición válida según máquina de estados (ver `state.md`)
  - Solo mesero puede marcar como "entregado"
- **Errores:** "No tienes permiso", "Pedido no encontrado", "Transición inválida: X → Y"

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
- **Errores:** "No puedes eliminar tu propio perfil"

### `crearMesa(numero)`
- **Archivo:** `src/lib/acciones/admin.ts`
- **Quién:** Admin
- **Devuelve:** La mesa creada (con `codigo_qr` autogenerado)

### `eliminarMesa(id)`
- **Archivo:** `src/lib/acciones/admin.ts`
- **Quién:** Admin

---

## Servicios (patrones de diseño)

### `crearEstrategiaDespacho(tipoDespacho)`
- **Archivo:** `src/lib/servicios/estrategiaDespacho.ts`
- **Patrón:** Strategy
- **Devuelve:** `EstrategiaDespacho` (instancia de `DespachoMesa` o `DespachoParaLlevar`)

### `EstrategiaDespacho.alEntregar(pedido)`
- **Qué hace:** Define el comportamiento post-entrega según el tipo de despacho
  - `DespachoMesa`: libera la mesa
  - `DespachoParaLlevar`: notifica al cliente por email
