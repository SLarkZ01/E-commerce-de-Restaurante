"use client";

import { ChevronDown, ChevronRight, LayoutDashboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavLink, type ItemNavegacion } from "./NavLink";

interface SeccionAdminProps {
  items: ItemNavegacion[];
  isActive: (href: string) => boolean;
  isAdminSection: boolean;
  abierto: boolean;
  onToggle: () => void;
  colapsado?: boolean;
}

const estiloToggle = (activo: boolean) =>
  `w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all ${
    activo
      ? "bg-primario/10 text-primario"
      : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
  }`;

export function SeccionAdmin({
  items,
  isActive,
  isAdminSection,
  abierto,
  onToggle,
  colapsado,
}: SeccionAdminProps) {
  return (
    <div className="pt-3">
      {colapsado ? (
        <Tooltip>
          <TooltipTrigger
            onClick={onToggle}
            className={`${estiloToggle(isAdminSection)} justify-center cursor-pointer`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs">Admin</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <button
          onClick={onToggle}
          className={`${estiloToggle(isAdminSection)} gap-3.5`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span className="flex-1 text-left">Admin</span>
          {abierto ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}

      {!colapsado && abierto && (
        <div className="ml-5 mt-1.5 space-y-1 border-l-2 border-borde/40 pl-4">
          {items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
