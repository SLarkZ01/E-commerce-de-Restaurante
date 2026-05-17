"use client";

import { PackageCheck, AlertTriangle, Check, X } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MesaBadge } from "./MesaBadge";
import { PedidoTimer, useUrgencia } from "./PedidoTimer";
import { DishThumbnails } from "./DishThumbnails";
import type { PedidoConDetalles } from "@/types";

interface EntregaCardProps {
  pedido: PedidoConDetalles;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onRequestConfirm: () => void;
}

export function EntregaCard({
  pedido,
  isConfirming,
  onConfirm,
  onCancel,
  onRequestConfirm,
}: EntregaCardProps) {
  const urgente = useUrgencia(pedido.creado_en, 15);
  const mesaNumero = pedido.mesa_numero;

  return (
    <div
      className={`group bg-fondo-card rounded-xl border-2 overflow-hidden shadow-[0_1px_3px_rgba(45,42,38,0.04)] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
        urgente
          ? "border-advertencia/50 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)]"
          : "border-exito/50 hover:shadow-[0_8px_24px_rgba(101,163,13,0.12)]"
      }`}
    >
      {/* Barra de estado superior */}
      <div
        className={`h-1 transition-colors ${
          urgente
            ? "bg-advertencia"
            : "bg-exito"
        }`}
      />

      <div className="p-4">
        {/* Header: Mesa + Timer */}
        <div className="flex items-start justify-between mb-3">
          {mesaNumero ? (
            <MesaBadge numero={mesaNumero} urgente={urgente} />
          ) : (
            <Badge
              className={`text-xs font-semibold ${
                urgente
                  ? "bg-advertencia/10 text-advertencia"
                  : "bg-exito/10 text-exito"
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5 mr-1" />
              Para llevar
            </Badge>
          )}
          <PedidoTimer creadoEn={pedido.creado_en} />
        </div>

        {/* Badge urgente */}
        {urgente && (
          <Badge
            variant="destructive"
            className="text-xs font-semibold animate-pulse mb-3"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Entregar pronto
          </Badge>
        )}

        {/* Lista de platos */}
        <div className="mb-3">
          <DishThumbnails items={pedido.items ?? []} />
        </div>

        <Separator className="mb-3" />

        {/* Total */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-texto-secundario">Total</span>
          <span className="font-playfair text-lg font-bold text-primario tabular-nums">
            {formatearPrecio(pedido.total)}
          </span>
        </div>

        {/* Botón de acción */}
        {isConfirming ? (
          <div className="flex gap-2">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-10 text-sm"
            >
              <X className="w-4 h-4 mr-1.5" />
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 h-10 text-sm bg-exito hover:bg-exito/90 text-white"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Confirmar
            </Button>
          </div>
        ) : (
          <Button
            onClick={onRequestConfirm}
            className="w-full h-11 bg-exito hover:bg-exito/90 text-white rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform shadow-sm shadow-exito/20"
          >
            <PackageCheck className="w-4 h-4 mr-2" />
            Marcar como Entregado
          </Button>
        )}
      </div>
    </div>
  );
}
