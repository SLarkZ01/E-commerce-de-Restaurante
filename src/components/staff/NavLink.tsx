"use client";

import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ItemNavegacion {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavLinkProps {
  item: ItemNavegacion;
  isActive: boolean;
  colapsado?: boolean;
  onNavigate?: () => void;
}

export function NavLink({ item, isActive, colapsado, onNavigate }: NavLinkProps) {
  const router = useRouter();
  const Icon = item.icon;

  const handleClick = () => {
    onNavigate?.();
    router.push(item.href);
  };

  if (colapsado) {
    return (
      <Tooltip>
        <TooltipTrigger
          onClick={handleClick}
          className={`flex items-center justify-center w-full px-3 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive
              ? "bg-primario/10 text-primario"
              : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
          }`}
        >
          <Icon className="w-5 h-5 shrink-0" />
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-xs">{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? "bg-primario/10 text-primario"
          : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {item.label}
    </button>
  );
}
