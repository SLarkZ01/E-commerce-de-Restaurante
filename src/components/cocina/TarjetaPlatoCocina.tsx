"use client";

import { memo } from "react";
import { Trash2, Utensils, Coffee, Package, Check, Eye } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { Switch } from "@/components/ui/switch";
import type { Plato } from "@/types";

const ICONOS_POR_TIPO: Record<string, React.ReactNode> = {
  plato_fuerte: <Utensils className="w-14 h-14" />,
  bebida: <Coffee className="w-14 h-14" />,
  combo: <Package className="w-14 h-14" />,
};

const ETIQUETAS_POR_TIPO: Record<string, string> = {
  plato_fuerte: "Plato Fuerte",
  bebida: "Bebida",
  combo: "Combo",
};

const BADGE_STYLES: Record<string, { bg: string; text: string; border: string; cardTint: string }> = {
  plato_fuerte: { bg: "bg-acento/15", text: "text-acento", border: "border-acento/30", cardTint: "hover:border-acento/40" },
  bebida: { bg: "bg-info/10", text: "text-info", border: "border-info/30", cardTint: "hover:border-info/40" },
  combo: { bg: "bg-exito/10", text: "text-exito", border: "border-exito/30", cardTint: "hover:border-exito/40" },
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
  const badge = BADGE_STYLES[plato.tipo_plato] || BADGE_STYLES.plato_fuerte;

  return (
    <div
      className={`group flex flex-col bg-fondo-card rounded-xl overflow-hidden border transition-all duration-300 ${
        !plato.disponible
          ? "border-borde/40 shadow-sm opacity-75"
          : `border-borde/50 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] hover:-translate-y-0.5 ${badge.cardTint}`
      }`}
    >
      <div className="relative px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="relative">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-300 ${
                plato.disponible
                  ? "bg-primario/10 border-primario/20"
                  : "bg-fondo-oscuro border-borde/40"
              }`}
            >
              {plato.disponible && (
                <Check className="w-3.5 h-3.5 text-primario" strokeWidth={3} />
              )}
            </div>
            {plato.disponible && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-exito opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-exito" />
              </span>
            )}
          </div>

          <button
            onClick={() => onEliminar(plato.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-texto-terciario hover:text-error hover:bg-error/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Eliminar plato"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-fondo-oscuro">
          {plato.imagen_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={plato.imagen_url}
                alt={plato.nombre}
                className="w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-105"
                loading="lazy"
                width="400"
                height="300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                <div className="flex items-center gap-1.5 bg-fondo-card/90 backdrop-blur-sm text-texto text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-sm border border-borde/30">
                  <Eye className="w-3 h-3" />
                  <span>Ver detalles</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-texto-terciario/40">
              {ICONOS_POR_TIPO[plato.tipo_plato] || (
                <Utensils className="w-14 h-14" />
              )}
            </div>
          )}

          {!plato.disponible && (
            <div className="absolute inset-0 bg-fondo/60 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-error text-primario-texto text-[11px] font-bold px-4 py-1.5 rounded-full tracking-wider shadow-sm uppercase">
                Agotado
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 pt-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair text-base font-bold text-texto leading-snug tracking-tight truncate">
            {plato.nombre}
          </h3>
          {plato.descripcion && (
            <div className="mt-2 pl-2.5 border-l-2 border-borde/40">
              <p className="text-xs text-texto-secundario line-clamp-2 leading-relaxed italic">
                {plato.descripcion}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border ${badge.border}`}>
            {ETIQUETAS_POR_TIPO[plato.tipo_plato] ?? plato.tipo_plato}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-borde/30">
          <p className="font-playfair text-xl font-extrabold text-primario tabular-nums leading-none tracking-tight">
            {formatearPrecio(plato.precio)}
          </p>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <Switch
                checked={plato.disponible}
                onCheckedChange={() =>
                  onToggleDisponible(plato.id, { disponible: !plato.disponible })
                }
                className={`h-5 w-9 transition-all duration-300 ${
                  plato.disponible
                    ? "bg-primario"
                    : "bg-borde"
                }`}
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider leading-none ${
                plato.disponible ? "text-exito" : "text-texto-terciario"
              }`}>
                {plato.disponible ? "Activo" : "Inactivo"}
              </span>
            </div>

            <button
              onClick={() => onEliminar(plato.id)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-error/10 text-error hover:bg-error hover:text-primario-texto transition-all duration-200 active:scale-95"
              aria-label="Eliminar plato"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
