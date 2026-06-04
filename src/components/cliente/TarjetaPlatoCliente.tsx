"use client";

import Image from "next/image";
import { Plus, Utensils } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import type { Plato } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TarjetaPlatoClienteProps {
  plato: Plato;
  alAgregar: (plato: Plato) => void;
}

export function TarjetaPlatoCliente({ plato, alAgregar }: TarjetaPlatoClienteProps) {
  const tieneIngredientes =
    plato.tipo_plato === "plato_fuerte" &&
    plato.ingredientes &&
    plato.ingredientes.length > 0;

  return (
    <div className="group relative bg-fondo-card rounded-xl border border-borde/40 overflow-hidden shadow-sm hover:shadow-md hover:border-primario/30 transition-all duration-200 hover:-translate-y-1">
      <div className="relative aspect-[3/2] bg-fondo-oscuro overflow-hidden">
        {plato.imagen_url ? (
          <Image
            src={plato.imagen_url}
            alt={plato.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-texto-terciario/40">
            <Utensils className="w-12 h-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-fondo-card/95 backdrop-blur-sm shadow-sm">
            <span className="font-playfair text-sm font-bold text-primario">
              {formatearPrecio(plato.precio)}
            </span>
          </span>
        </div>

        {!plato.disponible && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <Badge variant="destructive" className="text-xs font-semibold px-3 py-1">
              Agotado
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-playfair text-sm font-semibold text-texto leading-snug line-clamp-2 mb-1 group-hover:text-primario transition-colors">
          {plato.nombre}
        </h3>
        {plato.descripcion && (
          <p className="text-[11px] text-texto-secundario line-clamp-2 mb-1.5 leading-relaxed">
            {plato.descripcion}
          </p>
        )}

        {tieneIngredientes && (
          <div className="flex flex-wrap gap-1 mb-2">
            {plato.ingredientes!.map((ing, i) => (
              <span
                key={i}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-texto-terciario bg-fondo-oscuro/60"
              >
                {ing}
              </span>
            ))}
          </div>
        )}

        <Button
          onClick={() => alAgregar(plato)}
          disabled={!plato.disponible}
          size="sm"
          className="w-full h-8 text-xs font-semibold bg-primario hover:bg-primario-hover text-primario-texto rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Agregar
        </Button>
      </div>
    </div>
  );
}
