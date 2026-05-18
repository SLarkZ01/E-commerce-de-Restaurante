# 04 — Guard

## Concepto

El patrón Guard consiste en una serie de condiciones booleanas (guardias) que deben cumplirse secuencialmente antes de ejecutar una acción. Cada guardia que falla detiene la ejecución y retorna un error. Es una alternativa limpia a los `if/else` anidados profundos.

---

## Aplicación en E-Kitchen

El patrón Guard se aplica en **dos lugares** del código:

### 1. Cambio de estado de pedido

**Archivo:** `src/lib/acciones/cocina.ts:35-94`

Antes de actualizar el estado de un pedido, se ejecutan **5 guardias secuenciales**:

```typescript
export async function cambiarEstadoPedido(pedidoId: string, nuevoEstado: EstadoPedido) {
  const supabase = await crearCliente();
  const { data: { user } } = await supabase.auth.getUser();

  // Guard 1: Usuario autenticado
  if (!user) return { exito: false, error: "No autenticado" };

  // Obtener rol del usuario
  const { data: perfil } = await supabase.from("perfiles").select("rol").eq("id", user.id).single();
  const rolUsuario = perfil?.rol;

  // Guard 2: Rol autorizado (cocinero o mesero)
  if (rolUsuario !== "cocinero" && rolUsuario !== "mesero")
    return { exito: false, error: "No tienes permiso para cambiar el estado" };

  // Obtener pedido actual
  const { data: pedidoActual } = await supabase.from("pedidos").select("*").eq("id", pedidoId).single();

  // Guard 3: Pedido existe
  if (!pedidoActual) return { exito: false, error: "Pedido no encontrado" };

  const estadoActual = pedidoActual.estado;
  const validas = TRANSICIONES_VALIDAS[estadoActual];

  // Guard 4: Transición permitida por la máquina de estados
  if (!validas.includes(nuevoEstado))
    return { exito: false, error: `Transición inválida: ${estadoActual} → ${nuevoEstado}` };

  // Guard 5: Solo mesero puede marcar como entregado
  if (nuevoEstado === "entregado" && rolUsuario !== "mesero")
    return { exito: false, error: "Solo el mesero puede marcar como entregado" };

  // Si todos los guards pasan → ejecutar acción
  await supabase.from("pedidos").update({ estado: nuevoEstado }).eq("id", pedidoId);
  return { exito: true };
}
```

Flujo de guards:

```
Request ──▶ Guard 1: ¿Autenticado? ──▶ Guard 2: ¿Rol válido? ──▶ Guard 3: ¿Pedido existe?
                │                           │                         │
                ❌ Error                    ❌ Error                  ❌ Error
                                                                      │
            Guard 4: ¿Transición válida? ◀────────────────────────────┘
                │
                ❌ Error
                │
            Guard 5: ¿Mesero para entregado? ──▶ ✅ Ejecutar UPDATE
                │
                ❌ Error
```

### 2. Subida de imágenes

**Archivo:** `src/lib/acciones/imagenes.ts:5-19`

Antes de subir una imagen a Cloudinary, se validan **3 guardias**:

```typescript
export async function subirImagenPlato(formData: FormData): Promise<string> {
  const archivo = formData.get("imagen") as File;

  // Guard 1: Archivo no vacío
  if (!archivo || archivo.size === 0)
    throw new Error("No se seleccionó ningún archivo");

  // Guard 2: Tamaño máximo 5MB
  if (archivo.size > 5 * 1024 * 1024)
    throw new Error("La imagen no puede superar los 5MB");

  // Guard 3: Tipo permitido (JPG, PNG, WebP, GIF)
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!tiposPermitidos.includes(archivo.type))
    throw new Error("Solo se permiten imágenes JPG, PNG, WebP o GIF");

  // Si todos los guards pasan → subir a Cloudinary
  const buffer = Buffer.from(await archivo.arrayBuffer());
  const resultado = await MediaFacade.subirImagen(buffer, { folder: "e-kitchen/platos" });
  return resultado.secureUrl;
}
```

---

## Referencia completa en el código

| Componente | Archivo | Guards |
|---|---|---|
| **Cambio de estado** | `src/lib/acciones/cocina.ts:41-82` | 5 guards: auth, rol, existencia, transición, mesero |
| **Subida de imagen** | `src/lib/acciones/imagenes.ts:8-19` | 3 guards: no vacío, tamaño, tipo |
| **Creación de plato** | `src/lib/acciones/catalogo.ts:26-29` | 3 guards: nombre, precio > 0, tipo válido |
| **Creación de perfil** | `src/lib/acciones/admin.ts:42-47` | 3 guards: nombre, email, password ≥ 6 chars |

---

## Beneficio clave

Cada guardia es independiente y auto-contenida. Si se necesita agregar una nueva validación (ej: "no se puede cambiar estado de un pedido con más de 24 horas"), solo se inserta un nuevo Guard en la secuencia, sin modificar los existentes.
