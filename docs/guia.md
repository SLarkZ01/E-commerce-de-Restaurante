# Documento de Arquitectura de Software

**Proyecto: E-Kitchen (E-commerce de Restaurante)**  
*Basado en el Requisito Final de Arquitectura*

**Autor:** Thomas Montoya Magon  
**Fecha:** 11 de mayo de 2026

---

## Tabla de Contenidos

1. [Descripción del Problema y Contexto](#1-descripción-del-problema-y-contexto)
2. [Alcance Funcional](#2-alcance-funcional)
3. [Arquitectura: Monolito Modular + Event-Driven](#3-arquitectura-monolito-modular--event-driven)
4. [Patrones de Diseño Integrados](#4-patrones-de-diseño-integrados)
5. [Stack Tecnológico](#5-stack-tecnológico)
6. [Gestión del Catálogo y Seguridad RLS](#6-gestión-del-catálogo-y-seguridad-rls)
7. [Máquina de Estados y Flujo Real-time](#7-máquina-de-estados-y-flujo-real-time)
8. [Evaluación Arquitectónica](#8-evaluación-arquitectónica)
9. [Riesgos y Validación](#9-riesgos-y-validación)

---

## 1. Descripción del Problema y Contexto

En el sector gastronómico, la eficiencia en la toma de pedidos y la comunicación entre el salón y la cocina es crítica. El proyecto **E-Kitchen** resuelve la latencia en los pedidos mediante un menú digital interactivo que permite al cliente realizar compras directas desde su mesa, integrando la pasarela de pagos con el flujo de trabajo del personal (Chefs y Meseros) en tiempo real, eliminando la fricción de registros obligatorios para el comensal. Además, centraliza la gestión del catálogo, permitiendo que la oferta culinaria se actualice instantáneamente según la disponibilidad de la cocina.

---

## 2. Alcance Funcional

- **Cliente (Guest Checkout):** Acceso anónimo al catálogo dinámico vía QR. Visualización de platos con detalles (precios, ingredientes, imágenes). Gestión de carrito local (Zustand) y pago vía Wompi como validador de identidad y recolector de correo para recibos.

- **Cocina (Multi-Chef):** Panel interactivo para la recepción de pedidos en tiempo real. Gestión integral del catálogo: creación, edición y eliminación de platos (precios, ingredientes, categorías e imágenes optimizadas vía Cloudinary). Los cambios se reflejan instantáneamente en el menú del cliente.

- **Logística (Mesero):** Interfaz móvil para visualizar platos listos y marcar la entrega física al cliente, cerrando el ciclo del pedido.

- **Administración:** Gestión de personal con roles específicos, auditoría de ventas y generación de códigos QR únicos (UUID) vinculados a mesas físicas.

---

## 3. Arquitectura: Monolito Modular + Event-Driven

**Justificación:** Se ha seleccionado esta arquitectura siguiendo las recomendaciones para sistemas de E-commerce. Al utilizar **Supabase** como Event Bus centralizado, se garantiza una arquitectura reactiva: las acciones de los chefs (actualización de menú) y los clientes (pagos) disparan eventos que sincronizan todos los módulos del sistema sin necesidad de recargas manuales.

---

## 4. Patrones de Diseño Integrados

Para garantizar la escalabilidad y mantenibilidad, se han aplicado **10 patrones de diseño** en 4 niveles arquitectónicos. Ver detalle completo en [`docs/04-patrones/indice.md`](04-patrones/indice.md).

**Comportamiento:**
1. **Pub/Sub:** Supabase Realtime como broker de eventos. Desacopla publicadores (DB) de suscriptores (hooks React).
2. **Guard:** Validaciones secuenciales antes de ejecutar acciones críticas (cambio de estado, subida de imágenes).
3. **State Machine (Table-Driven):** Máquina de estados finitos del ciclo de vida del pedido definida como tabla de transiciones.

**Creacional:**
4. **Singleton:** Servicio de Realtime (instancia única global) + Carrito de compras (Zustand con persistencia).
5. **Simple Factory:** Creación parametrizada de validadores según tipo de plato (`crearPlatoFactory(tipo)`).

**Estructural:**
6. **Facade:** Fachadas para Wompi (pagos), Cloudinary (imágenes) y Brevo (emails).
7. **Adapter:** `useRealtime` adapta la API de WebSocket de Supabase al ciclo de vida de React.
8. **Proxy:** `proxy.ts` intercepta requests HTTP, verificando autenticación y roles por ruta.

**Arquitectónico:**
9. **Repository:** 8 Server Actions que encapsulan el acceso a datos por dominio (catálogo, cocina, admin, etc.).
10. **Dependency Injection:** `IServicioRealtime` inyectable en hooks, permitiendo testing con mocks sin base de datos.

---

## 5. Stack Tecnológico

Ver detalle completo de versiones y justificación en [`docs/05-tecnologico/stack.md`](05-tecnologico/stack.md).

| Capa | Tecnología |
|------|-----------|
| Frontend/Backend | Next.js 16 con App Router, Server Actions y Turbopack |
| ORM / Schema | Drizzle ORM (solo schema y migraciones) |
| Cliente DB | Supabase JS Client para todas las queries en runtime |
| Persistencia y Real-time | Supabase (PostgreSQL) para datos y eventos de baja latencia |
| Estado Cliente | Zustand (carrito con persistencia en localStorage) |
| Autenticación | Supabase Auth nativo vía SSR, restringido **únicamente para personal** (Cocinero/Mesero/Admin) mediante roles definidos |
| Testing | Vitest + Testing Library + jsdom |
| Gestión de Assets | Cloudinary (imágenes de platos) |
| Notificaciones | Brevo (email transaccional) |
| Pagos | Wompi (pasarela de pagos) |

---

## 6. Gestión del Catálogo y Seguridad RLS

El Chef tiene control total sobre el menú a través de un CRUD dinámico:

- **Carga de Contenido:** Las imágenes se suben a Cloudinary vía Facade Pattern, guardando solo la URL optimizada en Supabase.

- **Sincronización:** Cada *insert* o *update* en la tabla de platos activa un evento de difusión que actualiza el componente de menú en los dispositivos de los clientes activos.

- **Seguridad:** Se aplican políticas de **Row Level Security (RLS)**: los clientes tienen permiso de "Solo Lectura" en platos activos, mientras que solo usuarios con rol `Chef` o `Admin` pueden modificar registros.

---

## 7. Máquina de Estados y Flujo Real-time

El ciclo de vida del pedido se gestiona bajo una **State Machine table-driven** con guards de validación. Ver detalle completo en [`docs/04-patrones/comportamiento/state-machine.md`](04-patrones/comportamiento/state-machine.md) y [`docs/03-arquitectura/flujos.md`](03-arquitectura/flujos.md).

---

## 8. Evaluación Arquitectónica

- **Mejora frente a soluciones existentes:** La integración directa entre la gestión de inventario del Chef y la vista del Cliente en milisegundos evita la venta de platos agotados y mejora la satisfacción del usuario.

- **Escalabilidad:** La arquitectura basada en eventos (Pub/Sub) y el uso de patrones creacionales (Simple Factory, Singleton) y de comportamiento (Guard, State Machine) permiten añadir nuevos tipos de productos, reglas de validación o sucursales con cambios mínimos en el código base.

---

## 9. Riesgos y Validación

Ver análisis completo de riesgos en [`docs/07-riesgos/analisis.md`](07-riesgos/analisis.md).