"use server";

import { crearCliente } from "@/lib/supabase/server";
import type { Plato, Categoria } from "@/types";

export async function obtenerPlatosDisponibles(): Promise<{
  platos: Plato[];
  categorias: Categoria[];
}> {
  const supabase = await crearCliente();

  const [platosRes, catRes] = await Promise.all([
    supabase.from("platos").select("*").eq("disponible", true),
    supabase.from("categorias").select("*"),
  ]);

  return {
    platos: (platosRes.data ?? []) as Plato[],
    categorias: (catRes.data ?? []) as Categoria[],
  };
}

export async function obtenerPlatoPorId(id: string): Promise<Plato | null> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("platos")
    .select("*")
    .eq("id", id)
    .eq("disponible", true)
    .single();

  return (data as Plato) ?? null;
}
