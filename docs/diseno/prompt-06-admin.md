# Prompt 06 — Panel de Administración

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

El administrador del restaurante gestiona el personal, las mesas y revisa la auditoría de ventas. Este panel consolida las funciones administrativas que no son del día a día operativo (cocina/logística).

## Dispositivo

Tablet (1024x768 px, landscape) como base, con capacidad de responsive a desktop (1280px+).

## Layout general — Sidebar + Contenido

```
┌──────┬───────────────────────────────────────────────────────────┐
│      │ 📊 Administración E-Kitchen          👤 Admin Principal   │ ← Top bar
│  🏠  ├───────────────────────────────────────────────────────────┤
│      │                                                           │
│  👥  │  CONTENIDO PRINCIPAL                                      │ ← Área de contenido
│ Pers │  (varía según la sección activa en sidebar)               │
│      │                                                           │
│  🪑  │                                                           │
│ Mesas│                                                           │
│      │                                                           │
│  📊  │                                                           │
│ Vent │                                                           │
│      │                                                           │
│  ⚙️  │                                                           │
│ Conf │                                                           │
│      │                                                           │
└──────┴───────────────────────────────────────────────────────────┘
```

## Sidebar

Ancho: 220px. Fondo: `#FEFAF6`. Ítems con ícono + texto.

| Ícono | Sección | Descripción |
|---|---|---|
| 🏠 | Inicio | Dashboard con resumen de ventas del día |
| 👥 | Personal | Gestionar cocineros, meseros, admins |
| 🪑 | Mesas | Gestionar mesas y generar QR |
| 📊 | Ventas | Historial de pedidos y reportes |
| ⚙️ | Config | Ajustes generales |

## Sección 1: Inicio (Dashboard)

