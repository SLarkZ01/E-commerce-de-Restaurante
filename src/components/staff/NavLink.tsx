import Link from "next/link";
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
  const Icon = item.icon;

  if (colapsado) {
    return (
      <Tooltip>
        <TooltipTrigger
          className={`flex items-center justify-center w-full px-3 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive
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
      href={item.href}
      className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? "bg-primario/10 text-primario"
          : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {item.label}
    </Link>
  );
}
