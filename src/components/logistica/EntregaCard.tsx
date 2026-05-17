"use client";

import { memo } from "react";
import { PackageCheck, Check, X } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MesaBadge } from "@/components/compartidos/MesaBadge";
import { PedidoTimer, useUrgencia } from "./PedidoTimer";
import { DishThumbnails } from "@/components/compartidos/DishThumbnails";
import type { PedidoConDetalles } from "@/types";

interface EntregaCardProps {
  pedido: PedidoConDetalles;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onRequestConfirm: () => void;
}

export const EntregaCard = memo(function EntregaCard({
  pedido,
  isConfirming,
  onConfirm,
  onCancel,
  onRequestConfirm,
}: EntregaCardProps) {
  const urgente = useUrgencia(pedido.creado_en, 15);
  const mesaNumero = pedido.mesa_numero;

  return (
    <div className="group relative bg-fondo-card rounded-xl border border-borde/30 overflow-hidden shadow-[0_1px_2px_rgba(45,42,38,0.04)] transition-all duration-200 hover:shadow-md hover:-translate-y-px">
      {/* Barra lateral de estado — metáfora de ticket/comanda */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] ${
          urgente ? "bg-advertencia" : "bg-exito"
        }`}
      />

      <div className="p-4 pl-5">
        {/* Header: Mesa + Timer */}
        <div className="flex items-start justify-between mb-3">
          {mesaNumero ? (
            <MesaBadge numero={mesaNumero} urgente={urgente} />
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-fondo-oscuro text-texto-secundario">
              <PackageCheck className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Para llevar</span>
            </div>
          )}
          <PedidoTimer creadoEn={pedido.creado_en} />
        </div>

        {/* Indicador de urgencia sutil */}
        {urgente && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-advertencia" />
            <span className="text-xs font-medium text-advertencia">
              Entregar pronto
            </span>
          </div>
        )}

        {/* Lista de platos */}
        <div className="mb-4">
          <DishThumbnails items={pedido.items ?? []} />
        </div>

        <Separator className="bg-borde/40 mb-4" />

        {/* Footer: Total + Acción */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-texto-terciario mb-0.5">
              Total
            </span>
            <span className="font-playfair text-xl font-bold text-texto tabular-nums">
              {formatearPrecio(pedido.total)}
            </span>
          </div>

          {isConfirming ? (
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={onCancel}
                variant="outline"
                size="sm"
                className="h-9 text-xs border-borde/60 hover:bg-fondo-oscuro"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Cancelar
              </Button>
              <Button
                onClick={onConfirm}
                size="sm"
                className="h-9 text-xs bg-exito hover:bg-exito/90 text-white"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Confirmar
              </Button>
            </div>
          ) : (
            <Button
              onClick={onRequestConfirm}
              size="sm"
              className="h-9 px-4 bg-exito/90 hover:bg-exito text-white rounded-lg font-medium text-xs transition-colors shadow-sm shadow-exito/10"
            >
              <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
              Entregar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
