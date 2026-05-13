"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Check, AlertCircle } from "lucide-react";
import { usarCarrito } from "@/stores/cart";
import { crearPedido } from "@/lib/acciones/pago";
import { formatearPrecio } from "@/lib/formato";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
              <div className="flex flex-col items-center justify-center py-16 text-texto-terciario">
                <div className="w-16 h-16 rounded-full bg-fondo-oscuro flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium text-texto-secundario">El carrito está vacío</p>
                <p className="text-xs mt-1">Agrega platos del menú</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-fondo rounded-xl p-3 border border-borde/40"
                >
                  <div className="w-12 h-12 rounded-lg bg-fondo-oscuro flex items-center justify-center text-texto-terciario shrink-0">
                    {item.imagenUrl ? (
                      <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-texto truncate">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-texto-secundario">
                      {formatearPrecio(item.precio)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        actualizarCantidad(item.id, item.cantidad - 1)
                      }
                      className="w-7 h-7 rounded-md bg-fondo-oscuro text-texto flex items-center justify-center hover:bg-borde transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center tabular-nums">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() =>
                        actualizarCantidad(item.id, item.cantidad + 1)
                      }
                      className="w-7 h-7 rounded-md bg-fondo-oscuro text-texto flex items-center justify-center hover:bg-borde transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => eliminarItem(item.id)}
                    className="text-texto-terciario hover:text-error transition-colors p-1"
                    aria-label={`Eliminar ${item.nombre}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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

          <div className="px-5 py-4 border-t border-borde/60 space-y-3 bg-fondo-card">
            <div className="flex justify-between text-sm">
              <span className="text-texto-secundario">Subtotal</span>
              <span className="font-medium text-texto tabular-nums">
                {formatearPrecio(total())}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-playfair text-base font-bold text-texto">Total</span>
              <span className="font-playfair text-xl font-bold text-primario tabular-nums">
                {formatearPrecio(total())}
              </span>
            </div>

            {tieneMesa ? (
              <>
                <Button
                  onClick={handlePago}
                  disabled={items.length === 0 || pagando}
                  className="w-full h-12 bg-primario hover:bg-primario-hover text-primario-texto rounded-xl font-semibold text-sm shadow-lg shadow-primario/20 active:scale-[0.98]"
                >
                  {pagando ? (
                    "Procesando..."
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmar Pedido
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-texto-terciario">
                  PayPal próximamente
                </p>
              </>
            ) : (
              <div className="bg-fondo-oscuro rounded-xl p-5 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-borde/50 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6 text-texto-secundario" />
                </div>
                <p className="text-sm font-medium text-texto">
                  Escanea el QR de tu mesa
                </p>
                <p className="text-xs text-texto-secundario">
                  Necesitas escanear el código QR de tu mesa para completar el pedido
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
