"use server";

import { crearCliente } from "@/lib/supabase/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";
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
  password: string;
  rol: string;
}) {
  if (!datos.nombre?.trim()) throw new Error("El nombre es requerido");
  if (!datos.email?.includes("@")) throw new Error("El email no es válido");
  if (!datos.password || datos.password.length < 6)
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  const rolesValidos = ["cocinero", "mesero", "admin"];
  if (!rolesValidos.includes(datos.rol)) throw new Error("Rol inválido");

  const adminClient = crearClienteAdmin();

  const { data: authUser, error: authError } =
    await adminClient.auth.admin.createUser({
      email: datos.email,
      password: datos.password,
      email_confirm: true,
      user_metadata: { nombre: datos.nombre },
    });

  if (authError) {
    if (authError.message?.includes("already been registered")) {
      throw new Error("Ya existe un usuario con ese correo");
    }
    throw new Error(authError.message);
  }

  if (!authUser?.user?.id) {
    throw new Error("No se pudo crear el usuario de autenticación");
  }

  const supabase = await crearCliente();

  const { data, error } = await supabase
    .from("perfiles")
    .insert({
      id: authUser.user.id,
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
