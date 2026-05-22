# AI Agent + Tool Calling (n8n)

## Clasificación
- **Tipo:** Arquitectónico
- **Propósito:** Delegar consultas de lenguaje natural a un LLM externo que accede a los datos del sistema vía herramientas (herramientas) y responde en streaming.

## Problema que resuelve

El administrador necesita consultar datos del restaurante (ventas, platos, personal, mesas) sin navegar por múltiples pantallas del dashboard. Un chatbot tradicional requeriría programar manualmente cada tipo de consulta. Un LLM por sí solo alucinaría datos. Se necesita un sistema que:

1. Entienda preguntas en lenguaje natural
2. Consulte la base de datos real (Supabase) para obtener datos precisos
3. Responda en lenguaje natural con los datos reales
4. Transmita la respuesta en tiempo real (streaming)

## Solución

El patrón **AI Agent + Tool Calling** delega la interpretación de la pregunta a un LLM (Groq, vía OpenAI-compatible), que decide autónomamente qué herramienta usar para consultar Supabase. El resultado de la herramienta se devuelve al LLM, que formula la respuesta final.

```
┌──────────┐   POST /api/asistente/chat   ┌──────────────┐   POST webhook   ┌─────────┐
│ Next.js  │ ────────────────────────────→ │ Route Handler │ ───────────────→ │  n8n    │
│ (cliente)│ ←── SSE streaming ────────── │               │ ←── streaming ── │         │
└──────────┘                              └──────────────┘                  └────┬────┘
                                                                                 │
                                                                     ┌───────────┴───────────┐
                                                                     │     AI Agent (Groq)    │
                                                                     │  ┌──────────────────┐  │
                                                                     │  │ Think Tool       │  │
                                                                     │  │ Supabase Tool    │  │
                                                                     │  │ Chat Memory (PG) │  │
                                                                     │  └──────────────────┘  │
                                                                     └───────────┬───────────┘
                                                                                 │
                                                                                 ▼
                                                                     ┌─────────────────────┐
                                                                     │  Supabase E-Kitchen  │
                                                                     │  (pedidos, platos,   │
                                                                     │   mesas, perfiles)   │
                                                                     └─────────────────────┘
```

## Implementación

### Componentes

| Componente | Archivo | Rol |
|---|---|---|
| **Route Handler** | `src/app/api/asistente/chat/route.ts` | Proxy entre Next.js y n8n. Obtiene info del admin, detecta rate limits, transmite la respuesta en streaming. |
| **Server Action** | `src/lib/acciones/asistente.ts` | Obtiene historial de conversaciones, elimina conversaciones remotas. |
| **Hook** | `src/hooks/useAsistenteChat.ts` | Máquina de estados del chat (idle → enviando → recibiendo → error). Maneja streaming SSE, buffer de líneas parciales, cancelación. |
| **Store** | `src/stores/asistente.ts` | Zustand + localStorage. Persiste conversaciones, mensajes, conversación activa. Soporta editar y eliminar mensajes. |
| **Provider** | `src/components/admin/AsistenteProvider.tsx` | Context para controlar sidebar abierto/cerrado. |
| **UI Components** | `src/components/admin/asistenteChat.tsx`, `AsistenteSidebar.tsx`, `AsistenteMensaje.tsx`, `AsistenteMensajes.tsx`, `AsistenteInput.tsx`, `AsistenteBienvenida.tsx`, `AsistenteCargando.tsx` | Chat tipo ChatGPT con sidebar de conversaciones, burbujas con Markdown, edición inline, eliminación. |

### Flujo de una consulta

1. Admin escribe pregunta → `useAsistenteChat.enviarMensaje()`
2. Hook llama a `POST /api/asistente/chat` con `{ mensaje, conversationId }`
3. Route Handler obtiene info del admin desde Supabase Auth, la antepone al mensaje, y reenvía a n8n
4. n8n AI Agent recibe el mensaje, decide si necesita consultar Supabase
5. Si necesita datos → activa la herramienta `Consultar Supabase` → Supabase devuelve resultados
6. AI Agent formula respuesta con los datos reales
7. n8n transmite la respuesta en streaming (SSE/chunked) → Route Handler → cliente
8. Cliente muestra el texto progresivamente (efecto "pintado")

### Streaming

