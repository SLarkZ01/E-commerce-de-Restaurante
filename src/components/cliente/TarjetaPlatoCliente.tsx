"use client";

import { Plus, Utensils } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { usarCarrito, type ItemCarrito } from "@/stores/cart";
import type { Plato } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ICONOS_POR_TIPO: Record<string, React.ReactNode> = {
  plato_fuerte: <Utensils className="w-8 h-8" />,
  bebida: <Utensils className="w-8 h-8" />,
  combo: <Utensils className="w-8 h-8" />,
};

interface TarjetaPlatoClienteProps {
  plato: Plato;
  alAgregar: (plato: Plato) => void;
}

export function TarjetaPlatoCliente({ plato, alAgregar }: TarjetaPlatoClienteProps) {
  return (
    <div className="group bg-fondo-card rounded-2xl border border-borde/60 overflow-hidden shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_8px_24px_rgba(45,42,38,0.10)] hover:border-borde transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] bg-fondo-oscuro overflow-hidden">
        {plato.imagen_url ? (
          <img
            src={plato.imagen_url}
            alt={plato.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-texto-terciario">
            {ICONOS_POR_TIPO[plato.tipo_plato] || <Utensils className="w-8 h-8" />}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
          <p className="text-white text-xs font-bold font-playfair">
            {formatearPrecio(plato.precio)}
          </p>
        </div>
        {!plato.disponible && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs">Agotado</Badge>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-playfair text-sm font-semibold text-texto leading-tight line-clamp-2 mb-1">
          {plato.nombre}
        </h3>
        {plato.descripcion && (
          <p className="text-[11px] text-texto-secundario line-clamp-2 mb-2.5">
            {plato.descripcion}
          </p>
        )}
        <Button
          onClick={() => alAgregar(plato)}
          disabled={!plato.disponible}
          size="sm"
          className="w-full h-8 text-xs font-semibold bg-primario hover:bg-primario-hover text-primario-texto rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Agregar
        </Button>
      </div>
    </div>
  );
}
