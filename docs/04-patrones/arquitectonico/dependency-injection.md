# 04 — Dependency Injection

## Concepto

Dependency Injection (DI) es una técnica donde un objeto recibe sus dependencias desde fuera, en lugar de crearlas internamente. Esto desacopla el objeto de implementaciones concretas, facilitando el testing (usando mocks) y la flexibilidad (cambiando la implementación sin tocar el código cliente).

Se relaciona directamente con el principio DIP (Dependency Inversion Principle) de SOLID: "Depende de abstracciones, no de concreciones".

---

## Aplicación en E-Kitchen

El patrón DI se aplica en el hook `useRealtime` mediante un parámetro opcional tipado con una abstracción (`IServicioRealtime`).

### La abstracción

**Archivo:** `src/lib/servicios/realtimeService.ts:21-28`

```typescript
export interface IServicioRealtime {
  suscribir<TRow>(opciones: OpcionesSuscripcion, callback: CallbackCambio<TRow>): Promise<ISuscripcionRealtime>;
  desconectarTodo(): Promise<void>;
}
```

### La inyección

**Archivo:** `src/hooks/useRealtime.ts:20-26`

```typescript
export function useRealtime(
  tabla: string,
  evento: EventoRealtime,
  callback: (payload) => void,
  filtro?: string,
  servicio?: IServicioRealtime  // ← abstracción inyectable
) {
  const [svc] = useState(() => servicio ?? crearRealtimeService());
  // Si no se inyecta, usa el singleton por defecto
}
```

### Convención sobre configuración

- **En producción:** No se pasa el parámetro `servicio` → se usa el singleton `crearRealtimeService()` (que retorna `SupabaseRealtimeService`)
- **En testing:** Se inyecta un mock que implementa `IServicioRealtime`

### Uso en tests

**Archivo:** `tests/integracion/negocio/observer.test.ts:14-18`

```typescript
function crearMockServicio() {
  return {
    suscribir: vi.fn().mockResolvedValue({ cancelar: vi.fn() }),
    desconectarTodo: vi.fn().mockResolvedValue(undefined),
  } as IServicioRealtime;
}

// El mock se inyecta en el hook durante el test:
renderHook(() =>
  useRealtime("pedidos", "INSERT", callback, undefined, servicio)
);
// El hook usa el mock en lugar de Supabase real ✅
```

Esto permite probar el comportamiento del hook sin una base de datos real, sin WebSocket, y sin variables de entorno de Supabase. Los tests de integración del Observer (`observer.test.ts`) validan:
- Que el hook llama a `servicio.suscribir()` con los parámetros correctos
- Que el filtro se propaga al servicio
- Que los callbacks se ejecutan cuando el servicio emite eventos
- Que la suscripción se cancela al desmontar

---

## Cadena de DI en los hooks de negocio

Todos los hooks que usan `useRealtime` aceptan también el parámetro inyectable:

```typescript
// src/hooks/usePedidosRealtime.ts:34-37
export function usePedidosRealtime(callbacks: CallbacksPedido, servicio?: IServicioRealtime) {
  useRealtime("pedidos", "INSERT", onInsert, undefined, servicio);  // ← pasa servicio
  useRealtime("pedidos", "UPDATE", onUpdate, undefined, servicio);
}

// src/hooks/usePlatosRealtime.ts:14-16
export function usePlatosRealtime(callbacks: CallbacksPlato, servicio?: IServicioRealtime) {
  useRealtime("platos", "INSERT", onInsert, undefined, servicio);
}

// src/hooks/useMiPedidoRealtime.ts:12-15
export function useMiPedidoRealtime(pedidoId, callbacks: CallbacksMiPedido, servicio?: IServicioRealtime) {
  useRealtime("pedidos", "UPDATE", onUpdate, filtro, servicio);
}
```

---

## Referencia completa en el código

| Componente | Archivo | Rol |
|---|---|---|
| **Abstracción** | `src/lib/servicios/realtimeService.ts:21-28` | `IServicioRealtime` |
| **Implementación concreta** | `src/lib/servicios/realtimeService.ts:30-89` | `SupabaseRealtimeService` |
| **Inyección (hook genérico)** | `src/hooks/useRealtime.ts:25` | `servicio?: IServicioRealtime` |
| **Inyección (hooks de negocio)** | `usePedidosRealtime.ts:36`, `usePlatosRealtime.ts:16`, `useMiPedidoRealtime.ts:15` | `servicio?: IServicioRealtime` |
| **Mock en tests** | `tests/integracion/negocio/observer.test.ts:14-18` | `crearMockServicio()` |
| **Test de integración** | `tests/integracion/negocio/observer.test.ts` | 6 tests con mock inyectado |

---

## Beneficio clave

Los tests del Observer (6 casos) se ejecutan **sin Supabase, sin WebSocket, sin base de datos**. Solo validan el contrato entre el hook y la abstracción `IServicioRealtime`. Esto hace los tests rápidos, deterministas y sin dependencias externas.
