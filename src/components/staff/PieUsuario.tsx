"use client";

import { LogOut, PanelLeft, PanelLeftClose } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cerrarSesion } from "@/lib/acciones/auth";
import { obtenerIniciales } from "@/lib/iniciales";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PieUsuarioProps {
  email: string;
  colapsado?: boolean;
  onToggle?: () => void;
}

export function PieUsuario({ email, colapsado, onToggle }: PieUsuarioProps) {
  if (colapsado) {
    return (
      <div className="space-y-3 px-2">
        <Tooltip>
          <TooltipTrigger
            className="w-full flex items-center justify-center p-3 rounded-xl text-texto-secundario hover:bg-fondo-oscuro hover:text-texto transition-all cursor-pointer"
          >
            <span onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle?.(); } }} className="flex items-center justify-center cursor-pointer">
              <PanelLeft className="w-5 h-5" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs">Expandir</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3 px-2">
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-primario/10 text-primario text-sm font-bold">
            {obtenerIniciales(email)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-texto truncate">Usuario</p>
          <p className="text-xs text-texto-terciario truncate">{email}</p>
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
    </div>
  );
}
