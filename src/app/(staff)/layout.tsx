import { crearCliente } from "@/lib/supabase/server";
import { StaffLayoutClient } from "@/components/staff/layoutClient";
import { redirect } from "next/navigation";

export default async function LayoutStaff({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <StaffLayoutClient userEmail={user.email ?? ""}>
      {children}
    </StaffLayoutClient>
  );
}
