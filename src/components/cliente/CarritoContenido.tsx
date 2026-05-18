"use client";

import { ShoppingBag, Check, AlertCircle } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { useCheckoutWompi } from "@/hooks/useCheckoutWompi";
import { CarritoItem } from "./CarritoItem";
import { CarritoEstadoVacio } from "./CarritoEstadoVacio";
import { CarritoSinMesa } from "./CarritoSinMesa";
import { WompiButton } from "./WompiButton";
import { Badge } from "@/components/ui/badge";

interface CarritoContenidoProps {
  mesaUuid: string | null;
  abierto: boolean;
  variant?: "sidebar" | "sheet";
  onAntesDeAbrir?: () => void;
}

export function CarritoContenido({ mesaUuid, abierto, variant = "sheet", onAntesDeAbrir }: CarritoContenidoProps) {
  const tieneMesa = mesaUuid !== null;

  const {
    datosWompi, mensaje, esExito,
    items, total, actualizarCantidad, eliminarItem,
    manejarExito, manejarError,
  } = useCheckoutWompi(mesaUuid, abierto);

  const cantidadTotal = items.reduce((sum, i) => sum + i.cantidad, 0);
  const itemsLength = items.length;

  const esSidebar = variant === "sidebar";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={esSidebar
        ? "px-5 py-4 bg-fondo-card border-b border-borde/40"
        : "bg-gradient-to-r from-primario to-primario-hover px-5 py-4"
      }>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={esSidebar
              ? "w-9 h-9 rounded-xl bg-primario/10 flex items-center justify-center"
              : "w-9 h-9 rounded-xl bg-primario-texto/20 flex items-center justify-center"
            }>
              <ShoppingBag className={esSidebar
                ? "w-4.5 h-4.5 text-primario"
                : "w-4.5 h-4.5 text-primario-texto"
              } />
            </div>
            <div>
              <h2 className={esSidebar
                ? "font-playfair text-lg font-bold text-texto"
                : "font-playfair text-lg font-bold text-primario-texto"
              }>
                Tu Pedido
              </h2>
              {esSidebar && (
                <p className="text-xs text-texto-secundario mt-0.5">
                  {cantidadTotal} {cantidadTotal === 1 ? "item" : "items"}
                </p>
              )}
            </div>
          </div>
          {cantidadTotal > 0 && (
            <Badge className={esSidebar
              ? "bg-primario text-primario-texto border-0 font-semibold text-xs px-2.5 py-0.5"
              : "bg-primario-texto/20 text-primario-texto border-0 font-semibold"
            }>
              {cantidadTotal}
            </Badge>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {itemsLength === 0 ? (
          <CarritoEstadoVacio />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <CarritoItem
                key={item.id}
                item={item}
                onActualizarCantidad={actualizarCantidad}
                onEliminar={eliminarItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mensaje de estado */}
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
          <span>
            {mensaje}
            {esExito && (
              <span className="block text-xs mt-1 opacity-80">
                Usa el botón <strong>Rastrear Pedido</strong> en la barra superior para seguir su estado.
              </span>
            )}
          </span>
        </div>
      )}

      {/* Footer */}
      {itemsLength > 0 && (
        <div className={esSidebar
          ? "px-5 py-4 border-t border-borde/40 space-y-3 bg-fondo-card"
          : "px-5 py-4 border-t border-borde/60 space-y-3 bg-fondo-card"
        }>
          <div className="flex items-center justify-between">
            <span className="text-sm text-texto-secundario">Total</span>
            <span className="font-playfair text-xl font-bold text-texto">
              {formatearPrecio(total)}
            </span>
          </div>

          {!tieneMesa ? (
            <CarritoSinMesa />
          ) : (
            <>
              <WompiButton
                datos={datosWompi}
                onExito={manejarExito}
                onError={manejarError}
                onAntesDeAbrir={onAntesDeAbrir ?? (() => {})}
              />
              <p className="text-center text-[11px] text-texto-terciario">
                Pago seguro vía Wompi — Bancolombia
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
