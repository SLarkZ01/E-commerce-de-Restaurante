"use client";

import { Clock, PackageCheck, AlertTriangle, Check, X } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { useTiempoTranscurrido } from "@/hooks/useTiempoTranscurrido";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  const { formatear, esUrgente } = useTiempoTranscurrido();
  const urgente = esUrgente(pedido.creado_en, 15);
  const totalPlatos = pedido.items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div
      className={`bg-fondo-card rounded-xl border-2 overflow-hidden shadow-[0_1px_3px_rgba(45,42,38,0.04)] transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
        urgente
          ? "border-advertencia/50 hover:shadow-[0_4px_16px_rgba(245,158,11,0.15)]"
          : "border-exito/50 hover:shadow-[0_4px_16px_rgba(101,163,13,0.15)]"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2.5">
          <Badge
            className={`text-xs font-semibold ${
              urgente
                ? "bg-advertencia/10 text-advertencia"
                : "bg-exito/10 text-exito"
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5 mr-1" />
            Listo
          </Badge>
          <div className="flex items-center gap-1.5">
            <Clock
              className={`w-3.5 h-3.5 ${
                urgente
                  ? "text-advertencia animate-pulse"
                  : "text-texto-terciario"
              }`}
            />
            <span
              className={`text-xs ${
                urgente
                  ? "text-advertencia font-semibold"
                  : "text-texto-terciario"
              }`}
            >
              {formatear(pedido.creado_en)}
            </span>
          </div>
        </div>

        {urgente && (
          <Badge
            variant="destructive"
            className="text-xs font-semibold animate-pulse mb-2.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Entregar pronto
          </Badge>
        )}

        <p className="font-playfair text-xl font-bold text-texto mb-2">
          Mesa {pedido.mesa_id ?? "?"}
        </p>

        <div className="flex items-center justify-between mb-2.5">
          <DishThumbnails items={pedido.items} />
          <span className="text-xs text-texto-secundario font-medium ml-2">
            {totalPlatos} {totalPlatos === 1 ? "plato" : "platos"}
          </span>
        </div>

        <Separator className="mb-2.5" />

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-texto-secundario">Total</span>
          <span className="font-playfair text-base font-bold text-primario tabular-nums">
            {formatearPrecio(pedido.total)}
          </span>
        </div>

        {isConfirming ? (
          <div className="flex gap-2">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-9 text-sm"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 h-9 text-sm bg-exito hover:bg-exito/90 text-white"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Confirmar
            </Button>
          </div>
        ) : (
          <Button
            onClick={onRequestConfirm}
            className="w-full h-10 bg-exito hover:bg-exito/90 text-white rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            <PackageCheck className="w-4 h-4 mr-2" />
            Marcar como Entregado
          </Button>
        )}
      </div>
    </div>
  );
}
