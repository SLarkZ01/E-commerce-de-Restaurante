export type Rol = "cocinero" | "mesero" | "admin";

export type EstadoPedido = "pendiente" | "preparando" | "listo" | "entregado";

export type TipoPlato = "plato_fuerte" | "bebida" | "combo";

export type TipoDespacho = "mesa" | "para_llevar";

export interface Perfil {
  id: string;
  email: string;
  rol: Rol;
  nombre: string;
  creadoEn: Date;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  creadoEn: Date;
}

export interface Plato {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: string;
  imagenUrl: string | null;
  tipoPlato: TipoPlato;
  categoriaId: string | null;
  disponible: boolean;
  ingredientes: string[] | null;
  creadoPor: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface Mesa {
  id: string;
  codigoQr: string;
  numero: number;
  creadoEn: Date;
}

export interface Pedido {
  id: string;
  mesaId: string | null;
  tipoDespacho: TipoDespacho;
  estado: EstadoPedido;
  correoCliente: string | null;
  total: string;
  paypalPedidoId: string | null;
  cocineroId: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface ItemPedido {
  id: string;
  pedidoId: string;
  platoId: string;
  cantidad: number;
  precioUnitario: string;
}
