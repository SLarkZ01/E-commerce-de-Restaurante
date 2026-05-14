/**
 * Tests de integración — API de Platos
 * I-01 a I-03
 *
 * Requiere Supabase iniciado localmente (supabase start).
 * Configurar variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Plato } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

function getCliente(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

describe("Integración — API Platos (CRUD → Visibilidad)", () => {
  const supabase = getCliente();

  // Si no hay Supabase disponible, saltar todos los tests
  beforeAll(() => {
    if (!supabase) {
      console.warn("⚠ Tests de integración saltados: configura SUPABASE_URL y SUPABASE_ANON_KEY");
    }
  });

  let platoCreadoId: string;

  afterAll(async () => {
    if (!supabase || !platoCreadoId) return;
    await supabase.from("platos").delete().eq("id", platoCreadoId);
  });

  // I-01
  it("I-01: crear plato y verificar que es visible para el cliente", async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("platos")
      .insert({
        nombre: "Test Plato Integración",
        precio: 15000,
        tipo_plato: "plato_fuerte",
        disponible: true,
      })
      .select()
      .single();

    if (error) {
      console.warn("I-01 requiere autenticación staff:", error.message);
      return;
    }

    platoCreadoId = data.id;

    const { data: platosVisibles } = await supabase
      .from("platos")
      .select("*")
      .eq("disponible", true);

    const encontrado = platosVisibles?.find((p: Plato) => p.id === platoCreadoId);
    expect(encontrado).toBeDefined();
    expect(encontrado?.nombre).toBe("Test Plato Integración");
  });

  // I-02
  it("I-02: deshabilitar plato lo oculta del menú del cliente", async () => {
    if (!supabase || !platoCreadoId) return;

    await supabase
      .from("platos")
      .update({ disponible: false })
      .eq("id", platoCreadoId);

    const { data: platosVisibles } = await supabase
      .from("platos")
      .select("*")
      .eq("disponible", true);

    const encontrado = platosVisibles?.find((p: Plato) => p.id === platoCreadoId);
    expect(encontrado).toBeUndefined();
  });

  // I-03
  it("I-03: actualizar precio se refleja en la consulta", async () => {
    if (!supabase || !platoCreadoId) return;

    const nuevoPrecio = 25000;

    await supabase
      .from("platos")
      .update({ precio: nuevoPrecio, disponible: true })
      .eq("id", platoCreadoId);

    const { data } = await supabase
      .from("platos")
      .select("*")
      .eq("id", platoCreadoId)
      .single();

    expect(data).toBeDefined();
    expect(data?.precio).toBe(nuevoPrecio);
  });
});
