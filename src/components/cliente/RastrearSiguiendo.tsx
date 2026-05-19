"use client";

import { Clock, Flame, ChefHat, CircleCheck } from "lucide-react";
import CargandoPedido from "@/components/ui/cargando-pedido";
import type { EstadoPedido } from "@/types";

const ESTADOS: EstadoPedido[] = ["pendiente", "preparando", "listo", "entregado"];

const ICONO_ESTADO: Record<EstadoPedido, typeof Clock> = {
  pendiente: Clock,
  preparando: Flame,
  listo: ChefHat,
  entregado: CircleCheck,
};

const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  pendiente: "Pendiente",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
};

const MENSAJE_ESTADO: Record<EstadoPedido, string> = {
  pendiente:
    "Tu pedido ya se ha registrado pero a\u00fan no se est\u00e1 preparando.",
  preparando:
    "Tu pedido est\u00e1 en preparaci\u00f3n. La cocina ya est\u00e1 trabajando en \u00e9l.",
  listo:
    "Tu pedido est\u00e1 listo. Pronto te lo entregar\u00e1n en la mesa.",
  entregado:
    "Tu pedido ha sido entregado. Disfruta.",
};

const COLOR_BARRA_ESTADO: Record<EstadoPedido, string> = {
  pendiente: "bg-slate-400",
  preparando: "bg-amber-500",
  listo: "bg-emerald-500",
  entregado: "bg-green-600",
};

function StepperProgreso({ estadoActual }: { estadoActual: EstadoPedido }) {
  const indiceActual = ESTADOS.indexOf(estadoActual);

  return (
    <div className="flex items-center gap-1">
      {ESTADOS.map((estado, idx) => {
        const Icono = ICONO_ESTADO[estado];
        const completado = idx < indiceActual;
        const activo = idx === indiceActual;

        return (
          <div key={estado} className="flex items-center gap-1 flex-1 last:flex-none">
            <div
              className={`flex flex-col items-center gap-1 transition-all ${
                completado || activo ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  completado
                    ? "bg-green-100 border-green-300"
                    : activo
                    ? "bg-white border-2 shadow-md scale-110"
                    : "bg-white border-slate-200"
                }`}
                style={
                  activo
                    ? { borderColor: "var(--color-primario, #c44536)" }
                    : undefined
                }
              >
                <Icono
                  className={`w-4 h-4 ${
                    completado
                      ? "text-green-600"
                      : activo
                      ? "text-primario"
                      : "text-slate-400"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  activo ? "text-texto" : "text-texto-terciario"
                }`}
              >
                {ETIQUETA_ESTADO[estado]}
              </span>
            </div>
            {idx < ESTADOS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mt-[-16px] rounded-full transition-all ${
                  idx < indiceActual ? COLOR_BARRA_ESTADO[estado] : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface RastrearSiguiendoProps {
  estadoActual: EstadoPedido;
}

export function RastrearSiguiendo({ estadoActual }: RastrearSiguiendoProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center py-2">
        <div style={{ fontSize: "7px" }}>
          <CargandoPedido />
        </div>
      </div>

      <StepperProgreso estadoActual={estadoActual} />

      <p className="text-xs text-texto-secundario text-center leading-relaxed bg-fondo-oscuro/20 rounded-lg px-3 py-2 transition-all">
        {MENSAJE_ESTADO[estadoActual]}
      </p>
    </div>
  );
}
