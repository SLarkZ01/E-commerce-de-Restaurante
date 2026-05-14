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

export function SeccionAdmin({
  items,
  isActive,
  isAdminSection,
  abierto,
  onToggle,
  colapsado,
}: SeccionAdminProps) {
  const toggleButton = (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
        isAdminSection
          ? "bg-primario/10 text-primario"
          : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
      }`}
    >
      <LayoutDashboard className="w-5 h-5 shrink-0" />
      {!colapsado && (
        <>
          <span className="flex-1 text-left">Admin</span>
          {abierto ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </>
      )}
    </button>
  );

  return (
    <div className="pt-3">
      {colapsado ? (
        <Tooltip>
          <TooltipTrigger className="w-full flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer">
            {toggleButton}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs">Admin</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        toggleButton
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
