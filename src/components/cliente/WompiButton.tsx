"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { DatosWompi } from "@/hooks/usePago";
import { useWidgetWompi } from "./WompiProvider";
import { useWompiModal } from "./WompiModalContext";
import { Skeleton } from "@/components/ui/skeleton";

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

interface WompiButtonProps {
  datos: DatosWompi | null;
  onExito: (transactionId: string, customerEmail?: string) => void;
  onError: (mensaje: string) => void;
  onAntesDeAbrir: () => void;
}

export function WompiButton({ datos, onExito, onError, onAntesDeAbrir }: WompiButtonProps) {
  const listo = useWidgetWompi();
  const { setWompiAbierto } = useWompiModal();
  const [abriendo, setAbriendo] = useState(false);
  const [pagoCompletado, setPagoCompletado] = useState(false);
  const checkoutRef = useRef<{
    open: (cb: (r: {
      transaction: { id: string; status: string; reference: string; customerEmail?: string };
      customerData?: { email?: string; fullName?: string; phoneNumber?: string };
    }) => void) => void;
  } | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const pagoCompletadoRef = useRef(pagoCompletado);

  useEffect(() => {
    pagoCompletadoRef.current = pagoCompletado;
  }, [pagoCompletado]);

  useEffect(() => {
    observerRef.current = new MutationObserver(() => {
      const modal = document.querySelector("#wompi-checkout-modal, .wompi-checkout-modal, iframe[src*='wompi']");
      if (!modal && !pagoCompletadoRef.current) {
        setWompiAbierto(false);
        observerRef.current?.disconnect();
      }
    });

    observerRef.current.observe(document.body, { childList: true, subtree: true });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [setWompiAbierto]);

  const handleClick = useCallback(() => {
    if (!datos || !window.WidgetCheckout || pagoCompletado) return;

    onAntesDeAbrir();
    setWompiAbierto(true);

    if (!checkoutRef.current) {
      checkoutRef.current = new window.WidgetCheckout({
        currency: datos.moneda,
        amountInCents: datos.montoEnCentavos,
        reference: datos.referencia,
        publicKey: datos.publicKey,
        signature: { integrity: datos.firma },
      });
    }

    setTimeout(() => {
      setAbriendo(true);
      checkoutRef.current!.open((result) => {
        setAbriendo(false);
        setWompiAbierto(false);
        const tx = result.transaction;
        if (!tx || tx.status === "ERROR" || tx.status === "DECLINED") {
          onError("El pago fue rechazado. Intenta de nuevo.");
          return;
        }
        setPagoCompletado(true);
        const email = result.transaction.customerEmail ?? result.customerData?.email;
        onExito(tx.id, email);
      });
    }, 200);
  }, [datos, pagoCompletado, onAntesDeAbrir, setWompiAbierto, onError, onExito]);

  if (!datos) return <div className="text-center py-3"><p className="text-xs text-texto-terciario">Preparando pago...</p></div>;
  if (pagoCompletado) return <div className="bg-exito/10 text-exito rounded-xl px-4 py-3 text-sm text-center font-medium">Pago completado. Procesando...</div>;

  return (
    <div className="min-h-[44px]">
      {!listo ? <Skeleton className="w-full h-11 rounded-xl" /> : (
        <button onClick={handleClick} disabled={abriendo}
          className="w-full h-11 bg-primario hover:bg-primario-hover text-primario-texto rounded-xl font-semibold text-sm shadow-lg shadow-primario/20 active:scale-[0.98] transition-all disabled:opacity-50">
          {abriendo ? "Abriendo pago..." : "Pagar con Wompi"}
        </button>
      )}
    </div>
  );
}
