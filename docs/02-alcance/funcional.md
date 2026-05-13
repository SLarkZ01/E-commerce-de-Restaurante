# 02 — Alcance Funcional

## Roles del sistema

### Cliente (Guest Checkout)
- Acceso anónimo al menú digital desde la página principal (`/`) o vía código QR (`/mesa/{uuid}`)
- Exploración del catálogo sin necesidad de mesa asignada
- Visualización de platos con nombre, descripción, precio, ingredientes e imagen
- Filtro por categorías (plato fuerte, bebida, combo)
- Carrito de compras local persistente (Zustand + localStorage)
- Para completar la compra debe escanear el QR de su mesa → redirige a `/mesa/{uuid}` (el carrito se mantiene)
- Pago confirmado desde la mesa asignada
- Recepción de comprobante por correo electrónico (Brevo)

### Cocinero (Chef)
- Panel de pedidos en tiempo real (columna por estado)
- Gestión CRUD del catálogo de platos
- Creación de platos con tipo (plato fuerte, bebida, combo)
- Subida de imágenes optimizadas (Cloudinary)
- Cambio de estado: Pendiente → Preparando → Listo
- Los cambios en el catálogo se reflejan instantáneamente en el menú del cliente

### Mesero
- Panel de platos listos para entrega
- Visualización del número de mesa asociado al pedido
- Confirmación de entrega física (estado: Entregado)
- Cierre del ciclo del pedido

### Administrador
- Gestión de personal (crear/editar/eliminar cocineros y meseros)
- Asignación de roles (cocinero, mesero, admin)
- Generación de códigos QR únicos (UUID) vinculados a mesas físicas
- Auditoría de ventas y pedidos
