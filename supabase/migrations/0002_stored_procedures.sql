-- ============================================================
-- Migración 0002: Stored Procedures + Realtime + Extensiones
-- ============================================================

-- ============================================================
-- Stored Procedure: buscar_pedido_por_prefijo
-- Usado por el modal de rastreo del cliente.
-- Permite buscar pedidos por los primeros caracteres del UUID
-- (los 8 caracteres que se muestran en el email/comprobante).
-- ============================================================

CREATE OR REPLACE FUNCTION public.buscar_pedido_por_prefijo(prefijo text)
RETURNS SETOF pedidos
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT * FROM pedidos
  WHERE id::text ILIKE prefijo || '%'
  ORDER BY creado_en DESC
  LIMIT 1;
$$;

-- ============================================================
-- Realtime: Publicación para WebSockets de Supabase
-- ============================================================

-- Las tablas 'platos' y 'pedidos' transmiten cambios en tiempo real.
-- Esto se configura automáticamente en Supabase al añadir tablas
-- a la publicación 'supabase_realtime'. Este SQL es la definición
-- explícita por si se necesita recrear.

-- Nota: Supabase gestiona la publicación 'supabase_realtime' automáticamente.
-- Si necesitas recrearla manualmente:
-- ALTER PUBLICATION supabase_realtime ADD TABLE platos;
-- ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;

-- ============================================================
-- Extensiones requeridas
-- ============================================================

-- pgcrypto: para gen_random_uuid() (generalmente ya habilitada por Supabase)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";
