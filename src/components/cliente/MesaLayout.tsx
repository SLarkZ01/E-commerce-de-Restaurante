"use client";

import { useWompiModal } from "./WompiModalContext";
import { useBloqueoScroll } from "@/hooks/useBloqueoScroll";
import { type ReactNode } from "react";

interface MesaLayoutProps {
  children: ReactNode;
}

export function MesaLayout({ children }: MesaLayoutProps) {
  const { wompiAbierto } = useWompiModal();

  useBloqueoScroll(wompiAbierto);

  return (
    <div className="flex flex-col min-h-dvh bg-fondo">
      {children}
    </div>
  );
}
