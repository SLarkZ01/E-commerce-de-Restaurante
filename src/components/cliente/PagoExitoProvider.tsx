"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PagoExitoContextType {
  pedidoId: string | null;
  mostrar: (id: string) => void;
  cerrar: () => void;
}

const PagoExitoContext = createContext<PagoExitoContextType | null>(null);

export function usePagoExito() {
  const ctx = useContext(PagoExitoContext);
  if (!ctx) {
    throw new Error("usePagoExito debe usarse dentro de PagoExitoProvider");
  }
  return ctx;
}

export function PagoExitoProvider({ children }: { children: ReactNode }) {
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  const mostrar = useCallback((id: string) => setPedidoId(id), []);
  const cerrar = useCallback(() => setPedidoId(null), []);

  return (
    <PagoExitoContext.Provider value={{ pedidoId, mostrar, cerrar }}>
      {children}
    </PagoExitoContext.Provider>
  );
}
