import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const rolEnum = pgEnum("rol", ["cocinero", "mesero", "admin"]);

export const estadoPedidoEnum = pgEnum("estado_pedido", [
  "pendiente",
  "preparando",
  "listo",
  "entregado",
]);

export const tipoPlatoEnum = pgEnum("tipo_plato", [
  "plato_fuerte",
  "bebida",
  "combo",
]);

export const tipoDespachoEnum = pgEnum("tipo_despacho", ["mesa", "para_llevar"]);

export const perfiles = pgTable("perfiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  rol: rolEnum("rol").notNull().default("mesero"),
  nombre: text("nombre").notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
});

export const categorias = pgTable("categorias", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull().unique(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
});

export const platos = pgTable("platos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  precio: decimal("precio", { precision: 10, scale: 0 }).notNull(),
  imagenUrl: text("imagen_url"),
  tipoPlato: tipoPlatoEnum("tipo_plato").notNull().default("plato_fuerte"),
  categoriaId: uuid("categoria_id").references(() => categorias.id),
  disponible: boolean("disponible").notNull().default(true),
  ingredientes: text("ingredientes").array(),
  creadoPor: uuid("creado_por").references(() => perfiles.id),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export const mesas = pgTable("mesas", {
  id: uuid("id").primaryKey().defaultRandom(),
  codigoQr: uuid("codigo_qr").notNull().unique().defaultRandom(),
  numero: integer("numero").notNull().unique(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
});

export const pedidos = pgTable("pedidos", {
  id: uuid("id").primaryKey().defaultRandom(),
  mesaId: uuid("mesa_id").references(() => mesas.id),
  tipoDespacho: tipoDespachoEnum("tipo_despacho").notNull().default("mesa"),
  estado: estadoPedidoEnum("estado").notNull().default("pendiente"),
  correoCliente: text("correo_cliente"),
  total: decimal("total", { precision: 10, scale: 0 }).notNull(),
  paypalPedidoId: text("paypal_pedido_id"),
  cocineroId: uuid("cocinero_id").references(() => perfiles.id),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export const itemsPedido = pgTable("items_pedido", {
  id: uuid("id").primaryKey().defaultRandom(),
  pedidoId: uuid("pedido_id")
    .references(() => pedidos.id)
    .notNull(),
  platoId: uuid("plato_id")
    .references(() => platos.id)
    .notNull(),
  cantidad: integer("cantidad").notNull().default(1),
  precioUnitario: decimal("precio_unitario", { precision: 10, scale: 0 }).notNull(),
});
