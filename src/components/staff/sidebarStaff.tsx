"use client";

import { useState, useEffect } from "react";
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
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cerrarSesion } from "@/lib/acciones/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarStaffProps {
  userEmail: string;
  mobile?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
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

export function SidebarStaff({
  userEmail,
  mobile,
  collapsed = false,
  onToggle,
}: SidebarStaffProps) {
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
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primario/10 text-primario"
                    : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3">
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isAdminSection
                  ? "bg-primario/10 text-primario"
                  : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-left">Admin</span>
              {adminOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {adminOpen && (
              <div className="ml-5 mt-1.5 space-y-1 border-l-2 border-borde/40 pl-4">
                {ADMIN_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
              </div>
            )}
          </div>
        </nav>

        <Separator className="mb-3" />

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-primario/10 text-primario text-sm font-bold">
                {getIniciales(userEmail)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-texto truncate">
                Usuario
              </p>
              <p className="text-xs text-texto-terciario truncate">
                {userEmail}
              </p>
            </div>
          </div>

          <form action={cerrarSesion}>
            <button
              type="submit"
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-texto-secundario hover:bg-error/10 hover:text-error transition-all"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>
    );
  }

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <aside
      className={`${sidebarWidth} bg-fondo border-r border-borde/60 flex flex-col shrink-0 h-dvh sticky top-0 transition-all duration-300 ease-in-out`}
    >
      <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-5`}>
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
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (collapsed) {
            return (
              <Tooltip key={`tooltip-${item.href}`}>
                <TooltipTrigger
                  className={`flex items-center justify-center w-full px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-primario/10 text-primario"
                      : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
                  }`}
                >
                  <Link href={item.href} className="flex items-center justify-center">
                    <Icon className="w-5 h-5 shrink-0" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primario/10 text-primario"
                  : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-3" key="admin-section">
          {collapsed ? (
            <Tooltip key="admin-tooltip">
              <TooltipTrigger
                className={`w-full flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  isAdminSection
                    ? "bg-primario/10 text-primario"
                    : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
                }`}
              >
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => setAdminOpen(!adminOpen)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setAdminOpen(!adminOpen);
                    }
                  }}
                  className="flex items-center justify-center cursor-pointer"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Admin</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              key="admin-button"
              onClick={() => setAdminOpen(!adminOpen)}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                isAdminSection
                  ? "bg-primario/10 text-primario"
                  : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-left">Admin</span>
              {adminOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}

          {!collapsed && adminOpen && (
            <div className="ml-5 mt-1.5 space-y-1 border-l-2 border-borde/40 pl-4">
              {ADMIN_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
            </div>
          )}
        </div>
      </nav>

      <Separator className="mb-3" />

      <div className={`space-y-3 ${collapsed ? "px-2" : "p-4"}`}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger
              className="w-full flex items-center justify-center p-3 rounded-xl text-texto-secundario hover:bg-fondo-oscuro hover:text-texto transition-all"
            >
              <span
                role="button"
                tabIndex={0}
                onClick={() => onToggle?.()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle?.();
                  }
                }}
                className="flex items-center justify-center cursor-pointer"
              >
                <PanelLeft className="w-5 h-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Expandir</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className="flex items-center gap-3 px-2">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primario/10 text-primario text-sm font-bold">
                  {getIniciales(userEmail)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-texto truncate">
                  Usuario
                </p>
                <p className="text-xs text-texto-terciario truncate">
                  {userEmail}
                </p>
              </div>
            </div>

            <form action={cerrarSesion}>
              <button
                type="submit"
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-texto-secundario hover:bg-error/10 hover:text-error transition-all"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                Cerrar Sesión
              </button>
            </form>

            <button
              onClick={onToggle}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-texto-secundario hover:bg-fondo-oscuro hover:text-texto transition-all"
            >
              <PanelLeftClose className="w-5 h-5 shrink-0" />
              Comprimir
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
