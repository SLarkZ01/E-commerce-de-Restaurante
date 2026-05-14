"use client";

import { Trash2, Utensils } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Plato } from "@/types";

const ICONOS_POR_TIPO: Record<string, React.ReactNode> = {
  plato_fuerte: <Utensils className="w-3.5 h-3.5" />,
  bebida: <Utensils className="w-3.5 h-3.5" />,
  combo: <Utensils className="w-3.5 h-3.5" />,
};

const ETIQUETAS_POR_TIPO: Record<string, string> = {
  plato_fuerte: "Plato Fuerte",
  bebida: "Bebida",
  combo: "Combo",
};

interface TarjetaPlatoCocinaProps {
  plato: Plato;
  onEliminar: (id: string) => void;
  onToggleDisponible: (id: string, datos: { disponible: boolean }) => void;
}

export function TarjetaPlatoCocina({
  plato,
  onEliminar,
  onToggleDisponible,
}: TarjetaPlatoCocinaProps) {
  return (
    <div
      className={`bg-fondo-card rounded-xl border border-borde/60 overflow-hidden shadow-[0_1px_3px_rgba(45,42,38,0.04)] transition-all ${
        !plato.disponible
          ? "opacity-50"
          : "hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)]"
      }`}
    >
      <div className="relative aspect-[16/10] bg-fondo-oscuro overflow-hidden">
        {plato.imagen_url ? (
          <img
            src={plato.imagen_url}
            alt={plato.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
            width="400"
            height="250"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-texto-terciario">
            {ICONOS_POR_TIPO[plato.tipo_plato] || (
              <Utensils className="w-8 h-8" />
            )}
          </div>
        )}
        {!plato.disponible && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs">
              Agotado
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-playfair text-sm font-semibold text-texto leading-tight truncate">
              {plato.nombre}
            </p>
            {plato.descripcion && (
              <p className="text-[11px] text-texto-terciario line-clamp-1 mt-0.5">
                {plato.descripcion}
              </p>
            )}
          </div>
          <button
            onClick={() => onEliminar(plato.id)}
            className="text-texto-terciario hover:text-error transition-colors p-1 shrink-0 ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <Separator className="mb-3" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] font-medium">
              {ETIQUETAS_POR_TIPO[plato.tipo_plato] ?? plato.tipo_plato}
            </Badge>
            <span className="font-playfair text-sm font-bold text-primario tabular-nums">
              {formatearPrecio(plato.precio)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-texto-secundario">
              {plato.disponible ? "Activo" : "Inactivo"}
            </span>
            <Switch
              checked={plato.disponible}
              onCheckedChange={() =>
                onToggleDisponible(plato.id, { disponible: !plato.disponible })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
