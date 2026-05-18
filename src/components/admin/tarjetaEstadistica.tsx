"use client";

import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TarjetaEstadisticaProps {
  icono: ReactNode;
  iconoBg: string;
  iconoColor: string;
  label: string;
  valor: string;
  subtitulo: string;
  tendencia?: { valor: number; positiva: boolean } | null;
}

export function TarjetaEstadistica({
  icono,
  iconoBg,
  iconoColor,
  label,
  valor,
  subtitulo,
  tendencia,
}: TarjetaEstadisticaProps) {
  return (
    <div className="bg-fondo-card rounded-2xl border border-borde/60 p-6 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all group">
      <div className="flex items-start justify-between mb-5">
        <p className="text-sm font-medium text-texto-secundario">{label}</p>
        <div
          className={`w-10 h-10 rounded-xl ${iconoBg} flex items-center justify-center ${iconoColor} group-hover:scale-110 transition-transform`}
        >
          {icono}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <p className="font-playfair text-3xl font-bold text-texto tabular-nums">
          {valor}
        </p>
        {tendencia && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              tendencia.positiva ? "text-exito" : "text-error"
            }`}
          >
            {tendencia.positiva ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {tendencia.valor}%
          </span>
        )}
      </div>
      <p className="text-xs text-texto-terciario">{subtitulo}</p>
    </div>
  );
}
