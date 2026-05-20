# 🍽️ E-Kitchen

**E-commerce de Restaurante con Menú Digital Interactivo**

![Arquitectura](https://img.shields.io/badge/Arquitectura-Monolito%20Modular%20%2B%20Event--Driven-c44536?style=flat-square) ![Patrones](https://img.shields.io/badge/Patrones-11%20dise%C3%B1o-c44536?style=flat-square) ![Tests](https://img.shields.io/badge/Tests-140%20casos-c44536?style=flat-square) ![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Realtime-3ECF8E?style=flat-square&logo=supabase)

---

## 📋 ¿Qué problema resuelve?

En el sector gastronómico, la comunicación entre el salón y la cocina genera **latencia crítica**: pedidos en papel que se pierden, meseros que no saben qué platos están listos, clientes que esperan sin saber el estado de su comida, y errores de transcripción que resultan en platos equivocados.

**E-Kitchen** digitaliza todo el flujo: el cliente escanea un QR en su mesa, explora el menú con precios e imágenes actualizados en tiempo real, paga directo desde su celular con Wompi, y el pedido aparece instantáneamente en el panel Kanban del chef. Cuando está listo, el mesero recibe la notificación y lo entrega. Sin fricción, sin apps nativas, sin registros obligatorios.

---

## 🏗️ Arquitectura

**Monolito Modular + Event-Driven** — seleccionada siguiendo las recomendaciones para sistemas E-commerce.

| Módulo | Responsabilidad | Ruta |
|---|---|---|
| 🛒 **Cliente** | Catálogo público, carrito, pago Wompi, rastreo en tiempo real, confirmación de pago | `/mesa/[uuid]` |
| 👨‍🍳 **Cocina** | Kanban de pedidos, CRUD de platos, cambio de estado | `/cocina` |
| 🏍️ **Logística** | Panel de entregas, confirmación de entrega | `/logistica` |
| ⚙️ **Admin** | Gestión de personal, QR de mesas, dashboard de ventas, Arianna AI (chat con IA vía Groq + n8n) | `/admin` |

Cada módulo tiene sus propias Server Actions, componentes y hooks. Comparten el schema de Supabase y el mismo deploy.

**Event Bus:** Supabase Realtime actúa como bus de eventos centralizado. Cada INSERT/UPDATE/DELETE en la base de datos dispara eventos WebSocket que los módulos suscritos reciben sin recargar la página.

> [!NOTE]
> Ver detalle completo en [`docs/03-arquitectura/decision.md`](docs/03-arquitectura/decision.md) y el diagrama en [`docs/03-arquitectura/diagrama.md`](docs/03-arquitectura/diagrama.md)

---

## 🧩 Patrones de Diseño (11)

Integrados de forma coherente en 4 niveles arquitectónicos:

| # | Patrón | Tipo | ¿Qué resuelve? |
|---|---|---|---|
| 1 | **Pub/Sub** | Comportamiento | Sincronización en tiempo real sin polling |
| 2 | **Guard** | Comportamiento | Validaciones secuenciales antes de ejecutar acciones |
| 3 | **State Machine** | Comportamiento | Transiciones válidas del ciclo de vida del pedido |
| 4 | **Singleton** | Creacional | Instancia única global (Realtime + Carrito) |
| 5 | **Simple Factory** | Creacional | Creación parametrizada de validadores por tipo de plato |
| 6 | **Facade** | Estructural | APIs externas simplificadas (Wompi, Cloudinary, Brevo, n8n) |
| 7 | **Adapter** | Estructural | WebSocket de Supabase adaptado al ciclo de vida React |
| 8 | **Proxy** | Estructural | Control de acceso a rutas del staff por autenticación y rol |
| 9 | **Repository** | Arquitectónico | Acceso a datos encapsulado por dominio |
| 10 | **DI** | Arquitectónico | Mock injection para testing sin base de datos |
| 11 | **AI Agent** | Arquitectónico | Delegar consultas en lenguaje natural a un LLM que accede a la BD vía herramientas |

> [!IMPORTANT]
> Ver documentación completa de cada patrón en [`docs/04-patrones/indice.md`](docs/04-patrones/indice.md) — incluye diagramas Mermaid, referencias exactas al código y tests asociados.

---

## 🧪 Pruebas

**140 casos de prueba** implementados en Vitest + Testing Library:

| Tipo | Casos | Herramienta |
|---|---|---|
| Unitarias | 90 | Vitest |
| Integración | 19 | Vitest + Supabase local |
| Componentes | 31 | Testing Library + jsdom |

### Lo que se prueba
- Store del carrito (Zustand + localStorage)
- Máquina de estados del pedido (14 tests de transiciones válidas e inválidas)
- Simple Factory de platos (11 tests por tipo y validación)
- Facades de Wompi y Brevo (firmas SHA256, envío de emails, manejo de errores)
- Pub/Sub Realtime (canales, suscripciones, cancelación, DI con mocks)
- CRUD platos → visibilidad cliente
- Seguridad RLS (cliente anónimo, mesero, admin)
- **Rastreo de pedido** (máquina de estados del modal: input → validando → rastreando → entregado, 10 tests)
- **Server Action pública** (búsqueda por prefijo, case-insensitive, `#` prefix, 10 tests)
- **Modal de rastreo** (render de 6 estados, callbacks, botones, 12 tests)
- **Modal de pago exitoso** (checkmark, ID, correo, instrucciones, 8 tests)

```bash
bun test          # Watch mode (Vitest)
bun run test:run  # Single run
```

> [!NOTE]
> Ver estrategia completa en [`docs/06-pruebas/estrategia.md`](docs/06-pruebas/estrategia.md)

---

## 🛡️ Riesgos y Supuestos

8 riesgos identificados con mitigación documentada:

| Riesgo | Mitigación |
|---|---|
| Inconsistencia de datos por red inestable | Optimistic updates con rollback, Server Actions validan estrictamente |
| Pago duplicado | Idempotencia vía `wompi_transaccion_id` único |
| Pérdida de mensajes Realtime | Reconexión automática + retry con backoff (200ms, 400ms) |
| Escalación de costos Supabase | Plan gratuito suficiente para desarrollo, RLS + connection pooling en producción |
| Imágenes grandes degradan rendimiento | Cloudinary optimiza automáticamente (WebP, compresión, tamaños responsivos) |
| Rate limit de Groq detiene a Arianna | Notificación clara al usuario ("Arianna está saturada, espera unos minutos"). Cambio de API key o modelo mitiga. |

> [!NOTE]
> Ver análisis completo en [`docs/07-riesgos/analisis.md`](docs/07-riesgos/analisis.md)

---

## 💰 ¿Qué costo añade?

| Servicio | Costo mensual estimado |
|---|---|
| Supabase | $0 (tier gratuito: 500MB BD, 50K usuarios, 5GB ancho de banda) |
| Cloudinary | $0 (tier gratuito: 25GB storage) |
| Wompi | Comisión por transacción (~3.5% + $1,000 COP) |
| Brevo | $0 (300 emails/día gratuitos) |
| Groq (LLM) | $0 (tier gratuito: 100K tokens/día, ~30 req/min para Llama 3.3 70B) |
| Railway (n8n) | $0 (plan Hobby: $5 crédito inicial, suficiente para desarrollo) |
| Vercel (deploy) | $0 (plan Hobby) |

**Costo total fijo: $0/mes. Solo se paga la comisión de Wompi por cada venta.**

> [!TIP]
> El proyecto actualmente funciona en producción con múltiples pantallas simultáneas sin costo de infraestructura. Supabase escala a plan Pro (~$25/mes) solo cuando se necesita más de 500MB de BD, backups automáticos, o múltiples sucursales. Groq escala a plan Dev (~$5/mes) si se superan los 100K tokens diarios. Railway escala a plan Starter (~$5/mes) al agotar el crédito inicial.

---

## 📈 ¿Cómo crecerá luego?

| Escenario | Solución arquitectónica |
|---|---|
| Más sucursales | Extraer módulo Admin a servicio separado, una instancia de Supabase por sucursal |
| Más tipos de producto | **Simple Factory:** nueva clase concreta en `CREADORES`, sin modificar código existente |
| Más pasarelas de pago | **Facade:** nueva fachada, el resto del código no se toca |
| Alta concurrencia (>500 pedidos/h) | Migrar Server Actions a Route Handlers con Edge Runtime, Redis para caché |
| App móvil nativa | La API ya existe (Server Actions) — migrar a REST o tRPC |

---

## 🆚 ¿Qué mejora frente a soluciones existentes?

| Solución | Limitación | E-Kitchen |
|---|---|---|
| Menú QR genérico (PDF) | Estático, no refleja disponibilidad | Catálogo dinámico sincronizado en tiempo real con cocina |
| Apps de delivery (Rappi, Uber) | Comisión 20-30%, sin integración con cocina | Sin comisión externa, flujo directo cocina↔mesero |
| TPV tradicional | Solo caja, sin comunicación con cocina | Trazabilidad completa: mesa → cocina → mesa |
| Pedidos por WhatsApp | Sin estructura, pérdida de pedidos | Pedidos estructurados con estados, roles y auditoría |

---

## 🚀 Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router + Turbopack) | 16.2.6 |
| Runtime / PKM | Bun | 1.x |
| UI | React + shadcn/ui + Tailwind CSS | 19.2.4 / latest / 4.x |
| Base de datos | Supabase (PostgreSQL + RLS) | — |
| ORM (schema) | Drizzle ORM | 0.45.2 |
| Runtime queries | Supabase JS Client | ^2.105 |
| Auth | Supabase Auth (SSR) | 0.10.3 |
| Estado cliente | Zustand | 5.0.13 |
| Pagos | Wompi | Widget + API REST |
| Imágenes | Cloudinary | SDK cloudinary ^2 |
| Emails | Brevo | API v3 SMTP |
| Automatización | n8n (self-hosted en Railway) | latest |
| LLM | Groq (Llama 3.3 70B) | API compatible OpenAI |
| Contenedores | Docker + Docker Compose | latest |
| Testing | Vitest + Testing Library + jsdom | 4.1.6 / 16.3.2 / 29.1.1 |

> [!NOTE]
> Ver versiones completas y justificación en [`docs/05-tecnologico/stack.md`](docs/05-tecnologico/stack.md)

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (páginas y layouts)
│   ├── layout.tsx          # Layout raíz (fuentes, metadata)
│   ├── page.tsx            # Menú público (catálogo sin mesa)
│   ├── globals.css         # Tailwind CSS + variables de diseño
│   ├── login/page.tsx      # Inicio de sesión staff (Supabase Auth)
│   ├── mesa/[uuid]/        # Módulo Cliente (QR + menú + pago + rastreo)
│   │   └── page.tsx
│   ├── api/asistente/chat/ # Route Handler SSE → n8n (Arianna AI)
│   │   └── route.ts
│   └── (staff)/            # Route group protegido (proxy.ts)
│       ├── layout.tsx      # Layout staff (sidebar + header)
│       ├── cocina/
│       │   ├── page.tsx    # Panel Kanban
│       │   └── platos/
│       │       └── page.tsx # CRUD de platos
│       ├── logistica/
│       │   └── page.tsx    # Panel de entregas
│       └── admin/
│           ├── page.tsx    # Dashboard
│           ├── asistente/
│           │   └── page.tsx # Arianna AI (chat con IA)
│           ├── personal/
│           │   └── page.tsx # Gestión de personal
│           └── mesas/
│               └── page.tsx # Gestión de mesas
├── components/
│   ├── ui/                 # shadcn/ui (Button, Card, Dialog, Sheet...) + CargandoPedido
│   ├── cliente/            # Catálogo, carrito, Wompi, rastreo (8 archivos), pago exitoso
│   ├── cocina/             # Kanban, formulario plato, stats
│   ├── logistica/          # Lista de entregas
│   ├── admin/              # Dashboard, personal, mesas, QR, Arianna AI (8 archivos)
│   ├── staff/              # Sidebar, header, navegación
│   └── compartidos/        # Toast, ImageDropzone, EstadoVacio
├── hooks/                  # 23 hooks (useRealtime, useRastrearPedido, useAsistenteChat, usePago...)
├── stores/                 # Zustand: cart.ts + asistente.ts
├── lib/
│   ├── acciones/           # 10 Server Actions: platos, pago, cocina, catalogo, categorias, admin, auth, imagenes, pedidoPublico, asistente
│   ├── servicios/          # Patrones: Facade, Simple Factory, Pub/Sub, Singleton, Observer
│   ├── supabase/           # Clientes SSR + Browser + Admin
│   ├── db/                 # Drizzle schema (solo migraciones)
│   ├── formato.ts          # formatearPrecio() (COP)
│   ├── iniciales.ts        # obtenerIniciales()
│   ├── utils.ts            # cn() (clsx + tailwind-merge)
│   └── redirecciones.ts    # RUTA_POR_ROL, RUTAS_POR_ROL
├── types/                  # Interfaces TypeScript del dominio
└── proxy.ts                # Auth + protección de rutas (Proxy pattern)

n8n/                        # Workflows de n8n (respaldo)
├── arianna-ai-workflow.json    # Workflow principal (6 nodos: Webhook → AI Agent + Groq + Supabase)
└── limpiar-historial-workflow.json # Cleanup automático cada 5 min
docker-compose.yml          # n8n + PostgreSQL (desarrollo local)
```

---

## ⚡ Inicio Rápido

```bash
# 1. Clonar e instalar
git clone <repo-url>
cd arquitectura
bun install

# 2. Configurar variables de entorno (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_WOMBI_PUBLIC_KEY=pub_test_...
WOMBI_INTEGRITY_SECRET=test_integrity_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=no-reply@ekitchen.com

# 3. (Opcional) Configurar n8n para Arianna AI
N8N_ASISTENTE_WEBHOOK_URL=
N8N_ASISTENTE_SECRET=
N8N_ASISTENTE_HISTORIAL_URL=

# 4. (Opcional) Iniciar n8n local con Docker
docker compose up -d
# n8n disponible en http://localhost:5678
# Importar workflows desde n8n/

# 5. Ejecutar migraciones (Drizzle)
bunx drizzle-kit push

# 6. Iniciar desarrollo
bun run dev

# 7. Ejecutar tests
bun run test
```

---

## 📚 Documentación Completa

| Sección | Enlace |
|---|---|
| Problema y contexto | [`docs/01-problema/contexto.md`](docs/01-problema/contexto.md) |
| Alcance funcional | [`docs/02-alcance/funcional.md`](docs/02-alcance/funcional.md) |
| Historias de usuario | [`docs/02-alcance/historias-usuario.md`](docs/02-alcance/historias-usuario.md) |
| Decisión arquitectónica | [`docs/03-arquitectura/decision.md`](docs/03-arquitectura/decision.md) |
| Diagrama de arquitectura | [`docs/03-arquitectura/diagrama.md`](docs/03-arquitectura/diagrama.md) |
| Estructura de módulos | [`docs/03-arquitectura/modulos.md`](docs/03-arquitectura/modulos.md) |
| Esquema de base de datos | [`docs/03-arquitectura/schema.md`](docs/03-arquitectura/schema.md) |
| API / Server Actions | [`docs/03-arquitectura/api.md`](docs/03-arquitectura/api.md) |
| Diagramas de flujo | [`docs/03-arquitectura/flujos.md`](docs/03-arquitectura/flujos.md) |
| **11 Patrones de Diseño** | **[`docs/04-patrones/indice.md`](docs/04-patrones/indice.md)** |
| Stack tecnológico | [`docs/05-tecnologico/stack.md`](docs/05-tecnologico/stack.md) |
| Estrategia de pruebas | [`docs/06-pruebas/estrategia.md`](docs/06-pruebas/estrategia.md) |
| Riesgos y mitigaciones | [`docs/07-riesgos/analisis.md`](docs/07-riesgos/analisis.md) |
| Evaluación arquitectónica | [`docs/08-evaluacion/criterios.md`](docs/08-evaluacion/criterios.md) |
| Diseño (color palette) | [`docs/diseno/DESIGN.md`](docs/diseno/DESIGN.md) |
| Requisitos académicos | [`docs/trabajo_arquitectura.md`](docs/trabajo_arquitectura.md) |

---

## 👥 Equipo

**Proyecto Final de Arquitectura de Software, 2026.**

| Integrantes |
|---|
| Daniel Rivas Agredo |
| Luisa Juliet Juaqui |
| Mateo Rivera |
| Deiby Alejandro Ramirez |
| David Urrutia Ceron |
| Thomas Montoya Magon |
