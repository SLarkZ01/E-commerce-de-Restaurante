// Moneda: todos los precios son en COP (peso colombiano), sin centavos.
// Formatear con formatearPrecio() de src/lib/formato.ts

export type Rol = "cocinero" | "mesero" | "admin";

export type EstadoPedido = "pendiente" | "preparando" | "listo" | "entregado";

export type TipoPlato = "plato_fuerte" | "bebida" | "combo";

export type TipoDespacho = "mesa" | "para_llevar";

export interface Perfil {
  id: string;
  email: string;
  rol: Rol;
  nombre: string;
  creado_en: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  creado_en: string;
}

export interface Plato {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  tipo_plato: TipoPlato;
  categoria_id: string | null;
  disponible: boolean;
  ingredientes: string[] | null;
  creado_por: string | null;
  creado_en: string;
  actualizado_en: string;
}

export interface Mesa {
  id: string;
  codigo_qr: string;
  numero: number;
  creado_en: string;
}

export interface Pedido {
  id: string;
  mesa_id: string | null;
  tipo_despacho: TipoDespacho;
  estado: EstadoPedido;
  correo_cliente: string | null;
  total: number;
  paypal_pedido_id: string | null;
  cocinero_id: string | null;
  creado_en: string;
  actualizado_en: string;
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  plato_id: string;
  cantidad: number;
  precio_unitario: number;
}

// --- Tipos de carrito (Zustand) ---

export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number;
  imagenUrl: string | null;
  cantidad: number;
}

// --- Tipos de pedidos con items (cocina) ---

export interface ItemPedidoConPlato {
  plato_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

export interface ItemPedidoConImagen {
  plato_nombre: string;
  plato_imagen_url: string | null;
  plato_tipo: TipoPlato;
  cantidad: number;
  precio_unitario: number;
}

export interface PedidoConItems extends Pedido {
  items: ItemPedidoConPlato[];
}

export interface PedidoConDetalles extends Pedido {
  mesa_numero: number | null;
  items: ItemPedidoConImagen[];
}

export interface StatsCocina {
  pendientes: number;
  preparando: number;
  listos: number;
  tiempoPromedioMin: number;
}

// --- Dashboard admin ---

export interface EstadisticaDashboard {
  ventasTotales: number;
  ventasHoy: number;
  pedidosHoy: number;
  completadosHoy: number;
  pendientes: number;
  preparando: number;
  listos: number;
  promedioPorPedido: number;
}

export interface IngresoPorHora {
  hora: number;
  total: number;
}

export interface IngresoPorDia {
  fecha: string;
  total: number;
  cantidad: number;
}

export interface DistribucionEstado {
  estado: string;
  cantidad: number;
  color: string;
}

export interface PlatoPopular {
  nombre: string;
  cantidad: number;
  total: number;
}

export interface StatsAdmin {
  estadisticas: EstadisticaDashboard;
  ingresosPorHora: IngresoPorHora[];
  ingresosPorDia: IngresoPorDia[];
  distribucionEstado: DistribucionEstado[];
  platosPopulares: PlatoPopular[];
  pedidosRecientes: PedidoConDetalles[];
}

// --- Tipo genérico para resultados de operaciones ---

export interface ResultadoOperacion<T = void> {
  exito: boolean;
  datos?: T;
  error?: string;
}
