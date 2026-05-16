"use client";

import { Utensils, Coffee, Package } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  if (items.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Tooltip key={`${item.plato_nombre}-${i}`}>
            <TooltipTrigger>
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-fondo-oscuro flex-shrink-0 border border-borde/50 cursor-default transition-transform hover:scale-105">
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
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>{item.plato_nombre}</p>
              {item.cantidad > 1 && (
                <p className="text-texto-secundario">x{item.cantidad}</p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
