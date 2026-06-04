# Migraciones de Base de Datos — E-Kitchen

## Estructura

```
supabase/migrations/
├── 0000_schema.sql              ← Tablas, enums, FKs, índices
├── 0001_rls.sql                 ← Row Level Security + funciones auxiliares
└── 0002_stored_procedures.sql   ← buscar_pedido_por_prefijo + realtime
```

## Cómo aplicar migraciones

### Opción 1 — Supabase CLI (recomendado)

```bash
supabase link --project-ref aqwtjtectrrlfamwqken
supabase db push
```

### Opción 2 — Supabase Dashboard SQL Editor

Copiar y ejecutar cada archivo en orden numérico.

### Opción 3 — Drizzle Kit (solo schema, no RLS)

```bash
npx drizzle-kit push
```

> Drizzle Kit solo maneja tablas, enums y FKs. Las políticas RLS, funciones y stored procedures deben aplicarse con las migraciones SQL manuales.

## Estado actual

| Tabla | RLS | Índices | Realtime |
|---|---|---|---|
| `perfiles` | ✅ | PK, email UNIQUE | ❌ |
| `categorias` | ✅ | PK, slug UNIQUE | ❌ |
| `platos` | ✅ | PK, idx_platos_categoria, idx_platos_disponible (parcial) | ✅ |
| `mesas` | ✅ | PK, codigo_qr UNIQUE, numero UNIQUE | ❌ |
| `pedidos` | ✅ | PK, idx_pedidos_estado, idx_pedidos_mesa, idx_pedidos_creado_en, idx_pedidos_cocinero_id | ✅ |
| `items_pedido` | ✅ | PK, idx_items_pedido_pedido, idx_items_pedido_plato | ❌ |

## Stored Procedures

| Función | Propósito |
|---|---|
| `buscar_pedido_por_prefijo(prefijo)` | Búsqueda de pedido por prefijo UUID (rastreo cliente) |
| `auth_is_staff()` | ¿El usuario es chef o admin? |
| `usuario_es_admin()` | ¿El usuario es admin? |
| `usuario_rol()` | Rol del usuario actual |
