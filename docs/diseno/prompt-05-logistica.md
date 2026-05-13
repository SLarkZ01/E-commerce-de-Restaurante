# Prompt 05 — Panel de Logística (Mesero)

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

El mesero usa esta pantalla en una tablet para ver qué pedidos están listos para ser entregados a las mesas. Solo ve pedidos en estado "Listo". Al entregar físicamente el plato, marca el pedido como "Entregado" y desaparece de su panel.

## Dispositivo

Tablet (1024x768 px, landscape). Puede ser la misma tablet que usa el chef pero con otro inicio de sesión, o una tablet separada en el área de meseros.

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ 📦 Platos Listos para Entregar          🔔 2 pendientes         │ ← Header
│                                            👤 Mesero Carlos     │    Notificaciones: badge con count
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 🟢 LISTO PARA ENTREGAR                          Mesa 3       │ │ ← Card de pedido listo
│ │                                              Hace 15 min      │ │    Estado: verde, badge
│ │ ─────────────────────────────────────────────────────────── │ │    Mesa: grande y visible
│ │                                                              │ │    Tiempo: normal si <10min,
│ │ 1x 🐟 Salmón Glaseado                 $ 38.000              │ │             naranja si >10min
│ │ 2x 🍝 Pasta a la Boloñesa            $ 56.000              │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ Total: $ 94.000                                             │ │
│ │                                                              │ │
│ │                                   [✅ Marcar como Entregado] │ │ ← Botón de acción
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 🟢 LISTO PARA ENTREGAR                          Mesa 7       │ │
│ │                                              Hace 5 min       │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │                                                              │ │
│ │ 1x 🥩 Bife de Chorizo                 $ 42.000              │ │
│ │ 1x 🥤 Limonada Artesanal              $ 9.000               │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ Total: $ 51.000                                             │ │
│ │                                                              │ │
│ │                                   [✅ Marcar como Entregado] │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Card de pedido listo (detalle)

- **Badge de estado:** "LISTO PARA ENTREGAR" con fondo verde claro (#DCFCE7), texto verde oscuro (#166534), pill shape
- **Número de mesa:** Grande y visible (Inter 700, 28px), el mesero debe identificarlo rápido
- **Tiempo transcurrido:** En la misma línea que la mesa, alineado a la derecha
- **Lista de platos:** Cada plato en una línea con: cantidad x nombre (izq) y subtotal (der)
- **Separador:** Línea horizontal sutil entre platos y total
- **Total:** Negrita, alineado a la derecha
- **Botón:** Ancho completo, altura 48px, fondo verde (#65A30D), texto blanco

## Estados

**Sin pedidos listos:**
```
┌────────────────────────────────────────────┐
│                                            │
│            ✅                              │
│     No hay platos listos                   │
│     Esperando que cocina termine...        │
│                                            │
└────────────────────────────────────────────┘
```

**Pedido urgente:** Si el pedido lleva más de 15 minutos en "Listo", la card tiene un borde naranja y un badge "⏰ Entregar pronto".

**Confirmación de entrega:** Al hacer clic en "Marcar como Entregado", se muestra un diálogo de confirmación breve:

```
┌─────────────────────────────────────┐
│  ✅ ¿Confirmar entrega?             │
│                                     │
│  Mesa 3 · $ 94.000                 │
│                                     │
│     [Cancelar]   [✅ Confirmar]     │
└─────────────────────────────────────┘
```

**Éxito:** Al confirmar, la card desaparece con animación slide-out hacia la derecha (300ms). Toast verde: "Pedido Mesa 3 entregado."

## Interacciones

- **Tap en card:** Sin acción especial (la información ya es visible).
- **Tap en "Marcar como Entregado":** Abre el diálogo de confirmación.
- **Notificación de nuevo listo:** Cuando un pedido pasa a "Listo", aparece una notificación toast en la esquina superior derecha y la card aparece con animación slide-in desde arriba.
- **Sonido:** Un "ding" sutil cuando aparece un nuevo pedido listo (opcional, configurable).

## Reglas de diseño

1. Tokens de `DESIGN.md`
2. Las cards deben ser fáciles de leer a distancia (tablet en mostrador)
3. El número de mesa debe ser lo más prominente de la card
4. Máximo 2-3 cards visibles sin scroll; si hay más, hacer scroll vertical
5. Los botones de acción deben ser grandes para tocar con dedo (mínimo 48px altura)
