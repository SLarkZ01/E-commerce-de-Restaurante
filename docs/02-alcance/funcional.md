# 02 — Alcance Funcional

## Roles del sistema

### Cliente (Guest Checkout)
- Acceso anónimo al menú digital desde la página principal (`/`) o vía código QR (`/mesa/{uuid}`)
- Exploración del catálogo sin necesidad de mesa asignada
- Visualización de platos con nombre, descripción, precio, ingredientes e imagen
- Filtro por tipo de plato (`plato_fuerte`, `bebida`, `combo`) y por categoría (definida por el chef)
- Carrito de compras local persistente (Zustand + localStorage)
- Para completar la compra debe escanear el QR de su mesa → redirige a `/mesa/{uuid}` (el carrito se mantiene)
- Pago confirmado desde la mesa asignada (Wompi ✅ implementado vía `PagoFacade`)
- Recepción de comprobante por correo electrónico (Brevo ✅ implementado vía `NotificacionFacade`)
- **Modal de confirmación de pago exitoso** tras completar la compra, con ID del pedido e instrucciones de rastreo
- **Rastreo del pedido en tiempo real** ingresando el ID (recibido en el correo o en el modal de confirmación) — muestra el progreso pendiente → preparando → listo → entregado vía WebSocket

### Cocinero (Chef)
- Panel de pedidos en tiempo real (columna por estado)
- Gestión CRUD del catálogo de platos y categorías
- Creación de platos con tipo (`plato_fuerte`, `bebida`, `combo`)
- Subida de imágenes (Cloudinary ✅ implementado vía `MediaFacade`)
- Cambio de estado del pedido: Pendiente → Preparando → Listo
- Stats de cocina: contadores por estado y tiempo promedio
- **Visualización del ID del pedido** en cada card del Kanban para trazabilidad
- Los cambios en el catálogo se reflejan instantáneamente en el menú del cliente

### Mesero
- Panel de platos listos para entrega
- Visualización del número de mesa asociado al pedido
- **Visualización del ID del pedido** en cada card de entrega para identificación
- Confirmación de entrega física (estado: Entregado)
- Cierre del ciclo del pedido

### Administrador
- Gestión de personal (crear/editar/eliminar cocineros y meseros)
- Asignación de roles (cocinero, mesero, admin)
- Generación de códigos QR únicos (UUID) vinculados a mesas físicas (✅ implementado con `qrcode`)
- Auditoría de ventas y pedidos
