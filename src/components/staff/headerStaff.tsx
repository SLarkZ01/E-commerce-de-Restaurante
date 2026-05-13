"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarStaff } from "./sidebarStaff";

interface HeaderStaffProps {
  userEmail: string;
  collapsed: boolean;
  onToggle: () => void;
}

const SECCIONES: Record<string, { titulo: string; descripcion: string; padre?: string }> = {
  "/cocina": { titulo: "Pedidos", descripcion: "Panel de pedidos en tiempo real" },
  "/cocina/platos": { titulo: "Gestión de Menú", descripcion: "Administra platos y categorías", padre: "Cocina" },
  "/logistica": { titulo: "Platos Listos", descripcion: "Panel de entregas pendientes" },
  "/admin": { titulo: "Dashboard", descripcion: "Vista general del negocio de E-Kitchen" },
  "/admin/personal": { titulo: "Gestión de Personal", descripcion: "Administra el equipo del restaurante", padre: "Admin" },
  "/admin/mesas": { titulo: "Gestión de Mesas", descripcion: "Administra mesas y códigos QR", padre: "Admin" },
};

export function HeaderStaff({ userEmail, collapsed, onToggle }: HeaderStaffProps) {
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

  const getIniciales = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

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
            <SidebarStaff userEmail={userEmail} mobile />
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
                  {getIniciales(userEmail)}
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
