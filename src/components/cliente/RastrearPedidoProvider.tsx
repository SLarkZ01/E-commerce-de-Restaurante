"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface RastrearPedidoContextType {
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
}

const RastrearPedidoContext = createContext<RastrearPedidoContextType | null>(null);

export function useRastrearPedido() {
  const ctx = useContext(RastrearPedidoContext);
  if (!ctx) {
    throw new Error("useRastrearPedido debe usarse dentro de RastrearPedidoProvider");
  }
  return ctx;
}

export function RastrearPedidoProvider({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <RastrearPedidoContext.Provider
      value={{
        abierto,
        abrir: () => setAbierto(true),
        cerrar: () => setAbierto(false),
      }}
    >
      {children}
    </RastrearPedidoContext.Provider>
  );
}
