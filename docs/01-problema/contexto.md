# 01 — Descripción del Problema y Contexto

## El problema

En el sector gastronómico, la comunicación entre el salón y la cocina sigue siendo un cuello de botella. El proceso tradicional implica:

1. El mesero toma el pedido en papel o verbalmente
2. Lleva la comanda a cocina
3. La cocina procesa los pedidos en orden de llegada (sin visibilidad de prioridades)
4. El mesero debe preguntar repetidamente si el plato está listo
5. El cliente no tiene visibilidad del estado de su pedido

Esto genera **latencia**, **errores de comunicación** y **mala experiencia** tanto para el cliente como para el personal.

## El contexto

Los restaurantes modernos necesitan:

- **Actualización instantánea del menú:** si un plato se agota, debe desaparecer del menú digital inmediatamente
- **Trazabilidad del pedido:** el cliente quiere saber si su plato está pendiente, preparándose o listo
- **Eficiencia operativa:** los chefs deben ver solo los pedidos relevantes, los meseros solo los platos listos para entregar
- **Baja fricción para el comensal:** sin registros obligatorios, sin descargas de apps

## La solución: E-Kitchen

E-Kitchen es un menú digital interactivo accesible vía **código QR** en cada mesa. El cliente escanea, ve el catálogo en tiempo real, arma su carrito y paga con PayPal. Automáticamente, el pedido aparece en el panel de cocina. Cuando está listo, el mesero recibe una notificación para entregarlo.

Todo esto sin que el cliente necesite crear una cuenta.
