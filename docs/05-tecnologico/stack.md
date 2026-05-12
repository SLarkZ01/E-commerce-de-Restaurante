# 05 — Stack Tecnológico

## Versiones y justificación

| Capa | Tecnología | Versión | ¿Por qué? |
|---|---|---|---|
| **Framework** | Next.js | 16.2.6 | App Router + Server Actions unifican frontend y backend. Turbopack para builds rápidos. |
| **UI** | React | 19.2.4 | Server Components para renderizado híbrido. |
| **Estilos** | Tailwind CSS | 4.x | Utilidades atómicas, zero-runtime con `@tailwindcss/postcss`. |
| **UI Components** | shadcn/ui | latest | Componentes accesibles copiados al código fuente. Basado en Radix UI + Tailwind. | `components.json`, `src/components/ui/` |
| **Íconos** | Lucide React | ^0.14 | Biblioteca de íconos usada por shadcn/ui. |
| **Utilidades CSS** | clsx + tailwind-merge | ^2 + ^3 | Fusión inteligente de clases Tailwind (`cn()` en `src/lib/utils.ts`). |
| **Base de datos** | Supabase (PostgreSQL) | — | PostgreSQL gestionado + Realtime + Auth + RLS. Un solo servicio para datos, eventos y autenticación. |
| **ORM** | Drizzle ORM | 0.45.2 | TypeScript-first, schemas declarativos, migraciones con `drizzle-kit`. Sin code generation. |
| **Driver DB** | postgres | 3.4.9 | Cliente PostgreSQL mínimo para Node.js, compatible con Supabase. |
| **Auth** | Supabase Auth | SSR 0.10.3 | PKCE flow seguro, roles nativos, integración con RLS. Solo para staff (no clientes). |
| **Estado cliente** | Zustand | 5.0.13 | Mínimo (~1KB), sin boilerplate, persistencia en localStorage para el carrito. |
| **Imágenes** | Cloudinary | (SDK a integrar) | Optimización automática, transformaciones on-the-fly, CDN global. |
| **Pagos** | PayPal | (SDK a integrar) | Guest checkout sin registro, webhooks para confirmación. |
| **Emails** | Brevo | (SDK a integrar) | API de email transaccional, templates HTML, seguimiento de entregas. |
| **Testing** | Vitest | 4.1.6 | Nativo de Vite, compatible con Jest, watch mode, coverage v8. |
| **Testing UI** | Testing Library | React 16.3.2 | Enfoque en comportamiento del usuario, no en implementación. |
| **DOM** | jsdom | 29.1.1 | Simulación de navegador para tests de componentes. |
| **UUID** | uuid | 14.0.0 | Generación de códigos QR únicos para mesas. |
| **Moneda** | COP | — | Peso colombiano sin centavos. `decimal(10,0)` en DB. Formateo con `Intl.NumberFormat("es-CO")`. |

## ¿Por qué Supabase como núcleo?

Supabase concentra **3 responsabilidades** que normalmente requerirían servicios separados:

1. **Base de datos** (PostgreSQL) → tablas relacionales, índices, constraints
2. **Autenticación** → email/password + roles para el staff
3. **Event Bus** → Realtime vía WebSockets para sincronización instantánea

Esto elimina la necesidad de Redis (pub/sub), RabbitMQ (colas) o Auth0 (autenticación externa), simplificando la arquitectura y reduciendo costos operativos.

## ¿Por qué Drizzle y no Prisma?

| Factor | Drizzle ORM | Prisma |
|---|---|---|
| Peso | ~7.4KB | ~12MB (engine binary) |
| Esquema | TypeScript nativo | Archivo `.prisma` (lenguaje propio) |
| Migraciones | `drizzle-kit push` | `prisma migrate` |
| Serverless | Nativo, sin binary | Requiere engine binary |
| Tipos | Inferidos del schema | Generados por CLI |
