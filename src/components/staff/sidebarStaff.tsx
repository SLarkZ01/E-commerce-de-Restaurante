"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "./NavLink";
import { PieUsuario } from "./PieUsuario";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { ITEMS_NAVEGACION } from "./configNavegacion";
import type { Rol } from "@/types";

interface SidebarStaffProps {
  userEmail: string;
  userName?: string;
  rol: Rol;
  mobile?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}

export function SidebarStaff({
  userEmail,
  userName,
  rol,
  mobile,
  collapsed = false,
  onToggle,
  onNavigate,
}: SidebarStaffProps) {
  const { isActive } = useActiveRoute();

  const itemsVisibles = ITEMS_NAVEGACION.filter((item) =>
    item.roles.includes(rol)
  );

  const contenido = (
    <>
      <div className={mobile ? "p-5" : `flex items-center ${collapsed ? "justify-center" : "gap-3"} p-5`}>
        <Link href="/cocina" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primario flex items-center justify-center shadow-sm shrink-0">
            <Flame className="w-5 h-5 text-primario-texto" />
          </div>
          {!collapsed && (
            <span className="font-playfair text-xl font-bold text-texto tracking-tight whitespace-nowrap">
              E-Kitchen
            </span>
          )}
        </Link>
      </div>

      <Separator className="mb-3" />

      <nav className={`flex-1 ${mobile ? "px-4 py-3" : "px-3 py-3"} space-y-1.5 overflow-y-auto`}>
        {itemsVisibles.map((item, index) => (
          <div key={item.href}>
            {item.separadorAntes && index > 0 && !collapsed && (
              <div className="my-3 px-3">
                <Separator />
              </div>
            )}
            {item.separadorAntes && index > 0 && collapsed && (
              <div className="my-2 px-2">
                <Separator />
              </div>
            )}
            <NavLink
              item={item}
              isActive={isActive(item.href)}
              colapsado={collapsed}
              onNavigate={onNavigate}
            />
          </div>
        ))}
      </nav>

      <Separator className="mb-3" />

      <PieUsuario
        email={userEmail}
        nombre={userName}
        colapsado={collapsed}
        onToggle={onToggle}
      />
    </>
  );

  if (mobile) {
    return (
      <aside className="w-full bg-fondo flex flex-col h-full">
        {contenido}
      </aside>
    );
  }

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <aside
      className={`${sidebarWidth} bg-fondo border-r border-borde/60 flex flex-col shrink-0 h-dvh sticky top-0 transition-all duration-300 ease-in-out`}
    >
      {contenido}
    </aside>
  );
}
