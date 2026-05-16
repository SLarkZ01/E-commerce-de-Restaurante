"use client";

import { Trash2, Utensils, Coffee, Package, Check, Pencil } from "lucide-react";
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
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out ${
        !plato.disponible
          ? "opacity-50 shadow-sm"
          : "shadow-[0_2px_8px_rgba(45,42,38,0.04)] hover:shadow-[0_12px_40px_rgba(45,42,38,0.10)] hover:-translate-y-1"
      }`}
    >
      {/* Área de imagen premium */}
      <div className="relative px-4 pt-4 pb-0">
        {/* Fila superior: check + eliminar */}
        <div className="flex items-center justify-between mb-3 px-1">
          {/* Check premium */}
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-xl border-2 transition-all duration-300 ${
              plato.disponible
                ? "bg-gradient-to-br from-[#C44536] to-[#D4564A] border-transparent shadow-md shadow-[#C44536]/25"
                : "bg-white border-[#E7E0D8]"
            }`}
          >
            {plato.disponible && (
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            )}
          </div>

          {/* Botón eliminar */}
          <button
            onClick={() => onEliminar(plato.id)}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-[#A8A29E] hover:text-[#DC2626] hover:bg-[#DC2626]/8 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Eliminar plato"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Contenedor de imagen con gradiente sutil */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E0]">
          {plato.imagen_url ? (
            <>
              <img
                src={plato.imagen_url}
                alt={plato.nombre}
                className="w-full h-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                width="400"
                height="300"
              />
              {/* Gradiente overlay sutil en hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#D4CFC8]">
              {ICONOS_POR_TIPO[plato.tipo_plato] || (
                <Utensils className="w-14 h-14" />
              )}
            </div>
          )}

          {/* Badge "Agotado" premium */}
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
          <h3 className="font-playfair text-[17px] font-bold text-[#2D2A26] leading-snug tracking-tight truncate">
            {plato.nombre}
          </h3>
          {plato.descripcion && (
            <p className="text-[13px] text-[#A8A29E] line-clamp-2 mt-2 leading-relaxed font-medium">
              {plato.descripcion}
            </p>
          )}
        </div>

        {/* Categoría pill premium */}
        <div className="mt-4 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#F5F0EB] to-[#EDE8E0] text-[#78716C] border border-[#E7E0D8]/50">
            {ETIQUETAS_POR_TIPO[plato.tipo_plato] ?? plato.tipo_plato}
          </span>
        </div>

        {/* Footer premium: precio + acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F5F0EB]">
          {/* Precio con estilo premium */}
          <div>
            <p className="font-playfair text-2xl font-bold bg-gradient-to-r from-[#C44536] to-[#D4564A] bg-clip-text text-transparent tabular-nums leading-none tracking-tight">
              {formatearPrecio(plato.precio)}
            </p>
          </div>

          {/* Acciones: switch + botón */}
          <div className="flex items-center gap-3">
            {/* Switch premium */}
            <div className="flex items-center gap-2.5">
              <Switch
                checked={plato.disponible}
                onCheckedChange={() =>
                  onToggleDisponible(plato.id, { disponible: !plato.disponible })
                }
                className="data-[state=checked]:bg-[#C44536] h-5 w-10 transition-all duration-300"
              />
              <span className={`text-[11px] font-bold uppercase tracking-wider leading-none ${
                plato.disponible ? "text-[#65A30D]" : "text-[#A8A29E]"
              }`}>
                {plato.disponible ? "Activo" : "Inactivo"}
              </span>
            </div>

            {/* Botón editar premium */}
            <button
              onClick={() => onEliminar(plato.id)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F5F0EB] text-[#78716C] hover:bg-gradient-to-br hover:from-[#C44536] hover:to-[#D4564A] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#C44536]/20 active:scale-95"
              aria-label="Editar plato"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
