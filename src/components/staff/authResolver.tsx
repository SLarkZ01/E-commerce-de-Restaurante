import { crearCliente } from "@/lib/supabase/server";
import { StaffLayoutClient } from "@/components/staff/layoutClient";
import { redirect } from "next/navigation";
import type { Rol } from "@/types";

export default async function AuthResolver({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, nombre")
    .eq("id", user.id)
    .single();

  const rol = (perfil?.rol as Rol) ?? "mesero";

  return (
    <StaffLayoutClient
      userEmail={user.email ?? ""}
      userName={perfil?.nombre ?? ""}
      rol={rol}
    >
      {children}
    </StaffLayoutClient>
  );
}
