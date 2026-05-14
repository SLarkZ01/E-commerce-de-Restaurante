"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function useActiveRoute() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/cocina") return pathname === "/cocina" || pathname === "/cocina/";
    if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
    return pathname.startsWith(href);
  };

  const isAdminSection = pathname.startsWith("/admin");

  return { isActive, isAdminSection, pathname };
}
