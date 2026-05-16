# 06 — Pruebas de Integración

## Configuración

Las pruebas de integración requieren una instancia de Supabase local o un proyecto de desarrollo separado. Se usa `DATABASE_URL` de desarrollo (nunca producción).

## Casos de prueba por flujo

### Flujo 1: CRUD Plato → Visibilidad Cliente

| ID | Caso | Pasos | Resultado esperado |
|---|---|---|---|
| I-01 | Crear plato y verificar visibilidad | 1. Chef crea plato vía Server Action<br>2. Cliente consulta `GET /mesa/{uuid}` | El plato aparece en el menú del cliente |
| I-02 | Deshabilitar plato | 1. Chef marca `disponible = false`<br>2. Cliente recarga menú | El plato desaparece del menú |
| I-03 | Actualizar precio | 1. Chef cambia precio del plato<br>2. Cliente recarga menú | El cliente ve el nuevo precio |
| I-04 | Observer: cambio en tiempo real | 1. Chef deshabilita plato<br>2. Cliente NO recarga | El plato desaparece sin recargar (Realtime) |

### Flujo 2: Compra → Notificación Cocina

| ID | Caso | Pasos | Resultado esperado |
|---|---|---|---|
| I-05 | Compra completa crea pedido | 1. Cliente paga con PayPal (mock)<br>2. Server Action `crearPedido` se ejecuta | Pedido creado con `estado = pendiente` |
| I-06 | Pedido aparece en panel cocina | 1. Se crea pedido<br>2. Panel cocina tiene suscripción Realtime | Pedido visible en columna "Pendiente" sin recargar |
| I-07 | Items del pedido son correctos | 1. Carrito con 2 platos distintos<br>2. Se crea el pedido | `itemsPedido` tiene 2 registros con `cantidad` y `precioUnitario` correctos |

### Flujo 3: Cambio de estado completo

| ID | Caso | Pasos | Resultado esperado |
|---|---|---|---|
| I-08 | Ciclo completo: Pendiente → Entregado | 1. Cocinero: `pendiente` → `preparando`<br>2. Cocinero: `preparando` → `listo`<br>3. Mesero: `listo` → `entregado` | Pedido en estado `entregado` |
| I-09 | Mesero ve solo platos listos | 1. Varios pedidos en distintos estados<br>2. Mesero consulta panel | Solo aparecen pedidos con `estado = listo` |

### Flujo 4: RLS y seguridad

| ID | Caso | Pasos | Resultado esperado |
|---|---|---|---|
| I-10 | Cliente anónimo no modifica platos | 1. Sin autenticación<br>2. Intentar UPDATE en `platos` | ❌ Error 401/403 (RLS) |
| I-11 | Mesero no modifica platos | 1. Autenticado como `mesero`<br>2. Intentar INSERT en `platos` | ❌ Error 403 (RLS: solo cocinero/admin) |
| I-12 | Admin gestiona personal | 1. Autenticado como `admin`<br>2. Crear usuario con rol `cocinero` | ✅ Usuario creado en `perfiles` |

### Flujo 5: Observer — Realtime

| ID | Caso | Pasos | Resultado esperado |
|---|---|---|---|
| I-13 | useRealtime suscribe correctamente | 1. Montar hook con tabla="pedidos", evento="INSERT" | `IServicioRealtime.suscribir()` llamado con los parámetros correctos |
| I-14 | Filtro se propaga al servicio | 1. Montar hook con `filtro="estado=eq.listo"` | El servicio recibe el filtro en la configuración del canal |
| I-15 | Evento Realtime dispara callback | 1. Hook montado<br>2. Servicio emite payload INSERT | El callback del hook es invocado con el payload |
| I-16 | Cancelación al desmontar | 1. Montar hook<br>2. Desmontar antes de resolver promesa | `cancelar()` es invocado al resolver la promesa |
| I-17 | usePedidosRealtime: INSERT pendiente | 1. Emitir INSERT con estado="pendiente" | `onNuevoPedido` llamado con el pedido + items |
| I-18 | usePedidosRealtime: UPDATE entregado | 1. Emitir UPDATE con estado="entregado" | `onPedidoEntregado` llamado con el ID |
