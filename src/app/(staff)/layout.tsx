import { crearCliente } from "@/lib/supabase/server";
import { StaffLayoutClient } from "@/components/staff/layoutClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Rol } from "@/types";

export default async function LayoutStaff({
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

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  if (rol === "cocinero" && (pathname.startsWith("/admin") || pathname.startsWith("/logistica"))) {
    redirect("/cocina");
  }
  if (rol === "mesero" && (pathname.startsWith("/admin") || pathname.startsWith("/cocina"))) {
    redirect("/logistica");
  }

  return (
    <StaffLayoutClient
      userEmail={user.email ?? ""}
      rol={rol}
    >
      {children}
    </StaffLayoutClient>
  );
}
