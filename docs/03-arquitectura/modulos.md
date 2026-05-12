# 03 — Estructura de Módulos

Cada módulo del monolito se implementa como un conjunto de archivos dentro de `src/app/` y `src/lib/`, siguiendo las convenciones de Next.js App Router.

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
│   │   ├── server.ts            Cliente SSR (Server Components)
│   │   └── browser.ts           Cliente navegador (Client Components)
│   └── db/
│       ├── index.ts             Conexión Drizzle
│       └── schema.ts            Esquema de tablas y enums
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
