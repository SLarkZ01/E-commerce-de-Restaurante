# Prompt 07 — Login del Staff

## Configuración Open Design

| Parámetro | Valor |
|---|---|
| Skill | `web-prototype` |
| Modo | `prototype` |
| Fidelidad | `high-fidelity` |
| Superficie | `web` |
| Plataforma | `mobile` + `tablet` |
| DESIGN.md | `docs/diseno/DESIGN.md` |

## Contexto

El personal del restaurante (cocinero, mesero, administrador) inicia sesión aquí para acceder a sus paneles. Los clientes NUNCA pasan por esta pantalla (ellos son anónimos). El login usa Supabase Auth con email y contraseña.

## Dispositivo

Responsive: mobile (375px) para acceso desde teléfono del staff, y tablet (1024px) para tablets de cocina/logística. Diseñar mobile-first y escalar a tablet.

## Layout

```
┌──────────────────────────┐
│                          │
│                          │
│       🍽️                 │ ← Logo E-Kitchen
│     E-Kitchen            │    Playfair Display 700, 32px
│     Panel de Staff       │    Subtítulo: Inter 400, 14px, #78716C
│                          │
│                          │
│  Correo electrónico      │
│  ┌──────────────────────┐│ ← Input email (44px)
│  │ chef@ekitchen.com    ││    Borde #E7E0D8, radio 8px
│  └──────────────────────┘│    Focus: ring #C44536
│                          │
│  Contraseña              │
│  ┌──────────────────────┐│ ← Input password (44px)
│  │ ••••••••••      👁️  ││    Botón toggle visibilidad
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │   🔐 Iniciar Sesión  ││ ← Botón primario (48px alto)
│  └──────────────────────┘│    Color #C44536, texto blanco
│                          │    Ancho completo
│                          │
│  ───────── o ─────────   │ ← Separador con texto
│                          │
│     ¿Olvidaste tu        │
│     contraseña?          │ ← Link: Inter 14px, #78716C
│                          │    Hover: subrayado
│                          │
│                          │
└──────────────────────────┘
```

## Versión tablet (1024px)

En tablet, el formulario se centra en una card flotante:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    ┌─────────────────────┐                       │
│                    │      🍽️             │                       │ ← Card centrada
│                    │    E-Kitchen         │                       │    500px ancho
│                    │    Panel de Staff    │                       │    Sombra suave
│                    │                     │                       │
│                    │  Correo electrónico │                       │
│                    │  ┌────────────────┐ │                       │
│                    │  │                │ │                       │
│                    │  └────────────────┘ │                       │
│                    │                     │                       │
│                    │  Contraseña         │                       │
│                    │  ┌────────────────┐ │                       │
│                    │  │                │ │                       │
│                    │  └────────────────┘ │                       │
│                    │                     │                       │
│                    │  ┌────────────────┐ │                       │
│                    │  │ 🔐 Iniciar     │ │                       │
│                    │  └────────────────┘ │                       │
│                    │                     │                       │
│                    │  ¿Olvidaste tu      │                       │
│                    │  contraseña?        │                       │
│                    └─────────────────────┘                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

Fondo de la pantalla completa: `#FEFAF6`. La card tiene fondo blanco, radio 16px, sombra `0 4px 24px rgba(45,42,38,0.10)`.

## Recuperación de contraseña

Al hacer clic en "¿Olvidaste tu contraseña?", se reemplaza el formulario:

```
┌──────────────────────────┐
│                          │
│       🔑                 │
│  Recuperar Contraseña    │
│                          │
│  Ingresa tu correo y te  │
│  enviaremos un enlace    │
│  para restablecerla.     │
│                          │
│  Correo electrónico      │
│  ┌──────────────────────┐│
│  │ chef@ekitchen.com    ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │  📧 Enviar Enlace    ││
│  └──────────────────────┘│
│                          │
│       ← Volver al login  │ ← Link para regresar
│                          │
└──────────────────────────┘
```

## Estados

**Error de autenticación:**
Toast o mensaje bajo el formulario: "Correo o contraseña incorrectos." con fondo rojo claro y borde rojo.

**Redirección por rol (post-login):**
Después de iniciar sesión, redirigir según el rol:
- `cocinero` → `/cocina`
- `mesero` → `/logistica`
- `admin` → `/admin`

**Sesión expirada:**
Si el usuario intenta acceder a una ruta protegida sin sesión, es redirigido al login. Mostrar mensaje: "Tu sesión ha expirado. Inicia sesión nuevamente."

**Cargando:**
El botón muestra un spinner y texto "Iniciando sesión...". El botón se deshabilita durante la petición.

**Éxito (recuperación):**
Después de enviar el correo de recuperación: "✅ Te hemos enviado un enlace a tu correo. Revisa tu bandeja de entrada."

## Interacciones

- **Toggle visibilidad contraseña:** Ícono 👁️ dentro del input, a la derecha. Alterna entre mostrar/ocultar.
- **Enter para enviar:** Presionar Enter en cualquier campo envía el formulario.
- **Validación en tiempo real:** Email con formato válido. Contraseña mínimo 6 caracteres.
- **Focus states:** Todos los inputs muestran ring terracota (#C44536) de 2px al recibir foco.

## Reglas de diseño

1. Tokens de `DESIGN.md`
2. No usar modo oscuro (solo claro)
3. Sin enlaces de registro (solo admin crea cuentas)
4. Sin opciones de "Iniciar con Google/GitHub" (solo email/password)
5. El logo debe ser prominente para dar identidad al staff
6. Fuente: Inter para todo el formulario (mejor legibilidad que Playfair Display en inputs)
