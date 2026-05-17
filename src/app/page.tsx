import { crearCliente } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PantallaLogin } from "@/components/auth/PantallaLogin";
import { RUTA_POR_ROL } from "@/lib/redirecciones";
import type { Rol } from "@/types";

export default async function PaginaInicio() {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", user.id)
      .single();

    const destino = RUTA_POR_ROL[(perfil?.rol as Rol) ?? "cocinero"];
    redirect(destino);
  }

  return <PantallaLogin />;
}
