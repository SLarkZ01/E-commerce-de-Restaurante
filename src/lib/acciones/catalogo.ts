"use server";

import { db } from "@/lib/db";
import { platos, categorias } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { crearCliente } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function validarRol(rol: string | null): rol is "cocinero" | "admin" {
  return rol === "cocinero" || rol === "admin";
}

async function verificarPermiso() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const perfil = await db.query.perfiles.findFirst({
    where: eq(perfiles.id, user.id),
  });
  if (!perfil || !validarRol(perfil.rol)) {
    throw new Error("No autorizado: solo cocinero o admin");
  }
  return perfil;
}

import { perfiles } from "@/lib/db/schema";

export async function obtenerTodosPlatos() {
  const data = await db.select().from(platos);
  return data;
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
  const perfil = await verificarPermiso();

  const [nuevo] = await db
    .insert(platos)
    .values({
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      precio: datos.precio.toString(),
      tipoPlato: datos.tipoPlato as "plato_fuerte" | "bebida" | "combo",
      categoriaId: datos.categoriaId ?? null,
      ingredientes: datos.ingredientes ?? null,
      imagenUrl: datos.imagenUrl ?? null,
      creadoPor: perfil.id,
    })
    .returning();

  revalidatePath("/cocina/platos");
  return nuevo;
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
  await verificarPermiso();

  const actualizacion: Record<string, unknown> = {
    actualizadoEn: new Date(),
  };
  if (datos.nombre !== undefined) actualizacion.nombre = datos.nombre;
  if (datos.descripcion !== undefined)
    actualizacion.descripcion = datos.descripcion;
  if (datos.precio !== undefined)
    actualizacion.precio = datos.precio.toString();
  if (datos.disponible !== undefined)
    actualizacion.disponible = datos.disponible;
  if (datos.tipoPlato !== undefined)
    actualizacion.tipoPlato = datos.tipoPlato;
  if (datos.categoriaId !== undefined)
    actualizacion.categoriaId = datos.categoriaId;
  if (datos.ingredientes !== undefined)
    actualizacion.ingredientes = datos.ingredientes;
  if (datos.imagenUrl !== undefined)
    actualizacion.imagenUrl = datos.imagenUrl;

  await db.update(platos).set(actualizacion).where(eq(platos.id, id));
  revalidatePath("/cocina/platos");
}

export async function eliminarPlato(id: string) {
  await verificarPermiso();
  await db.delete(platos).where(eq(platos.id, id));
  revalidatePath("/cocina/platos");
}
