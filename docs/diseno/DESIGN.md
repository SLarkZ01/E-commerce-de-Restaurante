# E-Kitchen Design System

## Identidad

E-Kitchen es un menú digital para restaurantes. La interfaz debe transmitir **calidez, confianza y calidad gastronómica**. Estilo cálido con acentos de terracota, fondo crema y tipografía que evoca cocina artesanal.

## Modos de color

### Modo claro (único)

El proyecto usa solo modo claro. Los paneles de staff (cocina, logística, admin) pueden tener fondo más neutro para largas jornadas.

## Paleta de colores

| Token CSS | Valor HEX | Uso |
|---|---|---|
| `--color-fondo` | `#FEFAF6` | Fondo general (crema cálido) |
| `--color-fondo-card` | `#FFFFFF` | Fondo de tarjetas y paneles |
| `--color-fondo-oscuro` | `#F5F0EB` | Fondo alternativo para secciones |
| `--color-primario` | `#C44536` | Botones principales, links, acentos (terracota) |
| `--color-primario-hover` | `#A8382C` | Hover de botones principales |
| `--color-primario-texto` | `#FFFFFF` | Texto sobre botones primarios |
| `--color-texto` | `#2D2A26` | Texto principal (marrón muy oscuro) |
| `--color-texto-secundario` | `#78716C` | Texto secundario, descripciones (marrón medio) |
| `--color-texto-terciario` | `#A8A29E` | Placeholders, texto inactivo |
| `--color-borde` | `#E7E0D8` | Bordes de cards, inputs, separadores |
| `--color-acento` | `#D4A574` | Badges, chips de categoría (dorado cálido) |
| `--color-exito` | `#65A30D` | Estado "Listo", "Entregado", confirmaciones (verde) |
| `--color-advertencia` | `#F59E0B` | Estado "Preparando" (ámbar) |
| `--color-error` | `#DC2626` | Errores, eliminaciones (rojo) |
| `--color-info` | `#3B82F6` | Estado "Pendiente" (azul suave) |

## Tipografía

| Uso | Familia | Peso | Tamaño (mobile) | Tamaño (tablet) |
|---|---|---|---|---|
| Títulos de plato | Playfair Display | 600 | 20px | 24px |
| Título de sección | Playfair Display | 700 | 24px | 28px |
| Cuerpo | Inter | 400 | 14px | 16px |
| Precio | Inter | 600 | 16px | 18px |
| Badges / etiquetas | Inter | 500 | 11px | 12px |
| Botones | Inter | 500 | 14px | 14px |
| Inputs | Inter | 400 | 14px | 16px |

## Espaciado y layout

| Token | Valor |
|---|---|
| Padding de pantalla mobile | 16px |
| Padding de pantalla tablet | 24px |
| Gap entre cards | 12px mobile, 16px tablet |
| Padding interno de card | 16px |
| Altura mínima de botón | 44px (mobile touch target) |
| Altura de input | 44px |
| Header height | 56px sticky |

## Bordes y sombras

| Token | Valor |
|---|---|
| Radio de card | 12px |
| Radio de botón | 8px |
| Radio de input | 8px |
| Radio de badge | 999px (pill) |
| Sombra de card | `0 2px 8px rgba(45,42,38,0.06)` |
| Sombra de card hover | `0 4px 16px rgba(45,42,38,0.10)` |
| Sombra de header | `0 1px 3px rgba(45,42,38,0.08)` |

## Componentes base (shadcn/ui style)

- **Button:** altura 44px, radio 8px, padding 12px 20px. Variantes: `default` (terracota), `outline` (borde), `ghost` (transparente)
- **Card:** fondo blanco, radio 12px, sombra suave, padding 16px
- **Input:** altura 44px, borde `#E7E0D8`, focus con ring terracota 2px
- **Badge:** pill shape, colores según estado
- **Dialog/Sheet:** overlay con blur, contenido slide desde derecha en mobile

## Breakpoints

| Nombre | Ancho | Dispositivo |
|---|---|---|
| Mobile | 320px - 430px | Teléfono del cliente (QR) |
| Tablet | 768px - 1024px | Tablet del staff (cocina/logística/admin) |
| Desktop | 1280px+ | Monitor de administración |