```
┌──────────────────────────────────────────────────────────────────┐
│  Resumen del día — 12 de mayo 2026                               │
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │
│ │ 💰 Ventas    │ │ 📋 Pedidos   │ │ 🍽️ Platos   │ │ ⏱️ Prom. │ │ ← KPI Cards
│ │ $ 1,234,000  │ │     23       │ │    popular   │ │  12 min  │ │    4 columnas
│ │ ↑ 12% vs ayer│ │ 3 pendientes │ │ Bife Chorizo │ │  cocina   │ │    Radio 12px
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 📊 Pedidos por hora                                           │ │ ← Gráfico simple
│ │ ████▌                                                        │ │    Barras: 12pm-10pm
│ │ ████████▌                                                    │ │
│ │ ████████████▌▚▚▚▚▚▚                                          │ │
│ │ 12  13  14  15  16  17  18  19  20  21  22                   │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Sección 2: Gestión de Personal

```
┌──────────────────────────────────────────────────────────────────┐
│  👥 Personal del Restaurante           [+ Agregar Personal]     │
├──────────────────────────────────────────────────────────────────┤
│ Nombre             │ Email                │ Rol       │ Acciones │ ← Tabla
│────────────────────│──────────────────────│───────────│──────────│
│ María García       │ maria@ekitchen.com   │ 👩‍🍳 Cocinero│ ✏️ 🗑️   │
│ Carlos López       │ carlos@ekitchen.com  │ 🧑‍💼 Mesero  │ ✏️ 🗑️   │
│ Admin Principal    │ admin@ekitchen.com   │ 👑 Admin   │ ✏️      │ ← Admin no se puede eliminar
└──────────────────────────────────────────────────────────────────┘
```

### Formulario de crear/editar personal (Dialog)

```
┌─────────────────────────────────────────┐
│  🆕 Agregar Personal               ✕    │
│                                         │
│  Nombre completo                        │
│  [___________________________]          │
│                                         │
│  Correo electrónico                     │
│  [___________________________]          │
│                                         │
│  Rol                                   │
│  [👨‍🍳 Cocinero] [🧑‍💼 Mesero] [👑 Admin]│ ← Chips de selección
│                                         │
│  ─────────────────────────────────────  │
│  Al guardar, se enviará un correo       │
│  de invitación para crear contraseña.   │ ← Nota informativa
│  ─────────────────────────────────────  │
│                                         │
│  [Cancelar]        [💾 Guardar]         │
└─────────────────────────────────────────┘
```

## Sección 3: Gestión de Mesas

```
┌──────────────────────────────────────────────────────────────────┐
│  🪑 Mesas del Restaurante              [+ Agregar Mesa]         │
├──────────────────────────────────────────────────────────────────┤
│ # │ Código QR                          │ Creada     │ Acciones  │ ← Tabla
│───│────────────────────────────────────│────────────│───────────│
│ 1 │ 550e8400-e29b-41d4-a716-446655...  │ 12/05/2026 │ 📋 🖨️ 🗑️│ ← 📋=copiar, 🖨️=imprimir
│ 2 │ 660e8400-e29b-41d4-a716-446655...  │ 12/05/2026 │ 📋 🖨️ 🗑️│
│ 3 │ 770e8400-e29b-41d4-a716-446655...  │ 11/05/2026 │ 📋 🖨️ 🗑️│
│ 5 │ 880e8400-e29b-41d4-a716-446655...  │ 10/05/2026 │ 📋 🖨️ 🗑️│
│ ... │ ...                              │ ...        │ ...       │
└──────────────────────────────────────────────────────────────────┘
```

### Vista previa del QR (Dialog)

Al hacer clic en 📋 o al crear una mesa nueva:

```
┌─────────────────────────────────────────┐
│  🪑 Mesa 5                         ✕    │
│                                         │
│     ┌─────────────────────────┐        │ ← QR code grande
│     │                         │        │    centrado, escaneable
│     │     ██████████████      │        │
│     │     ██ ▄▄▄▄▄ ██        │        │
│     │     ██ █ █ █ ██        │        │
│     │     ██ █▀▀▀▀▀ ██       │        │
│     │     ██ ▀▀▀▀▀▀▀ ██      │        │
│     │     ██████████████      │        │
│     │                         │        │
│     └─────────────────────────┘        │
│                                         │
│  URL: /mesa/880e8400-e29b-41d4-...    │ ← URL debajo del QR
│                                         │
│  [📋 Copiar URL]   [🖨️ Imprimir QR]    │
└─────────────────────────────────────────┘
```

## Sección 4: Ventas (Auditoría)

Tabla con todos los pedidos del día/semana/mes, filtrable:

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Historial de Pedidos        [Hoy ▾]  [🔍 Buscar...]        │
├──────────────────────────────────────────────────────────────────┤
│ Hora  │ Mesa │ Platos            │ Total      │ Estado    │     │
│───────│──────│───────────────────│────────────│───────────│     │
│ 14:32 │  5   │ 🍝🍝🥤           │ $ 65.000   │ Entregado │     │
│ 14:15 │  3   │ 🐟🍝🍝🥗🥤       │ $ 146.000  │ Listo     │     │
│ 14:08 │  8   │ 🥩🥩🥗           │ $ 89.000   │ Preparando│     │
│ 13:55 │  2   │ 🥩               │ $ 42.000   │ Entregado │     │
│ 13:42 │  9   │ 🥤               │ $ 11.000   │ Pendiente │     │
│  ...  │ ...  │ ...               │ ...        │ ...       │     │
├────────────────────│───────────────────│────────────│───────────│
│                    │ TOTAL DEL DÍA:    │ $ 1,234,000│           │ ← Footer con total
└────────────────────┴───────────────────┴────────────┴───────────┘
```

## Estados

**Dashboard sin datos:** "Aún no hay actividad hoy. Los pedidos aparecerán aquí cuando los clientes comiencen a ordenar."

**Tabla de personal vacía:** "No hay personal registrado. Agrega al menos un cocinero y un mesero para empezar."

**Tabla de mesas vacía:** "No hay mesas configuradas. Crea mesas y genera códigos QR para que los clientes puedan ordenar."

**Error al eliminar:** Si se intenta eliminar al único admin: "No puedes eliminar al último administrador."

## Interacciones

- **Sidebar:** Navegación entre secciones. Ítem activo resaltado con fondo `#F5F0EB` y borde izquierdo de 3px color `#C44536`.
- **Crear mesa:** Genera automáticamente un UUID para el QR. Muestra el diálogo de vista previa.
- **Imprimir QR:** Abre la vista de impresión del navegador con el QR en tamaño adecuado para pegar en la mesa.
- **Filtros de ventas:** Selector de período (Hoy, Ayer, Esta semana, Este mes) y búsqueda por número de mesa.

## Reglas de diseño

1. Tokens de `DESIGN.md`
2. Sidebar fijo, contenido con scroll
3. Las tablas deben ser compactas pero legibles en tablet
4. Los KPIs del dashboard usan cards con sombra suave
5. Los QR deben ser de tamaño suficiente para imprimir (mínimo 200x200px en pantalla)
6. Los botones de acción en tablas usan variante ghost (solo ícono)
