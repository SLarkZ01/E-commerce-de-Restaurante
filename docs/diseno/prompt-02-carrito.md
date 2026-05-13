# Prompt 02 — Carrito de Compras

## Configuración Open Design

| Parámetro | Valor |
|---|---|
| Skill | `web-prototype` |
| Modo | `prototype` |
| Fidelidad | `high-fidelity` |
| Superficie | `web` |
| Plataforma | `mobile` |
| DESIGN.md | `docs/diseno/DESIGN.md` |

## Contexto

El cliente ya agregó platos desde el menú. Esta pantalla muestra el carrito completo con cantidades editables, subtotal, y el botón de pago con PayPal. También debe permitir seguir comprando (volver al menú).

## Dispositivo

Mobile (375x812 px). Esta pantalla puede ser una página completa o un sheet/drawer que se desliza desde abajo.

## Layout (página completa)

```
┌──────────────────────────┐
│  ← Volver    Mi Pedido   │ ← Header (56px)
│                          │    Botón volver: ícono ←, sin borde
├──────────────────────────┤
│ Mesa 5 · Para servir aquí│ ← Info de mesa (fondo #F5F0EB, pill)
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │ 🍝 Pasta Boloñesa    │ │ ← Item del carrito
│ │ $ 28.000             │ │    Imagen: 48x48, radio 6px
│ │  [-]  2  [+]  🗑️   │ │    Controles: botones - y + de 32px
│ └──────────────────────┘ │    Botón eliminar: ícono trash
│ ┌──────────────────────┐ │    Swipe left para eliminar (opcional)
│ │ 🥩 Bife de Chorizo   │ │
│ │ $ 42.000             │ │
│ │  [-]  1  [+]  🗑️   │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ 🥤 Limonada Artesanal│ │
│ │ $ 9.000              │ │
│ │  [-]  1  [+]  🗑️   │ │
│ └──────────────────────┘ │
│                          │
│  [ + Agregar más platos ]│ ← Botón outline para volver al menú
│                          │
├──────────────────────────┤
│ Subtotal      $ 79.000   │ ← Resumen de compra
│ Propina (10%)  $ 7.900   │    Opción de propina: 0%, 10%, 15%
│ ─────────────────────    │    Selector tipo chips/pills
│ Total          $ 86.900  │    Total en negrita (Inter 700 18px)
├──────────────────────────┤
│ [     Pagar con 💳      ]│ ← Botón primario grande (56px altura)
│                          │    Color: #C44536, texto blanco
│       o PayPal           │    Icono de PayPal abajo
└──────────────────────────┘
```

## Layout alternativo (sheet/drawer desde abajo)

Si se prefiere un drawer en vez de página completa:

- El drawer ocupa el 85% de la altura de la pantalla
- Se desliza desde abajo con animación de 300ms ease-out
- La parte superior tiene un handle (barra horizontal de 36px x 4px, gris claro, radio 2px) para indicar que se puede arrastrar
- El fondo detrás del drawer tiene overlay oscuro con opacidad 0.5
- El contenido interno es igual al layout de página completa

## Estados

**Carrito con items:** Layout normal como arriba.

**Carrito vacío:**
```
┌──────────────────────────┐
│                          │
│        🛒                │
│   Tu carrito está vacío  │  ← Ilustración/emoji centrado
│                          │     Texto: Inter 400 16px #78716C
│  [ Explorar el menú ]   │  ← Botón primario
│                          │
└──────────────────────────┘
```

**Cargando pago:** Después de dar clic en pagar, el botón muestra un spinner y texto "Procesando pago...". El botón se deshabilita para evitar doble clic.

**Error de pago:** Toast o banner en la parte superior: "Error al procesar el pago. Intenta de nuevo." con fondo rojo claro.

## Interacciones

- **Botón -:** Reduce cantidad. Si llega a 0, elimina el item con animación slide-out.
- **Botón +:** Aumenta cantidad. Animación sutil.
- **Botón eliminar (🗑️):** Elimina el item. Confirmación opcional con diálogo "¿Eliminar plato?".
- **Propina:** Los chips de propina (0%, 10%, 15%) son toggle. Solo uno activo a la vez. Recalcula el total instantáneamente.
- **Pagar:** Abre el flujo de PayPal. Si es simulación, mostrar un loader y luego pantalla de confirmación.

## Reglas de diseño

1. Tokens de `DESIGN.md`
2. Las cantidades siempre son números enteros positivos
3. Si cantidad = 0, el item desaparece automáticamente
4. El total se recalcula en cada cambio de cantidad o propina
5. El botón de pago debe ser prominente y claro
