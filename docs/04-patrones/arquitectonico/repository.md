# 04 — Repository

## Concepto

El patrón Repository (Fowler) media entre el dominio y la capa de persistencia, actuando como una colección en memoria de objetos de dominio. Encapsula toda la lógica de acceso a datos para que el resto de la aplicación no dependa de detalles de infraestructura (SQL, APIs, ORMs).

---

## Aplicación en E-Kitchen

Los archivos de Server Actions en `src/lib/acciones/` actúan como **repositorios por dominio**. Cada archivo encapsula todas las operaciones de acceso a datos para una entidad o grupo de entidades relacionadas.

### Estructura de repositorios

```
src/lib/acciones/
├── catalogo.ts     → Repositorio de platos
├── categorias.ts   → Repositorio de categorías
├── cocina.ts       → Repositorio de pedidos + items
├── pago.ts         → Repositorio de pedidos (creación) + mesas (lectura)
├── admin.ts        → Repositorio de perfiles + mesas + estadísticas
├── imagenes.ts     → Repositorio de imágenes
├── platos.ts       → Repositorio de platos (solo lectura pública)
└── auth.ts         → Repositorio de sesión
```

### Operaciones por repositorio

| Repositorio | Entidad | Operaciones |
|---|---|---|
| `catalogo.ts` | `platos` | `obtenerTodosPlatos()`, `crearPlato()`, `actualizarPlato()`, `eliminarPlato()` |
| `categorias.ts` | `categorias` | `obtenerCategorias()`, `crearCategoria()`, `actualizarCategoria()`, `eliminarCategoria()` |
| `cocina.ts` | `pedidos`, `items_pedido` | `cambiarEstadoPedido()`, `obtenerPedidosPorEstado()`, `obtenerTodosPedidos()`, `obtenerPedidosConItems()`, `obtenerItemsPorPedido()`, `obtenerStatsCocina()`, `obtenerPedidoConDetalles()`, `obtenerTodosPedidosConImagenes()`, `obtenerPedidosListosConDetalles()` |
| `pago.ts` | `pedidos`, `items_pedido`, `mesas` | `prepararPagoWompi()`, `crearPedidoWompi()`, `obtenerMesaPorUuid()` |
| `admin.ts` | `perfiles`, `mesas` | `obtenerPerfiles()`, `obtenerMesas()`, `crearPerfil()`, `eliminarPerfil()`, `crearMesa()`, `eliminarMesa()`, `obtenerStatsAdmin()` |
| `platos.ts` | `platos` | `obtenerPlatosDisponibles()`, `obtenerPlatoPorId()` |
| `imagenes.ts` | imágenes (Cloudinary) | `subirImagenPlato()` |
| `auth.ts` | sesión | `cerrarSesion()` |

### Características comunes de cada repositorio

Todos los archivos de acciones comparten el mismo contrato:

1. **`"use server"`** — directiva de Next.js que marca el archivo como Server Actions
2. **`crearCliente()`** — obtiene el cliente Supabase SSR con cookies de la petición
3. **Operaciones CRUD** — usan el cliente JS de Supabase (`@supabase/supabase-js`), no Drizzle
4. **RLS automático** — Supabase aplica Row Level Security en cada query
5. **Validaciones server-side** — cada repositorio valida datos antes de escribir
6. **`revalidatePath()`** — invalida la caché de Next.js tras mutaciones
7. **Manejo de errores** — retorna `{ exito, error }` o lanza excepciones descriptivas

### Ejemplo: Repositorio de catálogo

**Archivo:** `src/lib/acciones/catalogo.ts`

```typescript
"use server";

export async function crearPlato(datos: { nombre, precio, tipoPlato, ... }) {
  // 1. Validación server-side
  if (!datos.nombre?.trim()) throw new Error("El nombre del plato es requerido");
  if (datos.precio <= 0) throw new Error("El precio debe ser mayor a 0");

  // 2. Acceso a datos vía Supabase Client (RLS aplicado)
  const supabase = await crearCliente();
  const { data, error } = await supabase.from("platos").insert({...}).select().single();

  // 3. Invalidar caché de Next.js
  revalidatePath("/cocina/platos");
  return data;
}
```

---

## Diagrama de capas

```
┌──────────────────────────────────┐
│  UI (Componentes React)          │  ← Solo renderiza, recibe callbacks
├──────────────────────────────────┤
│  Hooks (useGestionPlatos, etc.)  │  ← Lógica de cliente, orquestación
├──────────────────────────────────┤
│  Repository (Server Actions)     │  ← Acceso a datos encapsulado
│  catalogo.ts | cocina.ts | ...   │
├──────────────────────────────────┤
│  Supabase (PostgreSQL + RLS)     │  ← Persistencia real
└──────────────────────────────────┘
```

Los componentes de UI **nunca** importan Server Actions directamente. Pasan por hooks intermedios, aplicando el principio DIP.

---

## Referencia completa en el código

| Repositorio | Archivo | Líneas | Dependencias |
|---|---|---|---|
| Catálogo | `src/lib/acciones/catalogo.ts` | 179 | Supabase server, MediaFacade |
| Categorías | `src/lib/acciones/categorias.ts` | 58 | Supabase server |
| Cocina | `src/lib/acciones/cocina.ts` | 387 | Supabase server, Strategy |
| Pagos | `src/lib/acciones/pago.ts` | 107 | Supabase server, PagoFacade, NotificacionFacade |
| Admin | `src/lib/acciones/admin.ts` | 281 | Supabase server + admin client |
| Platos públicos | `src/lib/acciones/platos.ts` | 33 | Supabase server |
| Imágenes | `src/lib/acciones/imagenes.ts` | 27 | MediaFacade |
| Auth | `src/lib/acciones/auth.ts` | 10 | Supabase server |

---

## Beneficio clave

Cambiar de Supabase a otra base de datos solo requiere modificar los 8 archivos de repositorio. Los 70+ componentes de UI y los 20 hooks no necesitan saber qué base de datos se usa.
