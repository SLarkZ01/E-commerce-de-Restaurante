# 03 — Estructura de Módulos

Cada módulo del monolito se implementa como un conjunto de archivos dentro de `src/`, siguiendo las convenciones de Next.js App Router y una arquitectura de capas (UI → Hooks → Server Actions → Servicios).

## Mapa de pantallas

| Ruta | Pantalla | ¿Quién entra? | ¿Qué se ve? | ¿Qué puede hacer? |
|---|---|---|---|---|
| `/` | Menú digital | **Cliente anónimo** | Header con logo y enlace Staff. Buscador, filtros por categoría, cards de platos, footer con carrito. Al abrir carrito: pide escanear QR de mesa para comprar | Explorar catálogo, filtrar, buscar, agregar/quitar platos del carrito. Para comprar debe escanear QR → `/mesa/[uuid]` |
| `/login` | Inicio de sesión | **Público** | Formulario email + contraseña, logo | Iniciar sesión con Supabase Auth. Redirige según rol |
| `/mesa/[uuid]` | Menú con mesa | **Cliente anónimo** | Header con nº mesa y botón "Rastrear Pedido", buscador, filtros por categoría, cards de platos, carrito con botón de compra. Modal de confirmación de pago exitoso al completar la compra. | Ver catálogo, filtrar, buscar, agregar/quitar del carrito, confirmar pedido, rastrear estado del pedido en tiempo real ingresando el ID |
| `/cocina` | Panel Kanban | **Cocinero, Admin** | 3 columnas: Pendiente / Preparando / Listo. Cards con nº mesa, **ID del pedido**, tiempo, platos, total. **Tiempo real vía Observer** | Ver pedidos nuevos en tiempo real, cambiar estado (Iniciar → Listo), ir a CRUD de platos |
| `/cocina/platos` | CRUD de platos | **Cocinero, Admin** | Grid de platos con nombre, tipo, precio, estado (activo/inactivo). Botón "Nuevo Plato". Modal con Factory Method | Crear, activar/desactivar, eliminar platos. Subir imagen. Asignar categoría, tipo, ingredientes, precio |
| `/logistica` | Panel de entregas | **Mesero, Admin** | Lista de pedidos en estado "Listo" con nº mesa, **ID del pedido**, tiempo, total. **Tiempo real vía Observer** | Ver pedidos listos, confirmar entrega física (marca "Entregado") |
| `/admin` | Dashboard admin | **Admin** | Sidebar (Inicio, Personal, Mesas, Arianna AI). KPIs de ventas, tabla de últimos pedidos | Ver resumen del día, navegar a secciones de gestión |
| `/admin/personal` | Gestión de personal | **Admin** | Tabla con nombre, email, rol. Botón "+ Agregar Personal". Modal formulario con selector de rol | Crear, eliminar personal. Asignar rol (cocinero/mesero/admin) |
| `/admin/mesas` | Gestión de mesas | **Admin** | Tabla con nº mesa, código QR. Botón "+ Agregar Mesa". Modal QR con vista previa y botón copiar | Crear mesa, ver/generar QR, copiar URL del menú, eliminar mesa |
| `/admin/asistente` | Arianna AI | **Admin** | Chat con IA tipo ChatGPT. Sidebar de conversaciones, streaming de respuestas, historial persistente. Conexión a n8n para consultas sobre el restaurante vía Supabase. | Preguntar sobre ventas, personal, mesas, platos. Recibir respuestas en tiempo real con streaming SSE. |

## Reglas de acceso

- **Público:** `/`, `/login`, `/mesa/[uuid]` — sin autenticación
- **Staff (cualquier rol):** `/cocina`, `/cocina/platos`, `/logistica`, `/admin` — requiere sesión
- **Solo admin:** `/admin/personal`, `/admin/mesas`, `/admin` (dashboard completo)
- **Solo cocinero o admin:** operaciones de escritura en platos (crear, editar, eliminar del catálogo)
- **Solo cocinero o mesero:** cambio de estado de pedidos (validado en `State Pattern`). El admin puede ver los pedidos pero no cambiar su estado.
- **Solo mesero:** marcar pedido como "Entregado" (validado en `State Pattern`)

