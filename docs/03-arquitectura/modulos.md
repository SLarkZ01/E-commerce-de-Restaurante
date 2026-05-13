# 03 — Estructura de Módulos

Cada módulo del monolito se implementa como un conjunto de archivos dentro de `src/app/` y `src/lib/`, siguiendo las convenciones de Next.js App Router.

## Mapa de pantallas

| Ruta | Pantalla | ¿Quién entra? | ¿Qué se ve? | ¿Qué puede hacer? |
|---|---|---|---|---|
| `/` | Menú digital | **Cliente anónimo** | Header con logo y enlace Staff. Buscador, filtros por categoría, cards de platos, footer con carrito. Al abrir el carrito: pide escanear QR de mesa para comprar | Explorar catálogo, filtrar, buscar, agregar/quitar platos del carrito. Para comprar debe escanear QR → `/mesa/[uuid]` |
| `/login` | Inicio de sesión | **Público** | Formulario email + contraseña, logo | Iniciar sesión con Supabase Auth. Redirige según rol |
| `/mesa/[uuid]` | Menú con mesa | **Cliente anónimo** | Header con nº mesa, buscador, filtros por categoría, cards de platos, carrito con botón de compra | Ver catálogo, filtrar, buscar, agregar/quitar del carrito, confirmar pedido |
| `/cocina` | Panel Kanban | **Cocinero, Admin** | 3 columnas: Pendiente / Preparando / Listo. Cards con nº mesa, tiempo, platos, total. Botón "Gestionar Menú" | Ver pedidos nuevos en tiempo real, cambiar estado (Iniciar → Listo), ir a CRUD de platos |
| `/cocina/platos` | CRUD de platos | **Cocinero, Admin** | Tabla de platos con nombre, tipo, precio, estado (activo/inactivo). Botón "+ Nuevo Plato". Modal formulario | Crear, editar, activar/desactivar, eliminar platos. Subir imagen. Asignar categoría, tipo, ingredientes, precio |
| `/logistica` | Panel de entregas | **Mesero, Admin** | Lista de pedidos en estado "Listo" con nº mesa grande, tiempo transcurrido, platos, total | Ver pedidos listos, confirmar entrega física (marca "Entregado") |
| `/admin` | Dashboard admin | **Admin** | Sidebar (Inicio, Personal, Mesas). KPIs de ventas, tabla de últimos pedidos | Ver resumen del día, navegar a secciones de gestión |
| `/admin/personal` | Gestión de personal | **Admin** | Tabla con nombre, email, rol. Botón "+ Agregar Personal". Modal formulario con selector de rol | Crear, eliminar personal. Asignar rol (cocinero/mesero/admin) |
| `/admin/mesas` | Gestión de mesas | **Admin** | Tabla con nº mesa, código QR. Botón "+ Agregar Mesa". Modal QR con vista previa y botón copiar | Crear mesa, ver/generar QR, copiar URL del menú, eliminar mesa |

### Reglas de acceso

- **Público:** `/`, `/login`, `/mesa/[uuid]` — sin autenticación
- **Staff (cualquier rol):** `/cocina`, `/cocina/platos`, `/logistica`, `/admin` — requiere sesión
- **Solo admin:** `/admin/personal`, `/admin/mesas`, `/admin` (dashboard completo)
- **Solo cocinero o admin:** operaciones de escritura en platos y cambio de estado de pedidos
- **Solo mesero:** marcar pedido como "Entregado"

## Mapa de archivos por módulo

```
src/
├── app/
│   ├── mesa/[uuid]/        → Módulo Cliente
│   │   └── page.tsx             Catálogo + carrito + botón PayPal
│   ├── cocina/              → Módulo Cocina
│   │   ├── page.tsx             Panel Kanban de pedidos
│   │   └── platos/              CRUD de catálogo
│   ├── logistica/           → Módulo Logística
│   │   └── page.tsx             Panel de entregas pendientes
│   ├── admin/               → Módulo Administración
│   │   ├── page.tsx             Dashboard de ventas
│   │   ├── personal/            Gestión de usuarios staff
│   │   └── mesas/               Generación de QR
│   └── login/               → Autenticación (Supabase Auth)
│       └── page.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts            Cliente SSR (Server Components y Server Actions)
│   │   └── browser.ts           Cliente navegador (Client Components)
│   ├── db/
│   │   ├── schema.ts            Esquema de tablas y enums (Drizzle, solo referencia)
│   │   └── index.ts             Conexión Drizzle (solo para migraciones)
│   ├── acciones/                 Server Actions por módulo
│   │   ├── platos.ts            Lectura pública de platos
│   │   ├── pago.ts              Crear pedido desde el carrito
│   │   ├── cocina.ts            Cambio de estado + consultas de pedidos
│   │   ├── catalogo.ts          CRUD de platos (chef/admin)
│   │   └── admin.ts             CRUD de personal y mesas
│   └── servicios/
│       └── estrategiaDespacho.ts  Strategy Pattern (mesa vs para llevar)
│
├── stores/
│   └── cart.ts                  Zustand: carrito del cliente
│
├── types/
│   └── index.ts                 Interfaces del dominio
│
└── proxy.ts                     Auth + protección de rutas
```

## Responsabilidades por módulo

### Módulo Cliente (`/mesa/[uuid]`)
Archivo de referencia: `src/lib/db/schema.ts` (tablas `platos`, `pedidos`, `itemsPedido`)
- Solo lectura de `platos` donde `disponible = true` (RLS)
- Escritura: crear `pedido` + `itemsPedido` al completar pago
- Suscripción Realtime al estado del pedido creado
- Precios en COP sin centavos, formateados con `formatearPrecio()` (`src/lib/formato.ts`)

### Módulo Cocina (`/cocina`)
Archivo de referencia: `src/lib/db/schema.ts` (tablas `platos`, `pedidos`, `categorias`)
- CRUD completo de `platos` y `categorias`
- Lectura de `pedidos` con filtro por estado
- Escritura: actualizar `estado` del pedido (State Pattern)

### Módulo Logística (`/logistica`)
Archivo de referencia: `src/lib/db/schema.ts` (tablas `pedidos`)
- Lectura de `pedidos` con `estado = 'listo'`
- Escritura: actualizar `estado` a `'entregado'`

### Módulo Administración (`/admin`)
Archivo de referencia: `src/lib/db/schema.ts` (tablas `perfiles`, `mesas`, `pedidos`)
- CRUD de `perfiles` (personal del restaurante)
- CRUD de `mesas` + generación de `codigoQr`
- Vista de auditoría: historial de `pedidos`

### Proxy (`src/proxy.ts`)
- Protege `/cocina`, `/logistica`, `/admin` (solo usuarios autenticados)
- `/mesa/[uuid]` y `/login` son públicos
