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
    <TooltipProvider>
      <div className="flex gap-1.5">
        {visibles.map((item, i) => (
          <Tooltip key={i}>
            <TooltipTrigger>
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-fondo-oscuro flex-shrink-0 border border-borde/50 cursor-default transition-transform hover:scale-105">
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
        {restantes > 0 && (
          <div className="w-14 h-14 rounded-xl bg-fondo-oscuro/80 border border-borde/50 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <span className="text-sm font-bold text-texto-secundario">
              +{restantes}
            </span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
