"use server";

import { crearCliente } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function obtenerCategorias() {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre", { ascending: true });
  return data ?? [];
}

export async function crearCategoria(datos: { nombre: string; slug: string }) {
  const supabase = await crearCliente();

  const { data, error } = await supabase
    .from("categorias")
    .insert({
      nombre: datos.nombre,
      slug: datos.slug.toLowerCase().replace(/\s+/g, "-"),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/cocina/platos");
  return data;
}

export async function actualizarCategoria(
  id: string,
  datos: { nombre?: string; slug?: string }
) {
  const supabase = await crearCliente();

  const actualizacion: Record<string, unknown> = {};
  if (datos.nombre !== undefined) actualizacion.nombre = datos.nombre;
  if (datos.slug !== undefined)
    actualizacion.slug = datos.slug.toLowerCase().replace(/\s+/g, "-");

  const { error } = await supabase
    .from("categorias")
    .update(actualizacion)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/cocina/platos");
}

export async function eliminarCategoria(id: string) {
  const supabase = await crearCliente();
  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/cocina/platos");
}
