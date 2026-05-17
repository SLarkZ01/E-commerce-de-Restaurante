"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarStaff } from "./sidebarStaff";
import { obtenerIniciales } from "@/lib/iniciales";
import type { Rol } from "@/types";

interface HeaderStaffProps {
  userEmail: string;
  rol: Rol;
  collapsed: boolean;
  onToggle: () => void;
}

const ETIQUETAS_ROL: Record<Rol, string> = {
  cocinero: "Cocinero",
  mesero: "Mesero",
  admin: "Admin",
};

const SECCIONES: Record<string, { titulo: string; descripcion: string }> = {
  "/cocina": { titulo: "Pedidos", descripcion: "Panel de pedidos en tiempo real" },
  "/cocina/platos": { titulo: "Gestión de Menú", descripcion: "Administra platos y categorías" },
  "/logistica": { titulo: "Platos Listos", descripcion: "Panel de entregas pendientes" },
  "/admin": { titulo: "Dashboard", descripcion: "Vista general del negocio" },
  "/admin/personal": { titulo: "Gestión de Personal", descripcion: "Administra el equipo del restaurante" },
  "/admin/mesas": { titulo: "Gestión de Mesas", descripcion: "Administra mesas y códigos QR" },
};

export function HeaderStaff({ userEmail, rol, collapsed, onToggle }: HeaderStaffProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hora, setHora] = useState(() => new Date());

  useEffect(() => {
    setMounted(true);
    const intervalo = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const horaFormateada = mounted
    ? hora.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  const seccion = SECCIONES[pathname] ?? { titulo: "E-Kitchen", descripcion: "" };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-fondo/95 backdrop-blur-sm border-b border-borde/60">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="hidden md:flex p-2 rounded-lg text-texto-secundario hover:bg-fondo-oscuro hover:text-texto transition-colors"
          aria-label={collapsed ? "Expandir menú" : "Comprimir menú"}
        >
          {collapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        <Sheet>
          <SheetTrigger className="md:hidden p-2 rounded-lg text-texto-secundario hover:bg-fondo-oscuro hover:text-texto transition-colors" aria-label="Abrir menú">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 gap-0">
            <SidebarStaff userEmail={userEmail} rol={rol} mobile />
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="font-playfair text-xl font-bold text-texto tracking-tight">
            {seccion.titulo}
          </h1>
          {seccion.descripcion && (
            <p className="text-sm text-texto-secundario mt-0.5">
              {seccion.descripcion}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-fondo-oscuro text-xs font-medium text-texto-secundario">
          {ETIQUETAS_ROL[rol]}
        </span>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-fondo-oscuro rounded-lg">
          <span className="text-sm font-mono font-medium text-texto-secundario tabular-nums">
            {horaFormateada}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 cursor-default">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primario/10 text-primario text-sm font-bold">
                  {obtenerIniciales(userEmail)}
                </AvatarFallback>
              </Avatar>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">{userEmail}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
