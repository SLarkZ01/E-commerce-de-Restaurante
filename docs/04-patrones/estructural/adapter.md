# 04 — Adapter

## Concepto

El patrón Adapter convierte la interfaz de una clase en otra interfaz que el cliente espera. Permite que clases con interfaces incompatibles trabajen juntas.

---

## Aplicación en E-Kitchen

El hook `useRealtime` actúa como **Adapter** entre la compleja API de canales WebSocket de Supabase y la interfaz simple que los componentes React esperan.

### La interfaz incompatible (Adaptee)

Supabase Realtime expone una API de bajo nivel:

```typescript
const supabase = crearCliente();
const canal = supabase
  .channel("nombre-unico")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "pedidos" }, callback)
  .subscribe();

// Gestionar manualmente: autenticación, desconexión, nombres únicos, ciclo de vida
```

Esta API requiere que el desarrollador:
1. Gestione la autenticación manualmente (`setAuth`)
2. Genere nombres de canal únicos para evitar colisiones
3. Maneje el ciclo de vida (suscribir, cancelar)
4. Maneje race conditions (auth vs canal, mount vs unmount)

### La interfaz que el cliente espera (Target)

Los componentes React quieren una interfaz declarativa:

```typescript
useRealtime("pedidos", "INSERT", callback, "estado=eq.listo");
// El hook gestiona TODO el ciclo de vida automáticamente
```

### El Adapter

**Archivo:** `src/hooks/useRealtime.ts:20-62`

```typescript
export function useRealtime(
  tabla: string,
  evento: EventoRealtime,
  callback: (payload) => void,
  filtro?: string,
  servicio?: IServicioRealtime  // DI
) {
  const callbackRef = useRef(callback);
  useEffect(() => { callbackRef.current = callback; });  // ← evitar re-suscripciones

  const [svc] = useState(() => servicio ?? crearRealtimeService());

  useEffect(() => {
    let activo = true;
    let suscripcionVigente = null;

    svc.suscribir(
      { tabla, evento, filtro, schema: "public" },
      (payload) => { if (activo) callbackRef.current(payload); }
    ).then((suscripcion) => {
      if (activo) suscripcionVigente = suscripcion;
      else suscripcion.cancelar();  // ← cancelar si ya se desmontó
    });

    return () => {
      activo = false;
      if (suscripcionVigente) suscripcionVigente.cancelar();  // ← limpiar al desmontar
    };
  }, [svc, tabla, evento, filtro]);
}
```

### Lo que el Adapter resuelve

| Problema | Solución del Adapter |
|---|---|
| Canal debe crearse y destruirse con el componente | `useEffect` con cleanup function |
| Callback cambia en cada render | `useRef` para mantener referencia estable sin re-suscripción |
| Auth token debe configurarse antes del canal | El servicio concreto (`SupabaseRealtimeService`) llama `setAuth` antes de `channel()` |
| Race condition: unmount antes de que la promesa resuelva | Flag `activo` — si `false` al resolver, cancela inmediatamente |
| Nombres de canal deben ser únicos | Contador atómico + timestamp en `SupabaseRealtimeService` |
| Componentes no deberían conocer la API de Supabase | El hook expone solo `(tabla, evento, callback, filtro)` |

---

## Referencia completa en el código

| Componente | Archivo | Rol |
|---|---|---|
| **Adaptee** | API de Supabase Realtime | `channel().on().subscribe()` — interfaz incompatible con React |
| **Target** | Interfaz esperada por componentes | `(tabla, evento, callback, filtro?)` — declarativa |
| **Adapter** | `src/hooks/useRealtime.ts:20-62` | Traduce WebSocket ↔ React lifecycle |
| **Servicio adaptado** | `src/lib/servicios/realtimeService.ts` | Encapsula los detalles de Supabase |

---

## Beneficio clave

Los 4 hooks de negocio (`usePedidosRealtime`, `usePlatosRealtime`, `useMiPedidoRealtime`, `useEntregaPedidos`) y el componente `statsBar.tsx` (que usa `useRealtime` directamente) no necesitan saber nada sobre la API de canales de Supabase. Solo llaman `useRealtime(tabla, evento, callback)`.
