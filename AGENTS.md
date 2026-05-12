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
| Diagramas de flujo/secuencia | `docs/03-arquitectura/flujos.md` |
| Patrones de diseño (5) | `docs/04-patrones/` |
| Stack tecnológico con versiones | `docs/05-tecnologico/stack.md` |
| Estrategia y casos de prueba | `docs/06-pruebas/` |
| Riesgos y mitigaciones | `docs/07-riesgos/analisis.md` |
| Evaluación arquitectónica | `docs/08-evaluacion/criterios.md` |
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
├── lib/
│   ├── db/         → Drizzle ORM (schema + conexión)
│   └── supabase/   → Clientes Supabase (server + browser)
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
| Drizzle ORM | 0.45.2 |
| Supabase SSR | 0.10.3 |
| Zustand | 5.0.13 |
| Vitest | 4.1.6 |
| Tailwind CSS | 4.x |

### Reglas importantes
1. NUNCA uses `middleware.ts` — Next.js 16 usa `proxy.ts`
2. NUNCA modifiques `src/lib/db/schema.ts` sin actualizar `src/types/index.ts`
3. Los Server Components no pueden usar hooks de Zustand — solo Client Components
4. Supabase Auth es SOLO para staff (cocinero, mesero, admin). Los clientes son anónimos.
5. Los tests usan Vitest con globals habilitados (`describe`, `it`, `expect` sin importar)
