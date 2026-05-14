"use client";

import { useState } from "react";
import { ShoppingBag, Check, AlertCircle } from "lucide-react";
import { usarCarrito } from "@/stores/cart";
import { crearPedido } from "@/lib/acciones/pago";
import { formatearPrecio } from "@/lib/formato";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CarritoItem } from "./CarritoItem";
import { CarritoResumen } from "./CarritoResumen";
import { CarritoEstadoVacio } from "./CarritoEstadoVacio";
import { CarritoSinMesa } from "./CarritoSinMesa";

interface CarritoSheetProps {
  mesaUuid: string | null;
}

export function CarritoSheet({ mesaUuid }: CarritoSheetProps) {
  const tieneMesa = mesaUuid !== null;
  const [abierto, setAbierto] = useState(false);
  const [pagando, setPagando] = useState(false);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  const items = usarCarrito((s) => s.items);
  const actualizarCantidad = usarCarrito((s) => s.actualizarCantidad);
  const eliminarItem = usarCarrito((s) => s.eliminarItem);
  const total = usarCarrito((s) => s.total);
  const vaciarCarrito = usarCarrito((s) => s.vaciarCarrito);

  const cantidadTotal = items.reduce((sum, i) => sum + i.cantidad, 0);

  const handlePago = async () => {
    if (!tieneMesa) return;
    setPagando(true);
    try {
      const resultado = await crearPedido(mesaUuid!, items, total());
      if (resultado.error) {
        setConfirmacion(resultado.error);
        return;
      }
      setConfirmacion(
        `Pedido #${resultado.pedidoId.slice(0, 8)} creado correctamente`
      );
      vaciarCarrito();
      setTimeout(() => {
        setAbierto(false);
        setConfirmacion(null);
      }, 2500);
    } catch {
      setConfirmacion("Error al procesar el pedido");
    } finally {
      setPagando(false);
    }
  };

  return (
    <>
      <footer className="sticky bottom-0 z-30 bg-fondo-card/95 backdrop-blur-sm border-t border-borde/60 px-4 py-3">
        <button
          onClick={() => setAbierto(true)}
          disabled={items.length === 0}
          className="w-full flex items-center justify-between bg-primario text-primario-texto rounded-xl px-5 py-3.5 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primario-hover transition-all active:scale-[0.98] shadow-lg shadow-primario/20"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            {cantidadTotal} {cantidadTotal === 1 ? "plato" : "platos"}
          </span>
          <span className="font-playfair font-bold text-lg">
            {formatearPrecio(total())}
          </span>
        </button>
      </footer>

      <Sheet open={abierto} onOpenChange={setAbierto}>
        <SheetContent className="flex flex-col p-0 gap-0 sm:max-w-md">
          <div className="bg-gradient-to-r from-primario to-primario-hover px-5 py-4">
            <SheetHeader>
              <SheetTitle className="font-playfair text-lg font-bold text-primario-texto">
                Tu Pedido
              </SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {items.length === 0 ? (
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

          {confirmacion && (
            <div
              className={`mx-5 mb-2 px-4 py-3 rounded-xl text-sm text-center flex items-center justify-center gap-2 ${
                confirmacion.includes("Error")
                  ? "bg-error/10 text-error"
                  : "bg-exito/10 text-exito"
              }`}
            >
              {confirmacion.includes("Error") ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Check className="w-4 h-4 shrink-0" />
              )}
              {confirmacion}
            </div>
          )}

          {tieneMesa ? (
            <CarritoResumen
              total={total}
              pagando={pagando}
              itemsCount={items.length}
              onConfirmar={handlePago}
            />
          ) : (
            <CarritoSinMesa />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
