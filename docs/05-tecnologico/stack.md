# 05 — Stack Tecnológico

## Versiones y justificación

| Capa | Tecnología | Versión | ¿Por qué? |
|---|---|---|---|
| **Framework** | Next.js | 16.2.6 | App Router + Server Actions unifican frontend y backend. Turbopack para builds rápidos. |
| **UI** | React | 19.2.4 | Server Components para renderizado híbrido. |
| **Estilos** | Tailwind CSS | 4.x | Utilidades atómicas, zero-runtime con `@tailwindcss/postcss`. |
| **UI Components** | shadcn/ui | latest | Componentes accesibles copiados al código fuente. Basado en Radix UI + Tailwind. | `components.json`, `src/components/ui/` |
| **Íconos** | Lucide React | ^1.14 | Biblioteca de íconos usada por shadcn/ui. |
| **Utilidades CSS** | clsx + tailwind-merge | ^2 + ^3 | Fusión inteligente de clases Tailwind (`cn()` en `src/lib/utils.ts`). |
| **Base de datos** | Supabase (PostgreSQL) | — | PostgreSQL gestionado + Realtime + Auth + RLS. Un solo servicio para datos, eventos y autenticación. |
| **Cliente DB** | Supabase JS Client (`@supabase/supabase-js`) | ^2.105 | Cliente HTTP para todas las queries en runtime. Respeta RLS nativamente. Usado desde Server Actions y Client Components. |
| **Schema / Migraciones** | Drizzle ORM + drizzle-kit | 0.45.2 | Solo para definir el schema (`src/lib/db/schema.ts`) y ejecutar migraciones. NO se usa en runtime. |
| **Auth** | Supabase Auth | SSR 0.10.3 | PKCE flow seguro, roles nativos, integración con RLS. Solo para staff (no clientes). |
| **Estado cliente** | Zustand | 5.0.13 | Mínimo (~1KB), sin boilerplate, persistencia en localStorage para el carrito. |
| **Imágenes** | Cloudinary | (SDK a integrar) | Optimización automática, transformaciones on-the-fly, CDN global. |
| **Pagos** | Wompi | (Widget integrado) | Pasarela de pagos colombiana. Widget checkout + API REST para consulta de transacciones. |
| **Emails** | Brevo | (SDK integrado) | API de email transaccional, templates HTML, seguimiento de entregas. |
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

---

## ¿Por qué Supabase Client para queries?

Aunque Drizzle ORM se usó inicialmente para el schema, todas las queries en runtime se hacen con el cliente JS de Supabase (`@supabase/supabase-js`). Esto permite:

1. **RLS nativo**: las políticas de Row Level Security se aplican automáticamente
2. **Sin conexión directa a PostgreSQL**: el cliente usa la API HTTP de Supabase (puerto 443)
3. **Realtime integrado**: las suscripciones WebSocket comparten el mismo cliente
4. **Menos dependencias en runtime**: no requiere driver `postgres` ni conexiones TCP directas