## Arquitectura de capas

```
┌─────────────────────────────────────────────┐
│  UI (components/)                           │  ← Solo renderiza, recibe callbacks
│  admin/  cliente/  cocina/  logistica/      │
│  staff/  compartidos/  ui/                  │
├─────────────────────────────────────────────┤
│  Hooks (hooks/)                             │  ← Lógica de cliente, sin Server Actions directas
│  useGestionPlatos  usePedidos  usePago      │
│  useRealtime  usePedidosRealtime            │
│  usePlatosRealtime  useMiPedidoRealtime     │
│  useRastrearPedido  useEntregaPedidos       │
│  usePago  useCheckoutWompi                  │
├─────────────────────────────────────────────┤
│  Store (stores/)                            │  ← Estado global cliente (Zustand)
│  cart.ts                                    │
├─────────────────────────────────────────────┤
│  Server Actions (lib/acciones/)             │  ← Lógica de servidor, acceso a BD
│  catalogo.ts  cocina.ts  admin.ts  pago.ts  │
├─────────────────────────────────────────────┤
│  Servicios (lib/servicios/)                 │  ← Patrones de diseño + integraciones
│  realtimeService.ts  platoFactory.ts        │
│  estrategiaDespacho.ts  mediaFacade.ts      │
│  PagoFacade.ts  NotificacionFacade.ts       │
├─────────────────────────────────────────────┤
│  Datos (Supabase PostgreSQL + RLS)          │  ← Persistencia + Realtime
└─────────────────────────────────────────────┘
```

### Principio DIP aplicado

Los componentes de UI **nunca** importan Server Actions directamente. En su lugar, usan hooks de la capa intermedia. Esto permite:

1. **Testear componentes sin BD**: pasar hooks mockeados
2. **Cambiar la implementación** de una Server Action sin tocar la UI
3. **Reutilizar hooks** entre componentes (ej: `usePedidos` en kanban y logística)

## Mapa de archivos actualizado

