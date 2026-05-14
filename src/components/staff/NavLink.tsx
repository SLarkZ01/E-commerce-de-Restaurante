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
}

export function NavLink({ item, isActive, colapsado }: NavLinkProps) {
  const router = useRouter();
  const Icon = item.icon;

  if (colapsado) {
    return (
      <Tooltip>
        <TooltipTrigger
          onClick={() => router.push(item.href)}
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
      onClick={() => router.push(item.href)}
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
