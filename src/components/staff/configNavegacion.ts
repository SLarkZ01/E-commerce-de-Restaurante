import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  UtensilsCrossed,
  PackageCheck,
  LayoutDashboard,
  Users,
  Armchair,
} from "lucide-react";

export interface ItemNavegacion {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: ItemNavegacion[] = [
  { href: "/cocina", label: "Pedidos", icon: ClipboardList },
  { href: "/cocina/platos", label: "Gestión de Menú", icon: UtensilsCrossed },
  { href: "/logistica", label: "Platos Listos", icon: PackageCheck },
];

export const ADMIN_ITEMS: ItemNavegacion[] = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/personal", label: "Personal", icon: Users },
  { href: "/admin/mesas", label: "Mesas", icon: Armchair },
];
