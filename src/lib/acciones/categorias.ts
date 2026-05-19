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

  const slug = datos.slug.toLowerCase().replace(/\s+/g, "-");

  // Validar que el slug no esté duplicado
  const { data: existente } = await supabase
    .from("categorias")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existente) {
    throw new Error(`Ya existe una categoría con el slug "${slug}"`);
  }

  const { data, error } = await supabase
    .from("categorias")
    .insert({
      nombre: datos.nombre,
      slug,
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

  if (datos.slug !== undefined) {
    const slug = datos.slug.toLowerCase().replace(/\s+/g, "-");

    // Validar que el nuevo slug no esté duplicado (excluyendo esta categoría)
    const { data: existente } = await supabase
      .from("categorias")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (existente) {
      throw new Error(`Ya existe una categoría con el slug "${slug}"`);
    }

    actualizacion.slug = slug;
  }

  const { error } = await supabase
    .from("categorias")
    .update(actualizacion)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/cocina/platos");
}

export async function eliminarCategoria(id: string) {
  const supabase = await crearCliente();

  // Verificar si hay platos que referencian esta categoría
  const { count: platosCount } = await supabase
    .from("platos")
    .select("*", { count: "exact", head: true })
    .eq("categoria_id", id);

  if (platosCount && platosCount > 0) {
    throw new Error(
      `No se puede eliminar: esta categoría tiene ${platosCount} plato(s) asociado(s). Reasígnalos primero.`
    );
  }

  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/cocina/platos");
}
