"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { usarCarrito } from "@/stores/cart";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CarritoContenido } from "./CarritoContenido";

interface CarritoSheetProps {
  mesaUuid: string | null;
}

export function CarritoSheet({ mesaUuid }: CarritoSheetProps) {
  const [abierto, setAbierto] = useState(false);
  const [mounted, setMounted] = useState(false);

  const items = usarCarrito((s) => s.items);

  useEffect(() => setMounted(true), []);

  const cantidadTotal = mounted ? items.reduce((sum, i) => sum + i.cantidad, 0) : 0;
  const totalMostrado = mounted
    ? items.reduce((sum, i) => sum + Number(i.precio) * i.cantidad, 0)
    : 0;

  return (
    <>
      {/* Trigger en móvil/tablet */}
      <footer className="lg:hidden sticky bottom-0 z-30 bg-fondo-card/95 backdrop-blur-md border-t border-borde/40 px-4 py-3 shadow-[0_-4px_24px_rgba(45,42,38,0.06)]">
        <button
          onClick={() => setAbierto(true)}
          disabled={cantidadTotal === 0}
          className="w-full flex items-center justify-between bg-primario text-primario-texto rounded-xl px-5 py-3.5 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primario-hover transition-all active:scale-[0.98] shadow-lg shadow-primario/20"
        >
          <span className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primario-texto/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-sm">
              {cantidadTotal} {cantidadTotal === 1 ? "plato" : "platos"}
            </span>
          </span>
          <span className="font-playfair font-bold text-lg">
            {formatearPrecio(totalMostrado)}
          </span>
        </button>
      </footer>

      {/* Sheet en móvil/tablet */}
      <Sheet open={abierto} onOpenChange={setAbierto}>
        <SheetContent className="flex flex-col p-0 gap-0 sm:max-w-md">
          <CarritoContenido
            mesaUuid={mesaUuid}
            abierto={abierto}
            variant="sheet"
            onAntesDeAbrir={() => setAbierto(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
