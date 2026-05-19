import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  UtensilsCrossed,
  PackageCheck,
  LayoutDashboard,
  Users,
  Armchair,
  Sparkles,
} from "lucide-react";
import type { Rol } from "@/types";

export interface ItemNavegacion {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Rol[];
  separadorAntes?: boolean;
}

export const ITEMS_NAVEGACION: ItemNavegacion[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    href: "/cocina",
    label: "Pedidos",
    icon: ClipboardList,
    roles: ["cocinero", "admin"],
    separadorAntes: true,
  },
  {
    href: "/cocina/platos",
    label: "Gestión de Menú",
    icon: UtensilsCrossed,
    roles: ["cocinero", "admin"],
  },
  {
    href: "/logistica",
    label: "Platos Listos",
    icon: PackageCheck,
    roles: ["mesero", "admin"],
  },
  {
    href: "/admin/personal",
    label: "Personal",
    icon: Users,
    roles: ["admin"],
    separadorAntes: true,
  },
  {
    href: "/admin/mesas",
    label: "Mesas",
    icon: Armchair,
    roles: ["admin"],
  },
  {
    href: "/admin/asistente",
    label: "Arianna AI",
    icon: Sparkles,
    roles: ["admin"],
    separadorAntes: true,
  },
];
