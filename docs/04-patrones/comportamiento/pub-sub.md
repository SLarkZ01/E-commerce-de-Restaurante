# 04 — Pub/Sub (Publicador-Suscriptor)

## Concepto

El patrón Pub/Sub desacopla los publicadores de eventos de los suscriptores mediante un intermediario (broker/message bus). Los publicadores emiten eventos a canales y los suscriptores se registran para recibir eventos de canales específicos, sin conocerse entre sí.

---

## Aplicación en E-Kitchen

Supabase Realtime actúa como **broker de eventos**. La base de datos (PostgreSQL) es el publicador: cada INSERT, UPDATE o DELETE dispara eventos `postgres_changes`. Los hooks y componentes React son los suscriptores, registrándose a canales específicos por tabla y tipo de evento.

### Arquitectura del patrón

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  PostgreSQL │────▶│ Supabase Realtime │────▶│ useRealtime      │
│  (publisher)│     │ (event broker)    │     │ (subscriber)     │
└─────────────┘     └──────────────────┘     └────────┬─────────┘
                                                       │
                                          ┌────────────┼────────────┐
                                          ▼            ▼            ▼
                                   usePedidos    usePlatos    useMiPedido
                                   Realtime      Realtime     Realtime
```

### ¿Qué observa cada módulo?

| Suscriptor | Canal (tabla) | Eventos | Filtro | Hook | Componentes |
|---|---|---|---|---|---|
| Panel Cocina | `pedidos` | INSERT, UPDATE | — | `usePedidosRealtime` | `kanbanPedidos.tsx` |
| Stats Cocina | `pedidos` | * (todos) | — | `useRealtime` directo | `statsBar.tsx` |
| Panel Mesero | `pedidos` | UPDATE | `estado=eq.listo` | `useEntregaPedidos` | `listaEntregas.tsx` |
| Menú Cliente | `platos` | INSERT, UPDATE, DELETE | — | `usePlatosRealtime` | Catálogo en `/mesa/[uuid]` |
| Cliente (estado) | `pedidos` | UPDATE | `id=eq.{pedidoId}` | `useMiPedidoRealtime` | Tracking de pedido |

---

## Implementación

### Servicio de Realtime (Singleton + abstracción)

**Archivo:** `src/lib/servicios/realtimeService.ts`

```typescript
export interface IServicioRealtime {
  suscribir<TRow>(opciones: OpcionesSuscripcion, callback: CallbackCambio<TRow>): Promise<ISuscripcionRealtime>;
  desconectarTodo(): Promise<void>;
}

export class SupabaseRealtimeService implements IServicioRealtime {
  private contadorCanales = 0;

  async suscribir<TRow>(opciones, callback): Promise<ISuscripcionRealtime> {
    const supabase = crearCliente();
    // Mitigar race condition: forzar setAuth antes de crear el canal
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) supabase.realtime.setAuth(session.access_token);
    // Nombre único con contador para evitar colisiones entre mounts
    this.contadorCanales++;
    const nombre = `rt-${opciones.tabla}-${opciones.evento}-${this.contadorCanales}-${Date.now()}`;
    const canal = supabase
      .channel(nombre)
      .on("postgres_changes", { event, schema, table, filter }, callback)
      .subscribe();
    return { cancelar: () => supabase.removeChannel(canal) };
  }
}
```

### Hook genérico (Adapter + DI)

**Archivo:** `src/hooks/useRealtime.ts`

```typescript
export function useRealtime(
  tabla: string,
  evento: EventoRealtime,
  callback: (payload: RealtimePostgresChangesPayload) => void,
  filtro?: string,
  servicio?: IServicioRealtime  // ← DIP: inyectable para testing
) {
  // Gestiona ciclo de vida: suscribir en mount, cancelar en unmount
  // Usa refs para evitar re-suscripciones al cambiar el callback
}
```

### Race condition conocido: pedido vs items_pedido

Cuando un cliente paga, `crearPedidoWompi` ejecuta dos INSERT secuenciales:

```
1. INSERT INTO pedidos ...       ← Realtime emite evento inmediatamente
2. INSERT INTO items_pedido ...  ← ~50-200ms después
```

El hook `usePedidosRealtime` recibe el evento en el paso 1, pero los items aún no existen.

**Mitigación implementada en `src/hooks/usePedidosRealtime.ts:9-26`:**

```typescript
const RETRASOS_REINTENTO = [200, 400];

async function obtenerPedidoConReintento(pedidoId: string) {
  for (let intento = 0; intento <= MAX_REINTENTOS; intento++) {
    const pedido = await obtenerPedidoConDetalles(pedidoId);
    if (pedido && pedido.items.length > 0) return pedido;
    if (intento < MAX_REINTENTOS) {
      await new Promise((r) => setTimeout(r, RETRASOS_REINTENTO[intento]));
    }
  }
  return null;
}
```

---

## Referencia completa en el código

| Componente | Archivo | Rol |
|---|---|---|
| **Interfaz del servicio** | `src/lib/servicios/realtimeService.ts:21-28` | `IServicioRealtime`, `ISuscripcionRealtime` |
| **Servicio concreto** | `src/lib/servicios/realtimeService.ts:30-89` | `SupabaseRealtimeService` |
| **Singleton factory** | `src/lib/servicios/realtimeService.ts:91-98` | `crearRealtimeService()` |
| **Hook genérico** | `src/hooks/useRealtime.ts:20-62` | `useRealtime()` |
| **Hook pedidos** | `src/hooks/usePedidosRealtime.ts` | INSERT + UPDATE en `pedidos` con retry |
| **Hook platos** | `src/hooks/usePlatosRealtime.ts` | INSERT + UPDATE + DELETE en `platos` |
| **Hook mi pedido** | `src/hooks/useMiPedidoRealtime.ts` | UPDATE filtrado por `id=eq.{pedidoId}` |
| **Hook entregas** | `src/hooks/useEntregaPedidos.ts:18-32` | UPDATE filtrado por `estado=eq.listo` |
| **Consumidor Kanban** | `src/components/cocina/kanbanPedidos.tsx:27-48` | `usePedidosRealtime` |
| **Consumidor Stats** | `src/components/cocina/statsBar.tsx:18-42` | `useRealtime("pedidos", "*")` |
| **Consumidor Logística** | `src/components/logistica/listaEntregas.tsx:18-28` | `useEntregaPedidos` |
| **Tests unitarios** | `tests/unitarias/servicios/realtimeService.test.ts` | 8 tests del servicio concreto |
| **Tests integración** | `tests/integracion/negocio/observer.test.ts` | 6 tests del hook con mock inyectado |

---

## Beneficio clave

Sin Pub/Sub, los paneles de cocina y logística necesitarían **polling** (recargar la página cada N segundos). Con Realtime, los cambios aparecen instantáneamente sin recarga manual, eliminando latencia entre que el cliente pide y el cocinero ve el pedido.
