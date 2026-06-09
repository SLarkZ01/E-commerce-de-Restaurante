"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Script from "next/script";

declare global {
  interface Window {
    WidgetCheckout?: new (config: Record<string, unknown>) => {
      open: (cb: (r: {
        transaction: { id: string; status: string; reference: string; customerEmail?: string };
        customerData?: { email?: string; fullName?: string; phoneNumber?: string };
      }) => void) => void;
    };
  }
}

const WompiContext = createContext<boolean>(false);

export function useWidgetWompi() {
  return useContext(WompiContext);
}

export function WompiProvider({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    // Si el script ya está cargado de una sesión anterior
    if (window.WidgetCheckout) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setListo(true);
    }
  }, []);

  return (
    <>
      <Script
        src="https://checkout.wompi.co/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          const id = setInterval(() => {
            if (window.WidgetCheckout) {
              clearInterval(id);
              setListo(true);
            }
          }, 100);
        }}
      />
      <WompiContext.Provider value={listo}>
        {children}
      </WompiContext.Provider>
    </>
  );
}
