"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

function esMovil() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

interface AsistenteContextType {
  sidebarAbierto: boolean;
  esMovil: boolean;
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
  const [mobil, setMobil] = useState(false);
  const resizeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobil(esMovil());
    setSidebarAbierto(!esMovil());

    const handleResize = () => {
      const movil = esMovil();
      setMobil(movil);
      if (movil) setSidebarAbierto(false);
    };

    resizeRef.current = handleResize;
    window.addEventListener("resize", handleResize);
    return () => {
      if (resizeRef.current) {
        window.removeEventListener("resize", resizeRef.current);
      }
    };
  }, []);

  const toggleSidebar = useCallback(() => setSidebarAbierto((p) => !p), []);
  const cerrarSidebar = useCallback(() => setSidebarAbierto(false), []);

  return (
    <AsistenteContext.Provider value={{ sidebarAbierto, esMovil: mobil, toggleSidebar, cerrarSidebar }}>
      {children}
    </AsistenteContext.Provider>
  );
}
