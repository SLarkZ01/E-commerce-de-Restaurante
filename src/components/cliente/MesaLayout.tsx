"use client";

import { useWompiModal } from "./WompiModalContext";
import { useBloqueoScroll } from "@/hooks/useBloqueoScroll";
import { type ReactNode } from "react";

interface MesaLayoutProps {
  children: ReactNode;
  carritoSidebar: ReactNode;
}

export function MesaLayout({ children, carritoSidebar }: MesaLayoutProps) {
  const { wompiAbierto } = useWompiModal();

  useBloqueoScroll(wompiAbierto);

  return (
    <div className="flex flex-col lg:flex-row min-h-dvh bg-fondo-oscuro/30">
      <main className="flex-1 flex flex-col min-w-0 bg-fondo">
        {children}
      </main>
      {carritoSidebar}
    </div>
  );
}
