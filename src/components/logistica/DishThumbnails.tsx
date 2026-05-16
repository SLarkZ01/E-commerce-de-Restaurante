"use client";

import { Utensils, Coffee, Package } from "lucide-react";
import type { ItemPedidoConImagen, TipoPlato } from "@/types";

const ICONOS_POR_TIPO: Record<TipoPlato, React.ReactNode> = {
  plato_fuerte: <Utensils className="w-5 h-5" />,
  bebida: <Coffee className="w-5 h-5" />,
  combo: <Package className="w-5 h-5" />,
};

interface DishThumbnailsProps {
  items: ItemPedidoConImagen[];
}

const MAX_VISIBLE = 3;

export function DishThumbnails({ items }: DishThumbnailsProps) {
  const visibles = items.slice(0, MAX_VISIBLE);
  const restantes = items.length - MAX_VISIBLE;

  return (
    <div className="flex gap-1.5">
      {visibles.map((item, i) => (
        <div
          key={i}
          className="relative w-12 h-12 rounded-lg overflow-hidden bg-fondo-oscuro flex-shrink-0 border border-borde/50"
        >
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
      ))}
      {restantes > 0 && (
        <div className="w-12 h-12 rounded-lg bg-fondo-oscuro border border-borde/50 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-texto-secundario">
            +{restantes}
          </span>
        </div>
      )}
    </div>
  );
}
