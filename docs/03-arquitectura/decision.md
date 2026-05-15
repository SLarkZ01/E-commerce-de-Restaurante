# 03 — Decisión Arquitectónica

## Arquitectura seleccionada

**Monolito Modular + Event-Driven**

## Justificación

Siguiendo las recomendaciones del trabajo académico para sistemas de E-commerce, se eligió esta arquitectura por las siguientes razones:

### ¿Por qué Monolito Modular y no Microservicios?

| Factor | Monolito Modular | Microservicios |
|---|---|---|
| Tamaño del equipo | 1-3 desarrolladores | 5+ desarrolladores |
| Complejidad operativa | Baja (un solo deploy) | Alta (orquestación, service discovery) |
| Latencia interna | Ninguna (llamadas en proceso) | Red entre servicios |
| Costo inicial | Bajo | Alto |
| Escalabilidad futura | Migrable a microservicios por módulo | Nativa |

Para un restaurante con una sola sucursal, los microservicios añadirían complejidad innecesaria. El monolito modular permite separar responsabilidades en módulos independientes dentro del mismo deploy, con la opción de extraer módulos a servicios separados si el negocio crece.

### ¿Por qué Event-Driven?

Supabase actúa como **Event Bus centralizado**. Cada cambio en la base de datos (insert, update) dispara eventos que los clientes suscritos reciben en tiempo real vía WebSockets. Esto elimina la necesidad de:

- Polling (el cliente preguntando "¿ya está listo?" cada N segundos)
- Recargas manuales de página
- Un sistema de colas adicional (RabbitMQ, Kafka)

### Módulos del sistema

El monolito se divide en 4 módulos lógicos:

| Módulo | Responsabilidad | Rutas |
|---|---|---|
| **Menú Cliente** | Catálogo público, carrito, pago Wompi | `/mesa/[uuid]` |
| **Cocina** | CRUD de platos, panel de pedidos, cambio de estado | `/cocina` |
| **Logística** | Panel de entregas, confirmación de entrega | `/logistica` |
| **Administración** | Gestión de personal, QR de mesas, auditoría | `/admin` |

Cada módulo tiene sus propias Server Actions, componentes y acceso a la base de datos, pero comparten el mismo schema de Drizzle ORM y los mismos clientes de Supabase.
