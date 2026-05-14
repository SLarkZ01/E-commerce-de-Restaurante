"use server";

import { crearCliente } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function obtenerTodosPlatos() {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("platos")
    .select("*")
    .order("creado_en", { ascending: false });
  return data ?? [];
}

export async function crearPlato(datos: {
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoPlato: string;
  categoriaId?: string;
  ingredientes?: string[];
  imagenUrl?: string;
}) {
  const supabase = await crearCliente();

  const { data, error } = await supabase
    .from("platos")
    .insert({
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      precio: datos.precio,
      tipo_plato: datos.tipoPlato,
      categoria_id: datos.categoriaId ?? null,
      ingredientes: datos.ingredientes ?? null,
      imagen_url: datos.imagenUrl ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/cocina/platos");
  return data;
}

export async function actualizarPlato(
  id: string,
  datos: {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    disponible?: boolean;
    tipoPlato?: string;
    categoriaId?: string;
    ingredientes?: string[];
    imagenUrl?: string;
  }
) {
  const supabase = await crearCliente();

  const actualizacion: Record<string, unknown> = {
    actualizado_en: new Date().toISOString(),
  };
  if (datos.nombre !== undefined) actualizacion.nombre = datos.nombre;
  if (datos.descripcion !== undefined)
    actualizacion.descripcion = datos.descripcion;
  if (datos.precio !== undefined) actualizacion.precio = datos.precio;
  if (datos.disponible !== undefined)
    actualizacion.disponible = datos.disponible;
  if (datos.tipoPlato !== undefined)
    actualizacion.tipo_plato = datos.tipoPlato;
  if (datos.categoriaId !== undefined)
    actualizacion.categoria_id = datos.categoriaId;
  if (datos.ingredientes !== undefined)
    actualizacion.ingredientes = datos.ingredientes;
  if (datos.imagenUrl !== undefined)
    actualizacion.imagen_url = datos.imagenUrl;

  const { error, count } = await supabase
    .from("platos")
    .update(actualizacion, { count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  if (count === 0) throw new Error("No se pudo actualizar: permiso denegado o plato no encontrado");
  revalidatePath("/cocina/platos");
}

export async function eliminarPlato(id: string) {
  const supabase = await crearCliente();
  const { error, count } = await supabase
    .from("platos")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  if (count === 0) throw new Error("No se pudo eliminar: permiso denegado o plato no encontrado");
  revalidatePath("/cocina/platos");
}
