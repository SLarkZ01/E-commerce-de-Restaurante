-- ============================================================
-- Migración 0001: Row Level Security (RLS) + Funciones Auxiliares
-- Políticas exactamente como están en Supabase producción
-- ============================================================

-- ============================================================
-- Funciones auxiliares para RLS (SECURITY DEFINER)
-- ============================================================

-- Verifica si el usuario autenticado es chef o admin
CREATE OR REPLACE FUNCTION public.auth_is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('cocinero', 'admin')
  );
$$;

-- Verifica si el usuario autenticado es admin
CREATE OR REPLACE FUNCTION public.usuario_es_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin'
  );
$$;

-- Retorna el rol del usuario autenticado
CREATE OR REPLACE FUNCTION public.usuario_rol()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT rol::text FROM perfiles WHERE id = auth.uid();
$$;

-- ============================================================
-- Habilitar RLS en todas las tablas
-- ============================================================

ALTER TABLE "perfiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categorias" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "platos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mesas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pedidos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "items_pedido" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- perfiles
-- ============================================================

-- Cada usuario ve su propio perfil; admin ve todos
CREATE POLICY "Usuario puede ver su propio perfil" ON "perfiles"
  FOR SELECT
  TO public
  USING ((auth.uid() = id) OR usuario_es_admin());

-- Solo admin puede gestionar perfiles (INSERT, UPDATE, DELETE)
CREATE POLICY "Admin puede gestionar perfiles" ON "perfiles"
  FOR ALL
  TO public
  USING (usuario_es_admin())
  WITH CHECK (usuario_es_admin());

-- ============================================================
-- categorias
-- ============================================================

-- Lectura pública
CREATE POLICY "Categorias visibles para todos" ON "categorias"
  FOR SELECT
  TO public
  USING (true);

-- Escritura solo chef/admin
CREATE POLICY "Chef y admin pueden crear categorias" ON "categorias"
  FOR INSERT
  TO public
  WITH CHECK (auth_is_staff());

CREATE POLICY "Chef y admin pueden actualizar categorias" ON "categorias"
  FOR UPDATE
  TO public
  USING (auth_is_staff());

CREATE POLICY "Chef y admin pueden eliminar categorias" ON "categorias"
  FOR DELETE
  TO public
  USING (auth_is_staff());

-- ============================================================
-- platos
-- ============================================================

-- Clientes anónimos: solo platos disponibles
CREATE POLICY "Clientes ven platos disponibles" ON "platos"
  FOR SELECT
  TO public
  USING (disponible = true);

-- Staff autenticado (cocinero/admin): ve todos los platos
CREATE POLICY "Staff ve todos los platos" ON "platos"
  FOR SELECT
  TO public
  USING (
    (auth.uid() IS NOT NULL)
    AND (usuario_rol() = ANY (ARRAY['cocinero'::text, 'admin'::text]))
  );

-- Solo chef/admin pueden crear, actualizar o eliminar platos
CREATE POLICY "Chef y admin pueden insertar platos" ON "platos"
  FOR INSERT
  TO public
  WITH CHECK (usuario_rol() = ANY (ARRAY['cocinero'::text, 'admin'::text]));

CREATE POLICY "Chef y admin pueden actualizar platos" ON "platos"
  FOR UPDATE
  TO public
  USING (usuario_rol() = ANY (ARRAY['cocinero'::text, 'admin'::text]));

CREATE POLICY "Chef y admin pueden eliminar platos" ON "platos"
  FOR DELETE
  TO public
  USING (usuario_rol() = ANY (ARRAY['cocinero'::text, 'admin'::text]));

-- ============================================================
-- mesas
-- ============================================================

-- Lectura pública (necesaria para que el cliente vea su mesa vía QR)
CREATE POLICY "Mesas visibles para todos" ON "mesas"
  FOR SELECT
  TO public
  USING (true);

-- Solo admin gestiona mesas
CREATE POLICY "Admin puede gestionar mesas" ON "mesas"
  FOR ALL
  TO public
  USING (
    (auth.uid() IN (SELECT perfiles.id FROM perfiles WHERE (perfiles.rol = 'admin'::rol)))
  );

-- ============================================================
-- pedidos
-- ============================================================

-- Anónimos pueden ver pedidos (para rastreo en tiempo real vía WebSocket)
CREATE POLICY "Anon puede ver pedidos" ON "pedidos"
  FOR SELECT
  TO public
  USING (true);

-- Usuarios autenticados pueden ver pedidos (staff)
CREATE POLICY "Usuarios autenticados pueden ver pedidos" ON "pedidos"
  FOR SELECT
  TO authenticated
  USING (true);

-- Cualquiera puede crear pedidos (clientes anónimos al pagar)
CREATE POLICY "Cualquiera puede crear pedidos" ON "pedidos"
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Solo staff autenticado puede actualizar pedidos (cambiar estado)
CREATE POLICY "Staff puede actualizar pedidos" ON "pedidos"
  FOR UPDATE
  TO public
  USING (
    (auth.uid() IN (SELECT perfiles.id FROM perfiles))
  );

-- ============================================================
-- items_pedido
-- ============================================================

-- Solo staff puede leer items
CREATE POLICY "Staff puede ver items de pedido" ON "items_pedido"
  FOR SELECT
  TO public
  USING (
    (auth.uid() IN (SELECT perfiles.id FROM perfiles))
  );

-- Cualquiera puede crear items (junto con el pedido)
CREATE POLICY "Cualquiera puede crear items de pedido" ON "items_pedido"
  FOR INSERT
  TO public
  WITH CHECK (true);
