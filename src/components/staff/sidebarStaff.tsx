"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "./NavLink";
import { SeccionAdmin } from "./SeccionAdmin";
import { PieUsuario } from "./PieUsuario";
import { useActiveRoute } from "./useActiveRoute";
import { NAV_ITEMS, ADMIN_ITEMS } from "./configNavegacion";

interface SidebarStaffProps {
  userEmail: string;
  mobile?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SidebarStaff({
  userEmail,
  mobile,
  collapsed = false,
  onToggle,
}: SidebarStaffProps) {
  const [adminOpen, setAdminOpen] = useState(true);
  const { isActive, isAdminSection } = useActiveRoute();

  if (mobile) {
    return (
      <aside className="w-full bg-fondo flex flex-col h-full">
        <div className="p-5">
          <Link href="/cocina" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primario flex items-center justify-center shadow-sm">
              <Flame className="w-5 h-5 text-primario-texto" />
            </div>
            <span className="font-playfair text-xl font-bold text-texto tracking-tight">
              E-Kitchen
            </span>
          </Link>
        </div>

        <Separator className="mb-3" />

        <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}

          <SeccionAdmin
            items={ADMIN_ITEMS}
            isActive={isActive}
            isAdminSection={isAdminSection}
            abierto={adminOpen}
            onToggle={() => setAdminOpen(!adminOpen)}
          />
        </nav>

        <Separator className="mb-3" />

        <PieUsuario email={userEmail} />
      </aside>
    );
  }

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <aside
      className={`${sidebarWidth} bg-fondo border-r border-borde/60 flex flex-col shrink-0 h-dvh sticky top-0 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-5`}
      >
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

      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            colapsado={collapsed}
          />
        ))}

        <SeccionAdmin
          items={ADMIN_ITEMS}
          isActive={isActive}
          isAdminSection={isAdminSection}
          abierto={adminOpen}
          onToggle={() => setAdminOpen(!adminOpen)}
          colapsado={collapsed}
        />
      </nav>

      <Separator className="mb-3" />

      <PieUsuario
        email={userEmail}
        colapsado={collapsed}
        onToggle={onToggle}
      />
    </aside>
  );
}
