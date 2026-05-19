"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AsistenteContextType {
  sidebarAbierto: boolean;
  toggleSidebar: () => void;
  cerrarSidebar: () => void;
}

const AsistenteContext = createContext<AsistenteContextType | null>(null);

export function useAsistente() {
  const ctx = useContext(AsistenteContext);
  if (!ctx) throw new Error("useAsistente debe usarse dentro de AsistenteProvider");
  return ctx;
}

export function AsistenteProvider({ children }: { children: ReactNode }) {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  const toggleSidebar = useCallback(() => setSidebarAbierto((p) => !p), []);
  const cerrarSidebar = useCallback(() => setSidebarAbierto(false), []);

  return (
    <AsistenteContext.Provider value={{ sidebarAbierto, toggleSidebar, cerrarSidebar }}>
      {children}
    </AsistenteContext.Provider>
  );
}
