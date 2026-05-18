# 04 — Singleton

## Concepto

El patrón Singleton garantiza que una clase tenga una única instancia y proporciona un punto global de acceso a ella. Se usa cuando exactamente un objeto debe coordinar acciones en todo el sistema.

---

## Aplicación en E-Kitchen

El patrón Singleton se aplica en **dos lugares** del código, con dos estilos diferentes:

### 1. Servicio de Realtime (lazy initialization clásica)

**Archivo:** `src/lib/servicios/realtimeService.ts:91-98`

```typescript
let instanciaGlobal: SupabaseRealtimeService | null = null;

export function crearRealtimeService(): IServicioRealtime {
  if (!instanciaGlobal) {
    instanciaGlobal = new SupabaseRealtimeService();
  }
  return instanciaGlobal;
}
```

- **Lazy initialization:** Solo se crea la instancia cuando se solicita por primera vez
- **Una instancia por aplicación:** La variable `instanciaGlobal` está en el ámbito del módulo JS, compartida por todos los imports
- **Retorna la abstracción:** El factory retorna `IServicioRealtime`, no la clase concreta (permite DI)
- **Thread-safe en JS:** No hay concurrencia real en el event loop de Node.js

### 2. Carrito de compras (Zustand `create`)

**Archivo:** `src/stores/cart.ts:14-58`

```typescript
export const usarCarrito = create<EstadoCarrito>()(
  persist(
    (set, get) => ({
      items: [],
      agregarItem: (item) => set((state) => { /* ... */ }),
      eliminarItem: (id) => set((state) => { /* ... */ }),
      actualizarCantidad: (id, cantidad) => set((state) => { /* ... */ }),
      vaciarCarrito: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    }),
    {
      name: "e-kitchen-carrito",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

- **Singleton a nivel de módulo:** `zustand/create()` retorna un hook que siempre referencia el mismo store
- **Persistencia automática:** El middleware `persist` guarda/carga el estado en `localStorage` con la clave `"e-kitchen-carrito"`
- **Único punto de acceso:** `usarCarrito` es el hook exportado, usado por todos los componentes del cliente

---

## Referencia completa en el código

| Singleton | Archivo | Estilo | Consumidores |
|---|---|---|---|
| `crearRealtimeService()` | `src/lib/servicios/realtimeService.ts:91-98` | Lazy init clásico | `useRealtime`, `usePedidosRealtime`, `usePlatosRealtime`, etc. |
| `usarCarrito` (Zustand) | `src/stores/cart.ts:14` | Módulo ES + persist | `catalogoPlatos.tsx`, `CarritoContenido.tsx`, `carritoSheet.tsx`, `useCheckoutWompi.ts` |

---

## Beneficio clave

Un solo canal WebSocket compartido evita conexiones duplicadas a Supabase. Un solo store del carrito garantiza que todos los componentes vean el mismo estado (agregar desde el catálogo, ver en el drawer móvil, pagar desde el sidebar).
