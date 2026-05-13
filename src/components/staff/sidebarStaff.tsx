"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  ClipboardList,
  UtensilsCrossed,
  PackageCheck,
  LayoutDashboard,
  Users,
  Armchair,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cerrarSesion } from "@/lib/acciones/auth";

interface SidebarStaffProps {
  userEmail: string;
  mobile?: boolean;
}

const NAV_ITEMS = [
  { href: "/cocina", label: "Pedidos", icon: ClipboardList },
  { href: "/cocina/platos", label: "Gestión de Menú", icon: UtensilsCrossed },
  { href: "/logistica", label: "Platos Listos", icon: PackageCheck },
];

const ADMIN_ITEMS = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/personal", label: "Personal", icon: Users },
  { href: "/admin/mesas", label: "Mesas", icon: Armchair },
];

export function SidebarStaff({ userEmail, mobile }: SidebarStaffProps) {
  const pathname = usePathname();
  const [adminOpen, setAdminOpen] = useState(true);

  const getIniciales = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const isActive = (href: string) => {
    if (href === "/cocina") {
      return pathname === "/cocina" || pathname === "/cocina/";
    }
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname.startsWith(href);
  };

  const isAdminSection = pathname.startsWith("/admin");

  const sidebarClasses = mobile
    ? "w-full bg-fondo flex flex-col h-full"
    : "w-[240px] bg-fondo border-r border-borde/60 flex flex-col shrink-0 h-dvh sticky top-0";

  return (
    <aside className={sidebarClasses}>
      <div className="p-4">
        <Link href="/cocina" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primario flex items-center justify-center shadow-sm">
            <Flame className="w-5 h-5 text-primario-texto" />
          </div>
          <span className="font-playfair text-lg font-bold text-texto tracking-tight">
            E-Kitchen
          </span>
        </Link>
      </div>

      <Separator className="mb-2" />

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primario/10 text-primario"
                  : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-2">
          <button
            onClick={() => setAdminOpen(!adminOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isAdminSection
                ? "bg-primario/10 text-primario"
                : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Admin</span>
            {adminOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {adminOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-borde/40 pl-3">
              {ADMIN_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? "bg-primario/10 text-primario"
                        : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <Separator className="mb-2" />

      <div className="p-3 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primario/10 text-primario text-xs font-bold">
              {getIniciales(userEmail)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-texto truncate">
              Usuario
            </p>
            <p className="text-[10px] text-texto-terciario truncate">
              {userEmail}
            </p>
          </div>
        </div>

        <form action={cerrarSesion}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-texto-secundario hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
