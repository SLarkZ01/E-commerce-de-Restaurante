import { crearCliente } from "@/lib/supabase/server";
import { SidebarStaff } from "@/components/staff/sidebarStaff";
import { HeaderStaff } from "@/components/staff/headerStaff";
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
    <div className="flex min-h-dvh bg-fondo">
      <div className="hidden md:block">
        <SidebarStaff userEmail={user.email ?? ""} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderStaff userEmail={user.email ?? ""} />
        {children}
      </div>
    </div>
  );
}
