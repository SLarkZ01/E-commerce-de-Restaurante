# Prompt 01 — Menú Digital del Cliente

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

El cliente escanea un código QR en su mesa del restaurante y llega a esta pantalla. No necesita registrarse. Debe poder navegar el catálogo, filtrar por categorías y agregar platos a su carrito.

## Dispositivo

Mobile (375x812 px, iPhone 14 base). La pantalla debe llenar el viewport completo.

## Layout

```
┌──────────────────────────┐
│  🍽️ E-Kitchen            │ ← Header sticky (56px)
│  Mesa 5                  │    Fondo: #FEFAF6, sombra suave
│                          │    Logo Izq, número de mesa Der
├──────────────────────────┤
│  [ 🔍 Buscar plato... ]  │ ← Search bar (44px)
│                          │    Borde #E7E0D8, radio 8px
├──────────────────────────┤
│  Platos Fuertes ▾        │ ← Categorías como tabs horizontales
│  Bebidas   Combos        │    Activo: texto #C44536 + underline
│                          │    Inactivo: texto #78716C
│  ─────────────────────── │    Scroll horizontal si no caben
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │ 🍝                   │ │ ← Card de plato
│ │ Pasta a la Boloñesa  │ │    Imagen: 100x100, radio 8px, izq
│ │ Pasta artesanal con  │ │    Título: Playfair Display 600 20px
│ │ salsa de tomate y    │ │    Descripción: Inter 400 14px #78716C
│ │ queso parmesano      │ │    Precio: Inter 600 16px #2D2A26
│ │                      │ │    Botón +: 44x44, #F5F0EB bg
│ │ $ 28.000    [  +  ]  │ │    Padding interno: 12px
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ 🥩                   │ │ ← Card de plato (misma estructura)
│ │ Bife de Chorizo      │ │
│ │ Corte de 300g con    │ │
│ │ papas rústicas       │ │
│ │ $ 42.000    [  +  ]  │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ 🥗                   │ │
│ │ Ensalada Caprese     │ │
│ │ Tomate, mozzarella   │ │
│ │ y albahaca fresca    │ │
│ │ $ 22.000    [  +  ]  │ │
│ └──────────────────────┘ │
│  ... más cards ...       │
├──────────────────────────┤
│ 🛒 3 platos · $ 92.000  │ ← Footer sticky (60px)
│              [ Ver 🛒 ] │    Fondo: blanco, borde superior
└──────────────────────────┘
```

## Datos de ejemplo (platos)

| Categoría | Nombre | Descripción | Precio |
|---|---|---|---|
| Platos Fuertes | Pasta a la Boloñesa | Pasta artesanal con salsa de tomate, carne y queso parmesano | $ 28.000 |
| Platos Fuertes | Bife de Chorizo | Corte de 300g con papas rústicas y chimichurri | $ 42.000 |
| Platos Fuertes | Salmón Glaseado | Salmón con miel y soya, arroz jazmín y vegetales | $ 38.000 |
| Bebidas | Limonada Artesanal | Limonada natural con hierbabuena | $ 9.000 |
| Bebidas | Jugo de Mango | Jugo natural sin azúcar añadida | $ 11.000 |
| Combos | Combo Pareja | 1 Pasta + 1 Bife + 2 Bebidas | $ 62.000 |

## Categorías

- Platos Fuertes (6 items)
- Bebidas (4 items)
- Combos (2 items)

## Estados

**Normal:** Catálogo con todos los platos disponibles. Las cards muestran imagen, nombre, descripción, precio y botón +.

**Plato agotado:** Si `disponible = false`, la card aparece atenuada (opacidad 0.4), sin botón +, con badge "Agotado" en rojo.

**Carrito vacío:** Footer muestra "🛒 0 platos" y el botón "Ver 🛒" deshabilitado.

**Búsqueda activa:** Filtra los platos en tiempo real mientras se escribe. Si no hay resultados, mostrar "No se encontraron platos" centrado.

**Carga inicial:** Skeleton cards (3-4 cards con animación pulse) mientras se cargan los datos.

## Interacciones

- **Tap en botón +:** Animación sutil (escala 1.1 → 1.0). El contador del footer se actualiza.
- **Tap en "Ver 🛒":** Navega a la pantalla del carrito.
- **Scroll:** El header y el footer son sticky. El contenido central hace scroll.
- **Pull to refresh:** (opcional) recarga el catálogo.

## Reglas de diseño

1. Usar los tokens de `DESIGN.md`: colores, tipografías, espaciado, bordes
2. Mobile-first: diseñar primero para 375px, no preocuparse por tablet/desktop
3. La imagen del plato es placeholder (fondo `#F5F0EB` con emoji del plato)
4. Los precios usan formato COP: `$ XX.XXX` (sin centavos)
5. El botón + debe ser lo suficientemente grande para tocar con el pulgar
