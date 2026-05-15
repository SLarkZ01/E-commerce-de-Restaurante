# 02 — Historias de Usuario

## Cliente (Guest Checkout)

### HU-01: Escanear QR y ver menú
**Como** comensal en una mesa  
**Quiero** escanear un código QR y ver el menú digital del restaurante  
**Para** decidir qué pedir sin necesidad de registrarme

**Criterios de aceptación:**
- El QR redirige a una URL única por mesa (`/mesa/{uuid}`)
- El menú muestra solo platos con `disponible = true`
- Los platos se agrupan por categoría
- No se solicita inicio de sesión

---

### HU-02: Agregar platos al carrito
**Como** comensal  
**Quiero** agregar, quitar y modificar cantidades de platos en mi carrito  
**Para** armar mi pedido antes de pagar

**Criterios de aceptación:**
- El carrito persiste al recargar la página (localStorage)
- Se muestra el total actualizado en tiempo real
- Se puede eliminar un plato individualmente
- Al cambiar de mesa/QR, el carrito se mantiene

---

### HU-03: Pagar con Wompi
**Como** comensal  
**Quiero** pagar mi pedido con Wompi  
**Para** completar la compra sin compartir datos bancarios con el restaurante

**Criterios de aceptación:**
- El botón de Wompi solo se muestra si el carrito no está vacío
- Al completar el pago, el pedido se crea automáticamente en estado "Pendiente"
- Se envía un comprobante al correo de Wompi del cliente
- El carrito se vacía tras el pago exitoso

---

## Cocinero (Chef)

### HU-04: Ver pedidos en tiempo real
**Como** cocinero  
**Quiero** ver los nuevos pedidos en una columna "Pendiente" que se actualiza sola  
**Para** empezar a prepararlos sin que el mesero me avise

**Criterios de aceptación:**
- Los pedidos nuevos aparecen sin necesidad de recargar la página
- Los pedidos se agrupan por estado en columnas (Kanban)
- Se muestra: hora del pedido, mesa, platos solicitados, total

---

### HU-05: Cambiar estado del pedido
**Como** cocinero  
**Quiero** mover un pedido de "Pendiente" a "Preparando", y luego a "Listo"  
**Para** que el sistema notifique al mesero automáticamente

**Criterios de aceptación:**
- Solo se puede pasar a "Preparando" si el estado actual es "Pendiente"
- Solo se puede pasar a "Listo" si el estado actual es "Preparando"
- El cambio de estado se refleja en todos los paneles simultáneamente

---

### HU-06: Gestionar catálogo de platos
**Como** cocinero  
**Quiero** crear, editar y deshabilitar platos del menú  
**Para** mantener el catálogo actualizado según disponibilidad de cocina

**Criterios de aceptación:**
- Crear plato: nombre, descripción, precio, tipo, categoría, ingredientes, imagen
- La imagen se sube a Cloudinary, se guarda la URL optimizada
- Al deshabilitar un plato (`disponible = false`), desaparece del menú cliente instantáneamente
- Solo cocineros y administradores pueden modificar platos (RLS)

---

## Mesero

### HU-07: Ver platos listos para entregar
**Como** mesero  
**Quiero** ver una lista de pedidos en estado "Listo" con su número de mesa  
**Para** entregarlos físicamente al cliente sin tener que preguntar en cocina

**Criterios de aceptación:**
- Solo se muestran pedidos en estado "Listo"
- Se indica el número de mesa y los platos del pedido
- La lista se actualiza en tiempo real

---

### HU-08: Confirmar entrega
**Como** mesero  
**Quiero** marcar un pedido como "Entregado"  
**Para** cerrar el ciclo del pedido y liberar la mesa

**Criterios de aceptación:**
- Solo meseros pueden cambiar el estado a "Entregado"
- El pedido pasa a histórico y desaparece de los paneles activos
- La mesa queda libre para nuevos pedidos

---

## Administrador

### HU-09: Gestionar personal
**Como** administrador  
**Quiero** crear, editar y deshabilitar cuentas del personal  
**Para** controlar quién tiene acceso a los paneles de cocina y logística

**Criterios de aceptación:**
- Crear usuario con email, nombre y rol (cocinero/mesero/admin)
- Solo administradores pueden gestionar usuarios
- Las cuentas usan Supabase Auth con verificación por email

---

### HU-10: Generar QR para mesas
**Como** administrador  
**Quiero** generar códigos QR únicos para cada mesa física  
**Para** que los comensales puedan acceder al menú desde su mesa

**Criterios de aceptación:**
- Cada mesa tiene un UUID único (`codigo_qr`)
- El QR enlaza a `/mesa/{uuid}`
- Se puede imprimir o descargar el QR generado
