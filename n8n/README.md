# n8n Workflows — Arianna AI (E-Kitchen)

Este directorio contiene los workflows de n8n que implementan el asistente virtual **Arianna AI** para E-Kitchen.

## Archivos

| Archivo | Descripcion | Estado |
|---|---|---|
| `export/arianna-ai.json` | Exportacion limpia lista para importar en n8n | **Publicado** (Railway) |
| `export/limpiar-historial.json` | Workflow de limpieza diaria de chat | **Eliminado de n8n** (backup local) |
| `arianna-ai-workflow.json` | Copia completa con metadatos (version, IDs, URLs) | Referencia |
| `limpiar-historial-workflow.json` | Copia completa con metadatos | Referencia |

## Como importar

1. Abre tu instancia de n8n
2. Ve a **Workflows** > **Import from File**
3. Selecciona el archivo `export/arianna-ai.json` (o `export/limpiar-historial.json`)
4. Configura las credenciales (ver abajo)
5. Activa el workflow

## Credenciales necesarias

### Arianna AI (`arianna-ai.json`)

| Nodo | Tipo de credencial | Descripcion |
|---|---|---|
| Gemini (AI Studio) | `googleGeminiApi` | API Key de Google AI Studio con acceso a `models/gemini-2.5-flash` |
| Consultar pedidos | `supabaseApi` | Supabase API (URL + `service_role` key) con acceso a `pedidos`, `mesas`, `items_pedido`, `platos` |
| Consultar platos | `supabaseApi` | Misma credencial Supabase (se reutiliza) |
| Consultar personal | `supabaseApi` | Misma credencial Supabase (se reutiliza) |

### Limpiar Historial (`limpiar-historial.json`)

| Nodo | Tipo de credencial | Descripcion |
|---|---|---|
| Limpiar TODO el historial | `postgres` | Conexion a PostgreSQL donde n8n guarda `n8n_chat_histories_arianna` |

## Notas

- El webhook se expone en `/webhook/ari` con metodo `POST` y respuesta `streaming` (SSE)
- El AI Agent usa el system prompt en espanol con tono colombiano
- Las consultas a Supabase usan el filtro `select=...` con joins anidados (PostgREST)
- La temperatura del LLM esta en `0.3` para respuestas precisas
- `maxIterations` en `8` para evitar bucles infinitos del agente

## Variables de entorno (Next.js)

El frontend de E-Kitchen se comunica con n8n via estas variables en `.env.local`:

```
N8N_ASISTENTE_WEBHOOK_URL=https://tu-n8n.com/webhook/ari
N8N_ASISTENTE_SECRET=tu-secret-si-configuras-auth
N8N_ASISTENTE_HISTORIAL_URL=https://tu-n8n.com/webhook/historial
```
