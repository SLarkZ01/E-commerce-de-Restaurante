# Prompt 03 — Panel de Cocina (Kanban de Pedidos)

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

El chef o cocinero ve este panel en una tablet en la cocina. Muestra los pedidos organizados en 3 columnas por estado. Los pedidos nuevos aparecen en tiempo real (Supabase Realtime). El chef arrastra o mueve pedidos entre columnas para cambiar su estado.

## Dispositivo

Tablet (1024x768 px, landscape). Diseñado para verse en una tablet montada en la pared de la cocina o sobre una base.

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔥 E-Kitchen Cocina                    🔔 3 nuevos   👤 Chef M. │ ← Header (56px)
│                                      Última actualización: 14:32 │    Fondo: #FEFAF6
├──────────────────────────────────────────────────────────────────┤
│   PENDIENTE (3)    │   PREPARANDO (2)   │     LISTO (1)         │ ← Columnas Kanban
│                    │                    │                       │    Mismo ancho (33% c/u)
│ ┌────────────────┐ │ ┌────────────────┐ │ ┌───────────────────┐ │
│ │ 🔵 Mesa 5      │ │ │ 🟡 Mesa 8      │ │ │ 🟢 Mesa 3         │ │ ← Card de pedido
│ │ Hace 2 min     │ │ │ Hace 8 min     │ │ │ Hace 15 min       │ │    Color badge:
│ │                │ │ │                │ │ │                   │ │    🔵 Pendiente
│ │ 1x 🍝 Pasta    │ │ │ 2x 🥩 Bife     │ │ │ 1x 🐟 Salmón     │ │    🟡 Preparando
│ │ 1x 🥤 Limonada │ │ │ 1x 🥗 Ensalada │ │ │ 2x 🍝 Pasta      │ │    🟢 Listo
│ │                │ │ │                │ │ │                   │ │
│ │ Total: $37.000 │ │ │ Total: $89.000│ │ │ Total: $82.000   │ │
│ │                │ │ │                │ │ │                   │ │
│ │ [Iniciar ➡️]  │ │ │ [✅ Listo]     │ │ │ Entregar al mesero│ │ ← Botón de acción
│ └────────────────┘ │ └────────────────┘ │ └───────────────────┘ │    según estado
│                    │                    │                       │
│ ┌────────────────┐ │ ┌────────────────┐ │                       │
│ │ 🔵 Mesa 2      │ │ │ 🟡 Mesa 6      │ │                       │
│ │ Hace 5 min     │ │ │ Hace 3 min     │ │                       │
│ │                │ │ │                │ │                       │
│ │ 1x 🥩 Bife     │ │ │ 3x 🍝 Pasta    │ │                       │
│ │                │ │ │                │ │                       │
│ │ Total: $42.000 │ │ │ Total: $84.000│ │                       │
│ │                │ │ │                │ │                       │
│ │ [Iniciar ➡️]  │ │ │ [✅ Listo]     │ │                       │
│ └────────────────┘ │ └────────────────┘ │                       │
│                    │                    │                       │
│ ┌────────────────┐ │                    │                       │
│ │ 🔵 Mesa 9      │ │                    │                       │
│ │ Hace 12 min    │ │                    │                       │
│ │ 1x 🥤 Jugo     │ │                    │                       │
│ │ Total: $11.000 │ │                    │                       │
│ │ [Iniciar ➡️]  │ │                    │                       │
│ └────────────────┘ │                    │                       │
└──────────────────────────────────────────────────────────────────┘
```

## Tarjeta de pedido (detalle)

Cada card debe mostrar:

- **Badge de estado** (arriba izquierda): círculo coloreado + texto. 🔵 Pendiente, 🟡 Preparando, 🟢 Listo.
- **Número de mesa** (arriba derecha): "Mesa 5" en negrita.
- **Tiempo transcurrido:** "Hace 2 min", "Hace 15 min". Si >10 min, el texto se pone en naranja (#F59E0B) para alertar.
- **Lista de platos:** cada plato con cantidad x nombre. Máximo 4 platos visibles; si hay más, mostrar "+2 más" al final.
- **Total:** en COP, negrita.
- **Botón de acción:** según el estado actual:
  - Pendiente → `[Iniciar ➡️]` (fondo terracota)
  - Preparando → `[✅ Listo]` (fondo verde)
  - Listo → sin botón (lo maneja el mesero)

## Columna "Entregado" (oculta por defecto)

No se muestra en el Kanban principal. Los pedidos entregados van a historial. Un botón "Ver historial" en el header abre un modal o página aparte con los pedidos del día.

## Estados

**Sin pedidos pendientes:**
```
┌────────────────────────────────────────────┐
│                                            │
│            🍳                              │
│     No hay pedidos pendientes              │
│     Esperando nuevos pedidos...            │
│                                            │
└────────────────────────────────────────────┘
```
Mostrado en la columna "Pendiente" cuando está vacía.

**Pedido urgente:** Si un pedido lleva más de 20 minutos en "Pendiente", la card tiene un borde rojo pulsante (animación).

**Varios chefs:** Si otro chef ya está preparando un pedido, la card en "Preparando" muestra el nombre del chef: "Preparado por: Chef María".

## Interacciones

- **Tap en [Iniciar ➡️]:** El pedido se mueve de "Pendiente" a "Preparando" con animación slide (300ms). Confirmación opcional.
- **Tap en [✅ Listo]:** El pedido se mueve de "Preparando" a "Listo". Aparece una notificación toast: "Pedido Mesa 5 listo para entregar".
- **Drag & drop:** (opcional, deseable) Arrastrar cards entre columnas para cambiar estado.
- **Tap en card:** Expande detalles completos del pedido (todos los platos, notas, hora exacta).
- **Notificación de nuevo pedido:** Cuando llega un pedido nuevo, suena un "ding" sutil y la card aparece con una animación de slide-in desde arriba.

## Reglas de diseño

1. Tokens de `DESIGN.md`
2. El Kanban debe llenar todo el alto disponible (viewport height menos header)
3. Las columnas hacen scroll vertical independiente si hay muchas cards
4. Los colores de badge son semánticos: azul=pendiente, ámbar=preparando, verde=listo
5. El tiempo transcurrido se actualiza cada 30 segundos
6. Fuente: Inter para todo el panel (legibilidad en tablet)
