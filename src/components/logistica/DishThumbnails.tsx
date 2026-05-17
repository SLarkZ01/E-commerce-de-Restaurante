"use client";

import { Utensils, Coffee, Package } from "lucide-react";
import type { ItemPedidoConImagen, TipoPlato } from "@/types";

const ICONOS_POR_TIPO: Record<TipoPlato, React.ReactNode> = {
  plato_fuerte: <Utensils className="w-4 h-4" />,
  bebida: <Coffee className="w-4 h-4" />,
  combo: <Package className="w-4 h-4" />,
};

interface DishThumbnailsProps {
  items: ItemPedidoConImagen[];
}

export function DishThumbnails({ items }: DishThumbnailsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-lg bg-fondo-oscuro/50 border border-borde/30 px-2 py-1.5"
        >
          <div className="w-10 h-10 rounded-md overflow-hidden bg-fondo-oscuro flex-shrink-0 border border-borde/40">
            {item.plato_imagen_url ? (
              <img
                src={item.plato_imagen_url}
                alt={item.plato_nombre}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-texto-terciario">
                {ICONOS_POR_TIPO[item.plato_tipo]}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-texto truncate leading-tight">
              {item.plato_nombre}
            </p>
            {item.cantidad > 1 && (
              <span className="text-xs font-semibold text-primario tabular-nums">
                x{item.cantidad}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