El Webhook de n8n usa `responseMode: 'streaming'`. El AI Agent tiene `enableStreaming: true`. n8n envía chunks JSON:

```json
{"type":"item","content":"Hoy"}
{"type":"item","content":" llevas"}
{"type":"item","content":" $245.000"}
```

El hook cliente acumula los chunks y actualiza el store progresivamente. Si una línea JSON se corta entre chunks, un buffer reensambla las líneas incompletas.

### Memoria de conversación

n8n usa `memoryPostgresChat` conectado a la PostgreSQL de Railway. Cada conversación se identifica por `conversationId`. El contexto se limita a las últimas 10 interacciones (`contextWindowLength: 10`).

Paralelamente, el cliente persiste las conversaciones en Zustand + localStorage para mostrarlas en el sidebar sin depender de n8n.

### Personalización (System Prompt)

El system prompt define la personalidad de Arianna (cálida, colombiana, profesional) y describe el esquema completo de la base de datos para que el LLM sepa qué columnas consultar.

La información del admin (nombre, email, rol) se antepone a cada mensaje en el Route Handler antes de enviarlo a n8n, permitiendo que Arianna se dirija al usuario por su nombre.

## Relación con otros patrones

- **Facade:** El Route Handler (`route.ts`) actúa como fachada que oculta la complejidad de n8n y Groq.
- **Observer (Pub/Sub):** El streaming SSE implementa el patrón observer a nivel HTTP.
- **State Machine:** `useAsistenteChat` implementa una máquina de estados con transiciones idle → enviando → recibiendo → error.
- **Repository:** `asistente.ts` encapsula el acceso a datos del historial.
- **Dependency Injection (DIP):** El hook y los componentes dependen de abstracciones (store, provider), no de implementaciones concretas.

## Principios SOLID aplicados

| Principio | Aplicación |
|---|---|
| **SRP** | Cada componente UI maneja un solo estado (input, cargando, mensajes, sidebar). El hook maneja solo la lógica. |
| **OCP** | Agregar nuevas herramientas al AI Agent (crear, actualizar) no requiere modificar el código existente. |
| **LSP** | Los componentes de estado (Bienvenida, Cargando, Mensajes) son intercambiables. |
| **ISP** | Interfaces mínimas: `AsistenteMensajeProps`, `AsistenteInputProps`, etc. |
| **DIP** | La UI depende del hook y el store (abstracciones), no de n8n ni Groq directamente. |

## Archivos involucrados

```
src/
├── app/api/asistente/chat/route.ts       # Route Handler (SSE streaming)
├── app/(staff)/admin/asistente/page.tsx  # Página
├── components/admin/
│   ├── asistenteChat.tsx                 # Shell
│   ├── AsistenteProvider.tsx             # Context
│   ├── AsistenteSidebar.tsx              # Lista de conversaciones
│   ├── AsistenteMensaje.tsx              # Burbuja individual (Markdown + edición)
│   ├── AsistenteMensajes.tsx             # Lista de mensajes
│   ├── AsistenteInput.tsx                # Campo de texto + enviar
│   ├── AsistenteBienvenida.tsx           # Estado vacío
│   └── AsistenteCargando.tsx             # Indicador "pensando..."
├── hooks/useAsistenteChat.ts             # Máquina de estados + streaming
├── lib/acciones/asistente.ts             # Server Actions (historial)
├── stores/asistente.ts                   # Zustand (persistencia)
└── components/staff/configNavegacion.ts  # Ítem "Arianna AI" en sidebar
```

## Tests

| Archivo | Casos | Descripción |
|---|---|---|
| `tests/unitarias/hooks/useAsistenteChat.test.ts` | 8 | Máquina de estados del chat (idle → enviando → recibiendo → error), buffer de líneas parciales, cancelación |
| `tests/componentes/asistenteChat.test.tsx` | 10 | Render de estados (bienvenida, cargando, mensajes, error), streaming progresivo, edición y eliminación de mensajes |
| `tests/integracion/api/asistente.test.ts` | 5 | Route Handler SSE streaming, rate limiting, historial de conversaciones vía n8n |

> **Nota:** Las pruebas del AI Agent están planificadas pero requieren un mock del webhook de n8n para ejecutarse sin depender del servicio externo. Los tests de integración del Observer (`observer.test.ts`, 6 casos) validan el mismo patrón SSE/subscripción que usa el asistente.
