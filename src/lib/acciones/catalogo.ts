"use server";

import { crearCliente } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { MediaFacade } from "@/lib/servicios/mediaFacade";

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
  // Validación server-side
  if (!datos.nombre?.trim()) throw new Error("El nombre del plato es requerido");
  if (datos.precio <= 0) throw new Error("El precio debe ser mayor a 0");
  const tiposValidos = ["plato_fuerte", "bebida", "combo"];
  if (!tiposValidos.includes(datos.tipoPlato)) throw new Error("Tipo de plato inválido");

  const supabase = await crearCliente();

  // Validar que la categoría exista si se proporcionó
  if (datos.categoriaId) {
    const { data: categoria } = await supabase
      .from("categorias")
      .select("id")
      .eq("id", datos.categoriaId)
      .maybeSingle();

    if (!categoria) throw new Error("La categoría seleccionada no existe");
  }

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

  if (datos.imagenUrl !== undefined) {
    const { data: platoActual } = await supabase
      .from("platos")
      .select("imagen_url")
      .eq("id", id)
      .single();

    if (platoActual?.imagen_url && platoActual.imagen_url !== datos.imagenUrl) {
      const oldPublicId = MediaFacade.extraerPublicId(platoActual.imagen_url);
      if (oldPublicId) {
        try {
          const eliminada = await MediaFacade.eliminarImagen(oldPublicId);
          if (!eliminada) {
            console.error(
              `[actualizarPlato] Cloudinary no eliminó la imagen anterior (publicId=${oldPublicId})`
            );
          }
        } catch (err) {
          console.error(
            `[actualizarPlato] Error al eliminar imagen anterior de Cloudinary (publicId=${oldPublicId}):`,
            err
          );
        }
      } else {
        console.error(
          `[actualizarPlato] No se pudo extraer publicId de URL anterior: ${platoActual.imagen_url}`
        );
      }
    }
  }

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
    actualizacion.categoria_id = datos.categoriaId === null ? null : datos.categoriaId;
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

  const { data: plato } = await supabase
    .from("platos")
    .select("imagen_url")
    .eq("id", id)
    .single();

  if (!plato) throw new Error("Plato no encontrado");

  const { count: itemsCount } = await supabase
    .from("items_pedido")
    .select("*", { count: "exact", head: true })
    .eq("plato_id", id);

  if (itemsCount && itemsCount > 0) {
    throw new Error(
      `No se puede eliminar: este plato tiene ${itemsCount} registro(s) en pedidos. Desactívalo en lugar de eliminarlo.`
    );
  }

  if (plato.imagen_url) {
    const publicId = MediaFacade.extraerPublicId(plato.imagen_url);
    if (publicId) {
      try {
        const eliminada = await MediaFacade.eliminarImagen(publicId);
        if (!eliminada) {
          console.error(
            `[eliminarPlato] Cloudinary no eliminó la imagen (publicId=${publicId})`
          );
        }
      } catch (err) {
        console.error(
          `[eliminarPlato] Error al eliminar imagen de Cloudinary (publicId=${publicId}):`,
          err
        );
      }
    } else {
      console.error(
        `[eliminarPlato] No se pudo extraer publicId de URL: ${plato.imagen_url}`
      );
    }
  }

  const { error, count } = await supabase
    .from("platos")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  if (count === 0) throw new Error("No se pudo eliminar: permiso denegado o plato no encontrado");
  revalidatePath("/cocina/platos");
}
