"use client";

import { memo } from "react";
import { Trash2, Utensils, Coffee, Package, EyeOff } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { Switch } from "@/components/ui/switch";
import type { Plato } from "@/types";

const ICONOS_POR_TIPO: Record<string, React.ReactNode> = {
  plato_fuerte: <Utensils className="w-10 h-10" />,
  bebida: <Coffee className="w-10 h-10" />,
  combo: <Package className="w-10 h-10" />,
};

const ETIQUETAS_POR_TIPO: Record<string, string> = {
  plato_fuerte: "Plato Fuerte",
  bebida: "Bebida",
  combo: "Combo",
};

const TIPO_STYLES: Record<string, { 
  bg: string; 
  text: string; 
  border: string;
  cardBorder: string;
  cardHover: string;
}> = {
  plato_fuerte: { 
    bg: "bg-acento/15", 
    text: "text-acento", 
    border: "border-acento/30",
    cardBorder: "border-acento/40",
    cardHover: "hover:shadow-[0_4px_16px_rgba(196,69,54,0.08)] hover:border-acento/60",
  },
  bebida: { 
    bg: "bg-info/10", 
    text: "text-info", 
    border: "border-info/30",
    cardBorder: "border-info/40",
    cardHover: "hover:shadow-[0_4px_16px_rgba(59,130,246,0.08)] hover:border-info/60",
  },
  combo: { 
    bg: "bg-exito/10", 
    text: "text-exito", 
    border: "border-exito/30",
    cardBorder: "border-exito/40",
    cardHover: "hover:shadow-[0_4px_16px_rgba(101,163,13,0.08)] hover:border-exito/60",
  },
};

interface TarjetaPlatoCocinaProps {
  plato: Plato;
  onEliminar: (id: string) => void;
  onToggleDisponible: (id: string, datos: { disponible: boolean }) => void;
}

export const TarjetaPlatoCocina = memo(function TarjetaPlatoCocina({
  plato,
  onEliminar,
  onToggleDisponible,
}: TarjetaPlatoCocinaProps) {
  const tipo = TIPO_STYLES[plato.tipo_plato] || TIPO_STYLES.plato_fuerte;

  return (
    <div
      className={`group flex flex-col bg-fondo-card rounded-xl overflow-hidden border transition-all duration-300 ${
        !plato.disponible
          ? "border-borde/30 shadow-none opacity-60"
          : `border-borde/50 ${tipo.cardBorder} ${tipo.cardHover} shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-lg hover:-translate-y-0.5`
      }`}
    >
      {/* Imagen con fondo blanco, ratio 16/10 */}
      <div className="relative aspect-[16/10] bg-white overflow-hidden">
        {plato.imagen_url ? (
          <img
            src={plato.imagen_url}
            alt={plato.nombre}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            width="320"
            height="200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-texto-terciario/30">
            {ICONOS_POR_TIPO[plato.tipo_plato] || <Utensils className="w-10 h-10" />}
          </div>
        )}

        {/* Overlay de agotado */}
        {!plato.disponible && (
          <div className="absolute inset-0 bg-fondo/50 flex items-center justify-center backdrop-blur-[2px]">
            <div className="flex items-center gap-1.5 bg-error/90 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              <EyeOff className="w-3 h-3" />
              Agotado
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 pt-3">
        {/* Título + Precio */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-playfair text-[15px] font-bold text-texto leading-snug tracking-tight line-clamp-1 flex-1 pt-0.5">
            {plato.nombre}
          </h3>
          <div className="flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg bg-fondo-oscuro">
            <span className="font-playfair text-lg font-extrabold text-primario tabular-nums leading-none">
              {formatearPrecio(plato.precio)}
            </span>
          </div>
        </div>

        {/* Descripción */}
        {plato.descripcion && (
          <p className="text-xs text-texto-secundario line-clamp-1 leading-relaxed mb-2">
            {plato.descripcion}
          </p>
        )}

        {/* Badge de tipo — aquí en el body, legible siempre */}
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tipo.bg} ${tipo.text} border ${tipo.border}`}>
            {ETIQUETAS_POR_TIPO[plato.tipo_plato] ?? plato.tipo_plato}
          </span>
        </div>

        {/* Footer: switch + eliminar */}
        <div className="flex items-center justify-between pt-3 border-t border-borde/30 mt-auto">
          <div className="flex items-center gap-2">
            <Switch
              checked={plato.disponible}
              onCheckedChange={() =>
                onToggleDisponible(plato.id, { disponible: !plato.disponible })
              }
              className={`h-[18px] w-8 transition-all duration-200 ${
                plato.disponible ? "bg-primario" : "bg-borde"
              }`}
            />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${
              plato.disponible ? "text-texto-secundario" : "text-texto-terciario"
            }`}>
              {plato.disponible ? "En carta" : "Agotado"}
            </span>
          </div>

          <button
            onClick={() => onEliminar(plato.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-texto-terciario hover:text-error hover:bg-error/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Eliminar plato"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
