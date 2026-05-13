"use client";

import { useState } from "react";
import { usarCarrito } from "@/stores/cart";
import { crearPedido } from "@/lib/acciones/pago";
import { formatearPrecio } from "@/lib/formato";

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
      <footer className="sticky bottom-0 z-30 bg-white border-t border-[#E7E0D8] px-4 py-3">
        <button
          onClick={() => setAbierto(true)}
          disabled={items.length === 0}
          className="w-full flex items-center justify-between bg-[#C44536] text-white rounded-xl px-5 py-3 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#A8382C] transition-colors active:scale-[0.98]"
        >
          <span>
            🛒 {cantidadTotal} {cantidadTotal === 1 ? "plato" : "platos"}
          </span>
          <span className="font-semibold">{formatearPrecio(total())}</span>
        </button>
      </footer>

      {abierto && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAbierto(false)}
          />
          <div className="relative bg-white rounded-t-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-[#E7E0D8]" />
            </div>

            <div className="px-4 pb-2 border-b border-[#E7E0D8]">
              <h2 className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
                Tu Pedido
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {items.length === 0 ? (
                <p className="text-center text-[#A8A29E] py-10 text-sm">
                  El carrito está vacío
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-[#FEFAF6] rounded-xl p-3"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-xl shrink-0">
                      🍽️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2D2A26] truncate">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-[#78716C]">
                        {formatearPrecio(item.precio)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          actualizarCantidad(item.id, item.cantidad - 1)
                        }
                        className="w-7 h-7 rounded-md bg-[#F5F0EB] text-[#2D2A26] flex items-center justify-center text-sm hover:bg-[#E7E0D8] transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-5 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          actualizarCantidad(item.id, item.cantidad + 1)
                        }
                        className="w-7 h-7 rounded-md bg-[#F5F0EB] text-[#2D2A26] flex items-center justify-center text-sm hover:bg-[#E7E0D8] transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="text-[#A8A29E] hover:text-[#DC2626] transition-colors text-xs px-1"
                      aria-label={`Eliminar ${item.nombre}`}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            {confirmacion && (
              <div
                className={`mx-4 mb-2 px-4 py-2 rounded-lg text-sm text-center ${
                  confirmacion.includes("Error")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {confirmacion}
              </div>
            )}

            <div className="px-4 py-3 border-t border-[#E7E0D8] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#78716C]">Subtotal</span>
                <span className="font-medium text-[#2D2A26]">
                  {formatearPrecio(total())}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span className="text-[#2D2A26]">Total</span>
                <span className="text-[#C44536]">
                  {formatearPrecio(total())}
                </span>
              </div>

              {tieneMesa ? (
                <>
                  <button
                    onClick={handlePago}
                    disabled={items.length === 0 || pagando}
                    className="w-full py-3 bg-[#C44536] text-white rounded-xl font-medium text-sm hover:bg-[#A8382C] disabled:opacity-40 transition-colors active:scale-[0.98]"
                  >
                    {pagando ? "Procesando..." : "Confirmar Pedido"}
                  </button>
                  <p className="text-center text-xs text-[#A8A29E]">
                    PayPal próximamente
                  </p>
                </>
              ) : (
                <div className="bg-[#F5F0EB] rounded-xl p-4 text-center space-y-2">
                  <span className="text-2xl">📱</span>
                  <p className="text-sm font-medium text-[#2D2A26]">
                    Escanea el QR de tu mesa
                  </p>
                  <p className="text-xs text-[#78716C]">
                    Necesitas escanear el código QR de tu mesa para completar el pedido
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
