"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Check, AlertCircle } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { useCheckoutWompi } from "@/hooks/useCheckoutWompi";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CarritoItem } from "./CarritoItem";
import { CarritoEstadoVacio } from "./CarritoEstadoVacio";
import { CarritoSinMesa } from "./CarritoSinMesa";
import { WompiButton } from "./WompiButton";

interface CarritoSheetProps {
  mesaUuid: string | null;
}

export function CarritoSheet({ mesaUuid }: CarritoSheetProps) {
  const tieneMesa = mesaUuid !== null;
  const [abierto, setAbierto] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const {
    datosWompi, mensaje, esExito,
    items, total, actualizarCantidad, eliminarItem,
    manejarExito, manejarError,
  } = useCheckoutWompi(mesaUuid, abierto);

  const cantidadTotal = mounted ? items.reduce((sum, i) => sum + i.cantidad, 0) : 0;
  const itemsLength = mounted ? items.length : 0;
  const totalMostrado = mounted ? total : 0;

  const handleSheetChange = useCallback((open: boolean) => {
    setAbierto(open);
  }, []);

  const handleAntesDeAbrir = useCallback(() => {
    setAbierto(false);
  }, []);

  return (
    <>
      <footer className="sticky bottom-0 z-30 bg-fondo-card/95 backdrop-blur-sm border-t border-borde/60 px-4 py-3">
        <button
          onClick={() => handleSheetChange(true)}
          disabled={itemsLength === 0}
          className="w-full flex items-center justify-between bg-primario text-primario-texto rounded-xl px-5 py-3.5 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primario-hover transition-all active:scale-[0.98] shadow-lg shadow-primario/20"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            {cantidadTotal} {cantidadTotal === 1 ? "plato" : "platos"}
          </span>
          <span className="font-playfair font-bold text-lg">
            {formatearPrecio(totalMostrado)}
          </span>
        </button>
      </footer>

      <Sheet open={abierto} onOpenChange={handleSheetChange}>
        <SheetContent className="flex flex-col p-0 gap-0 sm:max-w-md">
          <div className="bg-gradient-to-r from-primario to-primario-hover px-5 py-4">
            <SheetHeader>
              <SheetTitle className="font-playfair text-lg font-bold text-primario-texto">
                Tu Pedido
              </SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {itemsLength === 0 ? (
              <CarritoEstadoVacio />
            ) : (
              items.map((item) => (
                <CarritoItem
                  key={item.id}
                  item={item}
                  onActualizarCantidad={actualizarCantidad}
                  onEliminar={eliminarItem}
                />
              ))
            )}
          </div>

          {mensaje && (
            <div
              className={`mx-5 mb-2 px-4 py-3 rounded-xl text-sm text-center flex items-center justify-center gap-2 ${
                esExito ? "bg-exito/10 text-exito" : "bg-error/10 text-error"
              }`}
            >
              {esExito ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {mensaje}
            </div>
          )}

          {itemsLength > 0 && (
            <div className="px-5 py-4 border-t border-borde/60 space-y-3 bg-fondo-card">
              {!tieneMesa ? (
                <CarritoSinMesa />
              ) : (
                <WompiButton
                  datos={datosWompi}
                  onExito={manejarExito}
                  onError={manejarError}
                  onAntesDeAbrir={handleAntesDeAbrir}
                />
              )}
              <p className="text-center text-[11px] text-texto-terciario">
                Pago seguro vía Wompi — Bancolombia
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
