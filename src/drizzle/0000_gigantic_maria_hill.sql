CREATE TYPE "public"."estado_pedido" AS ENUM('pendiente', 'preparando', 'listo', 'entregado');--> statement-breakpoint
CREATE TYPE "public"."rol" AS ENUM('cocinero', 'mesero', 'admin');--> statement-breakpoint
CREATE TYPE "public"."tipo_despacho" AS ENUM('mesa', 'para_llevar');--> statement-breakpoint
CREATE TYPE "public"."tipo_plato" AS ENUM('plato_fuerte', 'bebida', 'combo');--> statement-breakpoint
CREATE TABLE "categorias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"slug" text NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categorias_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "items_pedido" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pedido_id" uuid NOT NULL,
	"plato_id" uuid NOT NULL,
	"cantidad" integer DEFAULT 1 NOT NULL,
	"precio_unitario" numeric(10, 0) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mesas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"codigo_qr" uuid DEFAULT gen_random_uuid() NOT NULL,
	"numero" integer NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mesas_codigo_qr_unique" UNIQUE("codigo_qr"),
	CONSTRAINT "mesas_numero_unique" UNIQUE("numero")
);
--> statement-breakpoint
CREATE TABLE "pedidos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mesa_id" uuid,
	"tipo_despacho" "tipo_despacho" DEFAULT 'mesa' NOT NULL,
	"estado" "estado_pedido" DEFAULT 'pendiente' NOT NULL,
	"correo_cliente" text,
	"total" numeric(10, 0) NOT NULL,
	"wompi_transaccion_id" text,
	"cocinero_id" uuid,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perfiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"rol" "rol" DEFAULT 'mesero' NOT NULL,
	"nombre" text NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "perfiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "platos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text,
	"precio" numeric(10, 0) NOT NULL,
	"imagen_url" text,
	"tipo_plato" "tipo_plato" DEFAULT 'plato_fuerte' NOT NULL,
	"categoria_id" uuid,
	"disponible" boolean DEFAULT true NOT NULL,
	"ingredientes" text[],
	"creado_por" uuid,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_pedido_id_pedidos_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_plato_id_platos_id_fk" FOREIGN KEY ("plato_id") REFERENCES "public"."platos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_mesa_id_mesas_id_fk" FOREIGN KEY ("mesa_id") REFERENCES "public"."mesas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cocinero_id_perfiles_id_fk" FOREIGN KEY ("cocinero_id") REFERENCES "public"."perfiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platos" ADD CONSTRAINT "platos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platos" ADD CONSTRAINT "platos_creado_por_perfiles_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."perfiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_items_pedido_pedido" ON "items_pedido" USING btree ("pedido_id");--> statement-breakpoint
CREATE INDEX "idx_items_pedido_plato" ON "items_pedido" USING btree ("plato_id");--> statement-breakpoint
CREATE INDEX "idx_pedidos_estado" ON "pedidos" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "idx_pedidos_mesa" ON "pedidos" USING btree ("mesa_id");--> statement-breakpoint
CREATE INDEX "idx_pedidos_creado_en" ON "pedidos" USING btree ("creado_en");--> statement-breakpoint
CREATE INDEX "idx_pedidos_cocinero_id" ON "pedidos" USING btree ("cocinero_id");--> statement-breakpoint
CREATE INDEX "idx_platos_categoria" ON "platos" USING btree ("categoria_id");--> statement-breakpoint
CREATE INDEX "idx_platos_disponible" ON "platos" USING btree ("disponible") WHERE "platos"."disponible" = true;