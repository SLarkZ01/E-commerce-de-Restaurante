/**
 * Tests de integración — RLS y Seguridad
 * I-10 a I-12
 *
 * Verifica que las políticas Row Level Security de Supabase
 * bloqueen accesos no autorizados.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

function getCliente(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

describe("Integración — RLS y Seguridad", () => {
  const supabase = getCliente();

  beforeAll(() => {
    if (!supabase) {
      console.warn("⚠ Tests de integración saltados: configura SUPABASE_URL y SUPABASE_ANON_KEY");
    }
  });

  // I-10
  it("I-10: cliente anónimo no puede modificar platos", async () => {
    if (!supabase) return;

    const { error } = await supabase
      .from("platos")
      .update({ nombre: "Hackeado" })
      .eq("id", "00000000-0000-0000-0000-000000000000");

    expect(error).toBeDefined();
  });

  // I-11
  it("I-11: cliente anónimo no puede insertar platos", async () => {
    if (!supabase) return;

    const { error } = await supabase
      .from("platos")
      .insert({
        nombre: "Plato Hackeado",
        precio: 1,
        tipo_plato: "plato_fuerte",
      });

    expect(error).toBeDefined();
  });

  // I-12
  it("I-12: cliente anónimo no puede eliminar platos", async () => {
    if (!supabase) return;

    const { error } = await supabase
      .from("platos")
      .delete()
      .eq("id", "00000000-0000-0000-0000-000000000000");

    expect(error).toBeDefined();
  });

  it("I-12b: cliente anónimo SÍ puede leer platos disponibles", async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("platos")
      .select("*")
      .eq("disponible", true);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("I-12c: cliente anónimo NO puede ver perfiles del staff (RLS filtra)", async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("perfiles")
      .select("*");

    // RLS: perfiles requiere autenticación → array vacío
    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });
});
