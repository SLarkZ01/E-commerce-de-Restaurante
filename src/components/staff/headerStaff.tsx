"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarStaff } from "./sidebarStaff";

interface HeaderStaffProps {
  userEmail: string;
}

const TITULOS: Record<string, string> = {
  "/cocina": "Pedidos",
  "/cocina/platos": "Gestión de Menú",
  "/logistica": "Platos Listos",
  "/admin": "Dashboard",
  "/admin/personal": "Gestión de Personal",
  "/admin/mesas": "Gestión de Mesas",
};

export function HeaderStaff({ userEmail }: HeaderStaffProps) {
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
        second: "2-digit",
      })
    : "--:--:--";

  const getIniciales = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const titulo = TITULOS[pathname] ?? "E-Kitchen";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 bg-fondo/95 backdrop-blur-sm border-b border-borde/60">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger className="md:hidden p-2 rounded-lg text-texto-secundario hover:bg-fondo-oscuro hover:text-texto transition-colors" aria-label="Abrir menú">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 gap-0">
            <SidebarStaff userEmail={userEmail} mobile />
          </SheetContent>
        </Sheet>

        <h1 className="font-playfair text-lg font-bold text-texto tracking-tight">
          {titulo}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-fondo-oscuro rounded-lg">
          <span className="text-xs font-mono font-medium text-texto-secundario tabular-nums">
            {horaFormateada}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 cursor-default">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primario/10 text-primario text-xs font-bold">
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