```
src/
├── app/                          App Router (páginas y layouts)
│   ├── page.tsx                  Página de inicio: menú público
│   ├── layout.tsx                Layout raíz (fuentes, metadata)
│   ├── login/page.tsx            Autenticación (Supabase Auth)
│   ├── mesa/[uuid]/page.tsx      Módulo Cliente (con mesa asignada)
│   └── (staff)/                  Route group: rutas protegidas
│       ├── layout.tsx            Verifica sesión server-side
│       ├── cocina/
│       │   ├── page.tsx          Panel Kanban (Observer)
│       │   └── platos/page.tsx   CRUD de catálogo (Factory Method)
│       ├── logistica/page.tsx    Panel de entregas (Observer)
│       └── admin/
│           ├── page.tsx          Dashboard
│           ├── asistente/
│           │   └── page.tsx      Arianna AI (chat con IA vía n8n + SSE)
│           ├── personal/page.tsx Gestión de personal
│           └── mesas/page.tsx    Gestión de mesas
│
├── components/
│   ├── ui/                       shadcn/ui (Button, Dialog, Sheet, etc.)
│   ├── cliente/                  Menú, catálogo, carrito, rastreo, pago exitoso
│   ├── cocina/                   Kanban, formulario, tarjetas, gestor categorías
│   ├── logistica/                Lista de entregas, cards, timers, skeletons
│   ├── admin/                    Dashboard, gestión personal, gestión mesas, Arianna AI, gráficos
│   ├── staff/                    Sidebar, header, layout, navegación
│   └── compartidos/              MensajeToast, EstadoVacio, ImageDropzone, DishThumbnails, MesaBadge
│
├── hooks/                        Lógica de cliente (capa intermedia)
│   ├── useGestionPlatos.ts       CRUD platos + imagen (Factory Method)
│   ├── useGestionCategorias.ts   CRUD categorías
│   ├── useGestionAdmin.ts        CRUD personal + mesas
│   ├── useDashboardAdmin.ts      Paginación del dashboard (Admin)
│   ├── usePedidos.ts             Cambio de estado de pedidos (State Pattern)
│   ├── usePago.ts                Crear pedido (DIP)
│   ├── useCheckoutWompi.ts       Flujo completo de pago Wompi
│   ├── useRastrearPedido.ts      Máquina de estados del rastreo (input → validando → rastreando → entregado)
│   ├── usePedidosRealtime.ts     Observer: INSERT + UPDATE pedidos (DIP)
│   ├── usePlatosRealtime.ts      Observer: INSERT + UPDATE + DELETE platos
│   ├── useMiPedidoRealtime.ts    Observer: UPDATE pedido por ID (cliente)
│   ├── useEntregaPedidos.ts      Observer: UPDATE pedidos filtrado (logística)
│   ├── useRealtime.ts            Observer genérico (WebSocket + DIP)
│   ├── useAccionesPlatos.ts      Acciones del catálogo (cliente)
│   ├── useFiltrosPlatos.ts       Filtros y búsqueda del catálogo
│   ├── useQRMesa.ts              Validación de QR de mesa
│   ├── useBloqueoScroll.ts       Control de scroll durante pago
│   ├── useContadorAnimado.ts     Animaciones de contadores numéricos
│   ├── useActiveRoute.ts         Ruta activa (sidebar)
│   ├── useTiempoTranscurrido.ts  Tiempo relativo + urgencia
│   ├── useMensajeTemporal.ts     Mensajes con auto-dismiss
│   ├── useLogin.ts               Flujo de autenticación
│   └── useAsistenteChat.ts        Chat IA: streaming SSE + máquina de estados + historial
│
├── stores/
│   ├── cart.ts                   Zustand: carrito (Singleton)
│   └── asistente.ts              Zustand: conversaciones Arianna AI (persistencia local)
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts             Cliente SSR (Server Actions)
│   │   ├── browser.ts            Cliente navegador (Realtime)
│   │   └── admin.ts              Cliente admin (service role, operaciones privilegedas)
│   ├── db/
│   │   ├── schema.ts             Drizzle schema (solo referencia)
│   │   └── index.ts              Conexión Drizzle (migraciones)
│   ├── acciones/                  Server Actions por dominio
│   │   ├── platos.ts             Lectura pública de platos
│   │   ├── pago.ts               Crear pedido desde carrito
│   │   ├── cocina.ts             State Pattern + Strategy (cambio estado)
│   │   ├── catalogo.ts           CRUD platos (validación server-side)
│   │   ├── categorias.ts         CRUD categorías
│   │   ├── admin.ts              CRUD personal y mesas (validación server-side)
│   │   ├── auth.ts               Cerrar sesión
│   │   ├── imagenes.ts           Subir imagen (MediaFacade)
│   │   ├── pedidoPublico.ts      Consulta pública de pedido por ID (rastreo anónimo)
│   │   └── asistente.ts          Historial de conversaciones de Arianna AI (n8n)
│   ├── servicios/                 Patrones de diseño + integraciones
│   │   ├── realtimeService.ts     Observer: IServicioRealtime + DIP
│   │   ├── platoFactory.ts       Factory Method (3 tipos de plato)
│   │   ├── estrategiaDespacho.ts Strategy (mesa vs para llevar)
│   │   ├── mediaFacade.ts        Facade (Cloudinary) ✅
│   │   ├── PagoFacade.ts           Facade (Wompi) ✅
│   │   └── NotificacionFacade.ts   Facade (Brevo) ✅
│   ├── formato.ts                formatearPrecio() (COP)
│   ├── iniciales.ts              obtenerIniciales()
│   └── utils.ts                  cn() (clsx + tailwind-merge)
│
├── types/
│   └── index.ts                  Interfaces del dominio + tipos compartidos
│
└── proxy.ts                      Auth + protección de rutas
```
