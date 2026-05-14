"use server";

import { crearCliente } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Perfil, Mesa } from "@/types";

export async function obtenerPerfiles(): Promise<Perfil[]> {
  const supabase = await crearCliente();
  const { data } = await supabase.from("perfiles").select("*");
  return (data ?? []) as Perfil[];
}

export async function obtenerMesas(): Promise<Mesa[]> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("mesas")
    .select("*")
    .order("numero", { ascending: true });
  return (data ?? []) as Mesa[];
}

export async function crearPerfil(datos: {
  email: string;
  nombre: string;
  rol: string;
}) {
  // Validación server-side
  if (!datos.nombre?.trim()) throw new Error("El nombre es requerido");
  if (!datos.email?.includes("@")) throw new Error("El email no es válido");
  const rolesValidos = ["cocinero", "mesero", "admin"];
  if (!rolesValidos.includes(datos.rol)) throw new Error("Rol inválido");

  const supabase = await crearCliente();

  const { data, error } = await supabase
    .from("perfiles")
    .insert({
      email: datos.email,
      nombre: datos.nombre,
      rol: datos.rol,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/personal");
  return data;
}

export async function eliminarPerfil(id: string) {
  const supabase = await crearCliente();
  const { error } = await supabase
    .from("perfiles")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/personal");
}

export async function crearMesa(numero: number) {
  const supabase = await crearCliente();

  const { data, error } = await supabase
    .from("mesas")
    .insert({ numero })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/mesas");
  return data;
}

export async function eliminarMesa(id: string) {
  const supabase = await crearCliente();
  const { error } = await supabase.from("mesas").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/mesas");
}
