"use client";

import { CarritoContenido } from "./CarritoContenido";

interface CarritoSidebarProps {
  mesaUuid: string | null;
}

export function CarritoSidebar({ mesaUuid }: CarritoSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col w-80 xl:w-96 border-l border-borde/40 bg-fondo-card h-dvh sticky top-0 shadow-[-4px_0_24px_rgba(45,42,38,0.04)]">
      <CarritoContenido mesaUuid={mesaUuid} abierto variant="sidebar" />
    </aside>
  );
}
