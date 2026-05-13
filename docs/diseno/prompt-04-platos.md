# Prompt 04 — CRUD de Platos (Gestión de Catálogo)

## Configuración Open Design

| Parámetro | Valor |
|---|---|
| Skill | `dashboard` |
| Modo | `prototype` |
| Fidelidad | `high-fidelity` |
| Superficie | `web` |
| Plataforma | `tablet` |
| DESIGN.md | `docs/diseno/DESIGN.md` |

## Contexto

El chef gestiona el catálogo desde esta pantalla en la tablet de cocina. Puede ver todos los platos en una tabla, crear nuevos, editar existentes y deshabilitar platos agotados. Los cambios se reflejan instantáneamente en el menú del cliente (Supabase Realtime).

## Dispositivo

Tablet (1024x768 px, landscape). Accedido desde un botón "Gestionar Menú" en el header del panel de cocina.

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ 📋 Gestión de Platos                     [+ Nuevo Plato]        │ ← Header
│   ← Volver a Cocina                                              │    Fondo: #FEFAF6
├──────────────────────────────────────────────────────────────────┤
│ [🔍 Buscar plato...]  [Todos ▾] [Platos Fuertes ▾] [Activos ▾] │ ← Filtros
├──────────────────────────────────────────────────────────────────┤
│ Plato            │ Categoría    │ Precio    │ Estado    │ Acc.  │ ← Tabla
│──────────────────│──────────────│───────────│───────────│───────│    Header sticky
│ 🍝 Pasta Bol.    │ Plato Fuerte │ $ 28.000  │ 🟢 Activo │ ✏️🗑️ │ ← Fila
│ 🥩 Bife Chorizo  │ Plato Fuerte │ $ 42.000  │ 🟢 Activo │ ✏️🗑️ │    Imagen 40x40
│ 🐟 Salmón Glass. │ Plato Fuerte │ $ 38.000  │ 🟢 Activo │ ✏️🗑️ │    Nombre + desc
│ 🥗 Ens. Caprese  │ Plato Fuerte │ $ 22.000  │ 🔴 Inact. │ ✏️🗑️ │    Inactivo: opacidad 0.5
│ 🥤 Limonada      │ Bebida       │ $ 9.000   │ 🟢 Activo │ ✏️🗑️ │
│ 🥭 Jugo Mango    │ Bebida       │ $ 11.000  │ 🟢 Activo │ ✏️🗑️ │
│ 🍱 Combo Pareja  │ Combo        │ $ 62.000  │ 🟢 Activo │ ✏️🗑️ │
└──────────────────────────────────────────────────────────────────┘
```

## Formulario de creación/edición (Dialog o página)

Al hacer clic en [+ Nuevo Plato] o en ✏️, se abre un diálogo modal centrado:

```
┌─────────────────────────────────────────┐
│  🆕 Nuevo Plato                    ✕    │ ← Título del modal
│                                         │
│  Tipo de Plato                          │
│  [Plato Fuerte] [Bebida] [Combo]        │ ← Chips de selección
│                                         │    Activo: bg #C44536, texto blanco
│  ─────────────────────────────────────  │
│                                         │
│  Nombre del plato                       │
│  [___________________________]          │ ← Input (44px altura)
│                                         │
│  Descripción                            │
│  [___________________________]          │ ← Textarea (3 líneas)
│  [___________________________]          │
│  [___________________________]          │
│                                         │
│  Categoría                              │
│  [Seleccionar categoría ▾]             │ ← Select/dropdown
│                                         │
│  Precio (COP)                           │
│  [ $ |_____________ ]                   │ ← Input numérico con prefijo $
│                                         │
│  Ingredientes                           │
│  [Tomate] [Albahaca] [+ Agregar]        │ ← Chips editables
│                                         │
│  Imagen del plato                       │
│  ┌─────────────────────────────────┐   │ ← Zona de drop/upload
│  │   📷  Arrastra una imagen       │   │    200x200px, borde dashed
│  │   o haz clic para subir         │   │    Si hay imagen: previsualización
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│  [Cancelar]        [💾 Guardar Plato]   │ ← Botones de acción
└─────────────────────────────────────────┘
```

## Campos específicos por tipo de plato

**Plato Fuerte:** Ingredientes obligatorios (lista de chips). Mínimo 2 ingredientes.

**Bebida:** Sin ingredientes. Campo adicional "Tamaño" (Personal / Grande, chips de selección).

**Combo:** Sin ingredientes. Campo adicional "Platos incluidos" (multi-select de platos existentes). Campo adicional "Descuento" (porcentaje, 0-50%).

## Confirmación de eliminación

Al hacer clic en 🗑️:

```
┌─────────────────────────────────────┐
│  ⚠️ ¿Eliminar plato?               │
│                                     │
│  ¿Estás seguro de eliminar          │
│  "Pasta a la Boloñesa"?            │
│  Esta acción no se puede deshacer.  │
│                                     │
│      [Cancelar]   [🗑️ Eliminar]    │
└─────────────────────────────────────┘
```

## Estados

**Tabla vacía:** Si no hay platos, mostrar:
```
┌────────────────────────────────────────────┐
│                                            │
│            🍳                              │
│     No hay platos en el catálogo           │
│     Crea tu primer plato para empezar      │
│                                            │
│        [+ Crear Primer Plato]              │
└────────────────────────────────────────────┘
```

**Cargando:** Skeleton de tabla (5 filas con animación pulse).

**Error al guardar:** Toast rojo en la parte superior: "Error al guardar el plato. Verifica los campos."

**Éxito al guardar:** Toast verde: "Plato guardado correctamente." El diálogo se cierra y la tabla se actualiza.

**Plato agotado (toggle):** Switch en la columna "Estado". Al desactivar, el plato se atenúa en la tabla y desaparece del menú cliente.

## Interacciones

- **Chips de tipo de plato:** Solo uno seleccionado a la vez. Al cambiar de tipo, los campos específicos se muestran/ocultan con animación.
- **Subida de imagen:** Click o drag & drop. Vista previa inmediata. La imagen se recorta a 1:1 (cuadrada).
- **Ingredientes:** Escribir y presionar Enter para agregar un chip. Click en X del chip para eliminarlo.
- **Validaciones en tiempo real:** Precio > 0. Nombre no vacío. Ingredientes mínimo 2 (si plato fuerte).

## Reglas de diseño

1. Tokens de `DESIGN.md`
2. La tabla debe ser responsive: en tablet se ven todas las columnas
3. Las imágenes de los platos en la tabla son miniaturas de 40x40px, radio 6px
4. El modal ocupa máximo 600px de ancho, centrado vertical y horizontal
5. Todos los precios en COP, formateados sin centavos
