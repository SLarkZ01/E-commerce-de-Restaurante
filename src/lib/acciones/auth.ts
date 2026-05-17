"use server";

import { crearCliente } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function cerrarSesion(): Promise<void> {
  const supabase = await crearCliente();
  await supabase.auth.signOut();
  redirect("/");
}
