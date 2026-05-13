# E-Kitchen — Guía

## Documentación del Proyecto

Toda la documentación está en `docs/`. El punto de entrada es `docs/indice.md`.

| Si necesitas saber sobre... | Consulta |
|---|---|
| Problema y contexto del proyecto | `docs/01-problema/contexto.md` |
| Funcionalidades por rol | `docs/02-alcance/funcional.md` |
| Historias de usuario (formales) | `docs/02-alcance/historias-usuario.md` |
| Decisión arquitectónica y por qué | `docs/03-arquitectura/decision.md` |
| Diagrama de arquitectura (Mermaid) | `docs/03-arquitectura/diagrama.md` |
| Estructura de módulos y carpetas | `docs/03-arquitectura/modulos.md` |
| Esquema de base de datos (tablas, columnas, RLS) | `docs/03-arquitectura/schema.md` |
| API / Server Actions (parámetros, respuestas) | `docs/03-arquitectura/api.md` |
| Diagramas de flujo/secuencia | `docs/03-arquitectura/flujos.md` |
| Patrones de diseño (5) | `docs/04-patrones/` |
| Stack tecnológico con versiones | `docs/05-tecnologico/stack.md` |
| Estrategia y casos de prueba | `docs/06-pruebas/` |
| Riesgos y mitigaciones | `docs/07-riesgos/analisis.md` |
| Evaluación arquitectónica | `docs/08-evaluacion/criterios.md` |
| Paleta de colores del proyecto | `docs/diseno/DESIGN.md` |
| Resumen ejecutivo del proyecto | `docs/guia.md` |
| Requisitos académicos originales | `docs/trabajo_arquitectura.md` |

## Convenciones del Código

### Idioma
- **Español** para todo lo del dominio: tablas, columnas, enums, funciones, variables, tipos, stores
- **Inglés** solo para nombres de paquetes npm, APIs externas y configuraciones de framework

### Estructura
```
src/
├── app/            → App Router (páginas y layouts)
├── components/
│   ├── ui/         → Componentes shadcn/ui (button, card, etc.)
│   ├── cliente/    → Menú, catálogo, carrito, barra superior
│   ├── cocina/     → Kanban de pedidos, tabla/formulario de platos
│   ├── logistica/  → Lista de entregas pendientes
│   ├── admin/      → Gestión de personal, gestión de mesas
│   └── staff/      → Sidebar y layout del panel staff
├── lib/
│   ├── db/         → Drizzle ORM (solo schema + migraciones, no runtime)
│   ├── supabase/   → Clientes Supabase (server + browser)
│   ├── acciones/   → Server Actions (CRUD por módulo)
│   ├── servicios/  → Estrategias y fachadas
│   ├── formato.ts  → formatearPrecio() (COP)
│   └── utils.ts    → cn() (clsx + tailwind-merge)
├── stores/         → Zustand (carrito)
├── types/          → Interfaces TypeScript del dominio
└── proxy.ts        → Auth + protección de rutas
```

### Alias
- `@/*` → `./src/*`

### Nombrado de archivos
- `kebab-case` para rutas de App Router: `/mesa/[uuid]`, `/cocina/platos`
- `camelCase` para funciones y variables
- Archivos de configuración en raíz: `drizzle.config.ts`, `vitest.config.ts`

### Stack (versiones reales)
| Herramienta | Versión |
|---|---|
| Next.js | 16.2.6 |
| React | 19.2.4 |
| shadcn/ui | latest |
| Supabase SSR + JS Client | 0.10.3 / 2.105 |
| Drizzle ORM (solo schema) | 0.45.2 |
| Zustand | 5.0.13 |
| Vitest | 4.1.6 |
| Tailwind CSS | 4.x |

### Formato de moneda
- Moneda: **COP** (peso colombiano), sin centavos
- Base de datos: `decimal(10,0)` para `precio`, `total`, `precioUnitario`
- Frontend: usar `formatearPrecio()` de `src/lib/formato.ts` — `Intl.NumberFormat("es-CO")`

### Reglas importantes
1. NUNCA uses `middleware.ts` — Next.js 16 usa `proxy.ts`
2. NUNCA modifiques `src/lib/db/schema.ts` sin actualizar `src/types/index.ts`
3. Los tipos de dominio usan `snake_case` para coincidir con las columnas de Supabase
4. Todas las queries en runtime usan el cliente Supabase (`@supabase/ssr`), NO Drizzle
5. Los Server Components no pueden usar hooks de Zustand — solo Client Components
6. Supabase Auth es SOLO para staff (cocinero, mesero, admin). Los clientes son anónimos.
7. Los tests usan Vitest con globals habilitados (`describe`, `it`, `expect` sin importar)
8. Siempre en lo posible usar componentes de shadcn/ui cuando se pueda. 
