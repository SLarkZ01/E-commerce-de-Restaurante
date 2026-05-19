# 03 — Diagramas de Flujo

## Flujo 1: Compra del cliente

```mermaid
sequenceDiagram
    actor C as Cliente
    participant QR as Código QR
    participant APP as Next.js /mesa/[uuid]
    participant ZUST as Zustand (carrito)
    participant PP as Wompi SDK
    participant SA as Server Action /pago
    participant DB as Supabase DB
    participant RT as Supabase Realtime
    participant CK as Panel Cocina

    C->>QR: Escanea QR de la mesa
    QR->>APP: GET /mesa/{uuid}
    APP->>DB: SELECT platos WHERE disponible = true
    DB-->>APP: Catálogo de platos
    APP-->>C: Muestra menú digital

    C->>ZUST: Agrega platos al carrito
    ZUST-->>C: Total actualizado

    C->>PP: Clic en "Pagar con Wompi"
    PP-->>C: Ventana de pago
    C->>PP: Completa pago
    PP-->>APP: onApprove (transactionID)

    APP->>SA: crearPedidoWompi(mesaId, items, transactionID)
    SA->>DB: INSERT pedido (estado: pendiente)
    SA->>DB: INSERT items_pedido
    DB-->>SA: Pedido creado
    DB->>RT: Evento: nuevo pedido
    RT-->>CK: Pedido aparece en columna "Pendiente"
    SA-->>APP: Pedido confirmado
    APP->>ZUST: vaciarCarrito()
    APP-->>C: Confirmación + comprobante email
```

## Flujo 2: Ciclo de vida del pedido (State Pattern)

```mermaid
stateDiagram-v2
    [*] --> Pendiente: Webhook Wompi<br/>(crea pedido)
    Pendiente --> Preparando: Chef selecciona pedido<br/>(valida estado actual = Pendiente)
    Preparando --> Listo: Chef termina plato<br/>(notifica al panel Mesero)
    Listo --> Entregado: Mesero confirma entrega<br/>(cierra ciclo, libera mesa)
    Entregado --> [*]
```

Ver reglas completas de transiciones (válidas e inválidas) en [`docs/04-patrones/state.md`](../04-patrones/state.md).

## Flujo 3: Actualización del catálogo (Observer Pattern)

```mermaid
sequenceDiagram
    actor CH as Chef
    participant UI as Panel Cocina /cocina/platos
    participant SA as Server Action
    participant CLD as Cloudinary
    participant DB as Supabase DB
    participant RT as Supabase Realtime
    participant CL as Menú Cliente /mesa/[uuid]

    CH->>UI: Crea/edita plato (con imagen)
    UI->>CLD: Sube imagen
    CLD-->>UI: URL optimizada
    UI->>SA: upsertPlato(datos + imagenUrl)
    SA->>DB: INSERT/UPDATE platos
    DB-->>SA: Plato guardado
    DB->>RT: Evento: cambio en platos
    RT-->>CL: Menú se actualiza sin recargar
    SA-->>UI: Confirmación

## Flujo 4: Seguimiento del pedido del cliente (Observer + Modal)

```mermaid
sequenceDiagram
    actor CL as Cliente
    participant MODAL as RastrearPedidoModal
    participant HOOK as useRastrearPedido
    participant SA as Server Action pedidoPublico
    participant RT as Supabase Realtime
    participant DB as Supabase DB
    participant CK as Chef (Panel Cocina)

    CL->>MODAL: Abre "Rastrear Pedido" desde barra superior
    CL->>MODAL: Ingresa ID del pedido (#66DF8CA2)
    MODAL->>HOOK: manejarBuscar()
    HOOK->>SA: obtenerEstadoPedidoPublico(id)
    SA->>DB: SELECT pedido WHERE id::text ILIKE prefijo
    DB-->>SA: Pedido encontrado (estado actual)
    SA-->>HOOK: Pedido { id, estado }
    HOOK->>RT: useMiPedidoRealtime(id)
    Note right of HOOK: Suscrito a UPDATE con filtro id=eq.{pedidoId}
    HOOK-->>MODAL: Estado "rastreando" + estado actual

    CK->>DB: UPDATE pedido SET estado = 'preparando'
    DB->>RT: Evento: cambio de estado
    RT-->>HOOK: onEstadoCambiado("preparando")
    HOOK-->>MODAL: Actualiza stepper + mensaje dinámico
    MODAL-->>CL: "Tu pedido está en preparación..."

    CK->>DB: UPDATE pedido SET estado = 'listo'
    DB->>RT: Evento: cambio de estado
    RT-->>HOOK: onEstadoCambiado("listo")
    HOOK-->>MODAL: Actualiza stepper + mensaje dinámico
    MODAL-->>CL: "Tu pedido está listo. Pronto te lo entregarán."

    CK->>DB: UPDATE pedido SET estado = 'entregado'
    DB->>RT: Evento: cambio de estado
    RT-->>HOOK: onEstadoCambiado("entregado")
    HOOK-->>MODAL: Estado "entregado"
    MODAL-->>CL: GIF chefsito despidiéndose + "Pedido Entregado"
```

## Flujo 5: Confirmación de pago exitoso (PagoExitoModal)

```mermaid
sequenceDiagram
    actor CL as Cliente
    participant CAR as CarritoContenido
    participant WOM as Wompi Widget
    participant SA as Server Action pago
    participant CTX as PagoExitoProvider
    participant MODAL as PagoExitoModal

    CL->>CAR: Clic en "Pagar con Wompi"
    CAR->>WOM: Abre widget de pago
    CL->>WOM: Completa pago
    WOM-->>CAR: onApprove(transactionID)
    CAR->>SA: crearPedidoWompi(mesaUuid, items, total, transactionID)
    SA-->>CAR: { pedidoId }
    CAR->>CTX: mostrar(pedidoId)
    CTX-->>MODAL: Abre modal con pedidoId
    MODAL-->>CL: "Hemos recibido tu pedido" + ID + "Enviamos recibo a tu correo"
```
```
