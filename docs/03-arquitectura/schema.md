# 03 — Esquema de Base de Datos

Todas las tablas viven en Supabase (PostgreSQL). El schema se define en `src/lib/db/schema.ts` (Drizzle, para referencia). Las queries en runtime se hacen con el cliente JS de Supabase.

## Enums

| Enum | Valores | Uso |
|---|---|---|
| `rol` | `cocinero`, `mesero`, `admin` | Rol del staff en `perfiles` |
| `estado_pedido` | `pendiente`, `preparando`, `listo`, `entregado` | Ciclo de vida del pedido en `pedidos` |
| `tipo_plato` | `plato_fuerte`, `bebida`, `combo` | Tipo de producto en `platos` |
| `tipo_despacho` | `mesa`, `para_llevar` | Origen del pedido en `pedidos` |

---

## Tablas

### `perfiles` — Personal del restaurante

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | Debe coincidir con `auth.users.id` de Supabase Auth |
| `email` | `TEXT` | NOT NULL, UNIQUE | Correo del staff |
| `rol` | `rol` | NOT NULL, default `'mesero'` | `cocinero`, `mesero`, `admin` |
| `nombre` | `TEXT` | NOT NULL | Nombre completo |
| `creado_en` | `TIMESTAMP` | NOT NULL, default `now()` | Fecha de creación |

**RLS:** Solo admin gestiona perfiles. Cada usuario ve su propio perfil.

---

### `categorias` — Categorías del menú

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `nombre` | `TEXT` | NOT NULL | Ej: "Platos Fuertes" |
| `slug` | `TEXT` | NOT NULL, UNIQUE | Ej: "platos-fuertes" |
| `creado_en` | `TIMESTAMP` | NOT NULL, default `now()` | |

**RLS:** Lectura pública. Escritura solo chef/admin.

---

### `platos` — Ítems del menú

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `nombre` | `TEXT` | NOT NULL | Nombre del plato |
| `descripcion` | `TEXT` | NULLABLE | Descripción corta |
| `precio` | `DECIMAL(10,0)` | NOT NULL | En COP, sin centavos |
| `imagen_url` | `TEXT` | NULLABLE | URL de Cloudinary |
| `tipo_plato` | `tipo_plato` | NOT NULL, default `'plato_fuerte'` | |
| `categoria_id` | `UUID` | FK → `categorias.id`, NULLABLE | |
| `disponible` | `BOOLEAN` | NOT NULL, default `true` | false = agotado, se oculta del menú |
| `ingredientes` | `TEXT[]` | NULLABLE | Array de strings |
| `creado_por` | `UUID` | FK → `perfiles.id`, NULLABLE | Chef que creó el plato |
| `creado_en` | `TIMESTAMP` | NOT NULL, default `now()` | |
| `actualizado_en` | `TIMESTAMP` | NOT NULL, default `now()` | |

**RLS:** Clientes ven solo `disponible = true`. Staff ve todos. Escritura solo chef/admin.

**Índices:** `idx_platos_categoria` (categoria_id), `idx_platos_disponible` (disponible WHERE true)

---

### `mesas` — Mesas físicas del restaurante

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `codigo_qr` | `UUID` | NOT NULL, UNIQUE, default `gen_random_uuid()` | Identificador único para la URL del menú |
| `numero` | `INTEGER` | NOT NULL, UNIQUE | Número visible de la mesa |
| `creado_en` | `TIMESTAMP` | NOT NULL, default `now()` | |

**RLS:** Lectura pública. Gestión solo admin.

---

### `pedidos` — Órdenes de compra

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `mesa_id` | `UUID` | FK → `mesas.id`, NULLABLE | NULL si es `para_llevar` |
| `tipo_despacho` | `tipo_despacho` | NOT NULL, default `'mesa'` | |
| `estado` | `estado_pedido` | NOT NULL, default `'pendiente'` | Máquina de estados |
| `correo_cliente` | `TEXT` | NULLABLE | Email de PayPal del cliente |
| `total` | `DECIMAL(10,0)` | NOT NULL | En COP, sin centavos |
| `paypal_pedido_id` | `TEXT` | NULLABLE | ID de la orden en PayPal |
| `cocinero_id` | `UUID` | FK → `perfiles.id`, NULLABLE | Chef asignado |
| `creado_en` | `TIMESTAMP` | NOT NULL, default `now()` | |
| `actualizado_en` | `TIMESTAMP` | NOT NULL, default `now()` | |

**RLS:** Cualquiera puede crear pedidos (anónimo). Solo staff puede leer y actualizar.

**Índices:** `idx_pedidos_estado` (estado), `idx_pedidos_mesa` (mesa_id)

---

### `items_pedido` — Platos dentro de un pedido

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `UUID` | PK, default `gen_random_uuid()` | |
| `pedido_id` | `UUID` | FK → `pedidos.id`, NOT NULL, ON DELETE CASCADE | |
| `plato_id` | `UUID` | FK → `platos.id`, NOT NULL | |
| `cantidad` | `INTEGER` | NOT NULL, default `1` | |
| `precio_unitario` | `DECIMAL(10,0)` | NOT NULL | Precio del plato al momento del pedido |

**RLS:** Cualquiera puede crear. Solo staff puede leer.

**Índices:** `idx_items_pedido_pedido` (pedido_id), `idx_items_pedido_plato` (plato_id)

---

## Realtime

Las tablas con cambios transmitidos en tiempo real vía WebSockets:

| Tabla | ¿Qué se transmite? | ¿Quién escucha? |
|---|---|---|
| `platos` | INSERT, UPDATE, DELETE | Menú del cliente (catálogo se actualiza solo) |
| `pedidos` | INSERT (nuevo pedido), UPDATE (cambio de estado) | Panel de cocina, panel de logística, cliente (su propio pedido) |
