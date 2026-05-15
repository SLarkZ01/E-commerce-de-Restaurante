"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface WompiModalContextType {
  wompiAbierto: boolean;
  setWompiAbierto: (abierto: boolean) => void;
}

const WompiModalContext = createContext<WompiModalContextType | undefined>(undefined);

export function WompiModalProvider({ children }: { children: ReactNode }) {
  const [wompiAbierto, setWompiAbiertoState] = useState(false);

  const setWompiAbierto = useCallback((abierto: boolean) => {
    setWompiAbiertoState(abierto);
  }, []);

  return (
    <WompiModalContext.Provider value={{ wompiAbierto, setWompiAbierto }}>
      {children}
    </WompiModalContext.Provider>
  );
}

export function useWompiModal() {
  const context = useContext(WompiModalContext);
  if (!context) {
    throw new Error("useWompiModal must be used within WompiModalProvider");
  }
  return context;
}
