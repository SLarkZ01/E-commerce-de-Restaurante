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
  plato_fuerte: { bg: "bg-[#FFF3E0]", text: "text-[#E65100]", border: "border-[#FFE0B2]", cardTint: "hover:border-[#FFE0B2]" },
  bebida: { bg: "bg-[#E3F2FD]", text: "text-[#1565C0]", border: "border-[#BBDEFB]", cardTint: "hover:border-[#BBDEFB]" },
  combo: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#C8E6C9]", cardTint: "hover:border-[#C8E6C9]" },
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
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-500 ease-out ${
        !plato.disponible
          ? "border-[#AAAAAA] shadow-sm grayscale"
          : `border-[#C0C0C0] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] hover:-translate-y-[4px] ${badge.cardTint}`
      }`}
    >
      {/* Área de imagen */}
      <div className="relative px-4 pt-4 pb-0">
        {/* Fila superior: check pulsante + eliminar */}
        <div className="flex items-center justify-between mb-3 px-1">
          {/* Check con badge pulsante */}
          <div className="relative">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-xl border-2 transition-all duration-300 ${
                plato.disponible
                  ? "bg-gradient-to-br from-[#E8472A] to-[#FF6B35] border-transparent shadow-md shadow-[#E8472A]/25"
                  : "bg-white border-[#E2E8F0]"
              }`}
            >
              {plato.disponible && (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              )}
            </div>
            {/* Led pulsante para disponible */}
            {plato.disponible && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]" />
              </span>
            )}
          </div>

          {/* Botón eliminar hover */}
          <button
            onClick={() => onEliminar(plato.id)}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#DC2626]/8 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Eliminar plato"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Contenedor de imagen con hover "Ver detalles" */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F8F9FC] to-[#F1F3F8]">
          {plato.imagen_url ? (
            <>
              <img
                src={plato.imagen_url}
                alt={plato.nombre}
                className="w-full h-full object-contain p-5 transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-95"
                loading="lazy"
                width="400"
                height="300"
              />
              {/* Overlay hover con "Ver detalles" */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#1A1A2E] text-xs font-semibold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver detalles</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#D1D5DB]">
              {ICONOS_POR_TIPO[plato.tipo_plato] || (
                <Utensils className="w-14 h-14" />
              )}
            </div>
          )}

          {/* Badge "Agotado" */}
          {!plato.disponible && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white text-[11px] font-bold px-5 py-2 rounded-full tracking-wider shadow-lg shadow-[#DC2626]/20 uppercase">
                Agotado
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        {/* Nombre y descripción */}
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair text-[17px] font-bold text-[#1A1A2E] leading-snug tracking-tight truncate">
            {plato.nombre}
          </h3>
          {plato.descripcion && (
            <div className="mt-3 pl-3 border-l-2 border-[#E2E8F0]">
              <p className="text-[13px] text-[#78716C] line-clamp-2 leading-relaxed italic font-medium">
                {plato.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Badge de categoría con color por tipo */}
        <div className="mt-4 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border ${badge.border}`}>
            {ETIQUETAS_POR_TIPO[plato.tipo_plato] ?? plato.tipo_plato}
          </span>
        </div>

        {/* Footer: precio + acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
          {/* Precio destacado */}
          <p className="font-playfair text-[28px] font-extrabold bg-gradient-to-r from-[#E8472A] to-[#FF6B35] bg-clip-text text-transparent tabular-nums leading-none tracking-tight drop-shadow-sm">
            {formatearPrecio(plato.precio)}
          </p>

          {/* Acciones: switch + basurita */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Switch
                checked={plato.disponible}
                onCheckedChange={() =>
                  onToggleDisponible(plato.id, { disponible: !plato.disponible })
                }
                className={`h-5 w-10 transition-all duration-300 ${
                  plato.disponible
                    ? "bg-[#E8472A]"
                    : "bg-[#9CA3AF]"
                }`}
              />
              <span className={`text-[11px] font-bold uppercase tracking-wider leading-none ${
                plato.disponible ? "text-[#16A34A]" : "text-[#6B7280]"
              }`}>
                {plato.disponible ? "Activo" : "Inactivo"}
              </span>
            </div>

            {/* Botón basurita en footer */}
            <button
              onClick={() => onEliminar(plato.id)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FFF3E0] text-[#E8472A] hover:bg-[#DC2626] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#DC2626]/20 active:scale-95"
              aria-label="Eliminar plato"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
