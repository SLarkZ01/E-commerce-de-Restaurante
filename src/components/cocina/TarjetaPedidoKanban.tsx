"use client";

import { ArrowRight, Check, PackageCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatearPrecio } from "@/lib/formato";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import type { PedidoConItems } from "@/types";
import type { EstadoKanban, EstadoConfig } from "./configEstados";
import { useTiempoTranscurrido } from "@/hooks/useTiempoTranscurrido";

interface TarjetaPedidoKanbanProps {
  pedido: PedidoConItems;
  config: EstadoConfig;
  estado: EstadoKanban;
  onCambiarEstado: (pedidoId: string, nuevoEstado: string) => void;
}

export function TarjetaPedidoKanban({
  pedido,
  config,
  estado,
  onCambiarEstado,
}: TarjetaPedidoKanbanProps) {
  const { formatear, esUrgente } = useTiempoTranscurrido();
  const urgente = esUrgente(pedido.creado_en, 10);

  const renderBotonAccion = () => {
    if (estado === "pendiente") {
      return (
        <Button
          onClick={() => onCambiarEstado(pedido.id, "preparando")}
          size="sm"
          className="w-full bg-primario hover:bg-primario-hover text-primario-texto text-sm font-medium active:scale-[0.98] h-9"
        >
          Iniciar Preparación
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      );
    }
    if (estado === "preparando") {
      return (
        <Button
          onClick={() => onCambiarEstado(pedido.id, "listo")}
          size="sm"
          className="w-full bg-exito hover:bg-exito/90 text-white text-sm font-medium active:scale-[0.98] h-9"
        >
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Marcar Listo
        </Button>
      );
    }
    if (estado === "listo") {
      return (
        <Button
          onClick={() => onCambiarEstado(pedido.id, "entregado")}
          size="sm"
          variant="outline"
          className="w-full text-sm font-medium active:scale-[0.98] h-9 border-borde/80 hover:bg-fondo-oscuro text-texto"
        >
          <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
          Entregar
        </Button>
      );
    }
    return null;
  };

  const barraColor = config.border.replace("border-l-", "bg-");

  return (
    <Card className="bg-fondo-card border border-borde/40 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
      <div className={`h-0.5 w-full ${barraColor}`} />
      <CardHeader className="pb-2 pt-3 px-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-medium text-texto-terciario uppercase tracking-wider">Mesa</span>
            <CardTitle className="font-playfair text-base font-semibold text-texto leading-none">
              #{pedido.mesa_id ? pedido.mesa_id.slice(0, 4) : "?"}
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={`${config.bg} ${config.color} text-[10px] font-medium px-2 py-0 shrink-0`}
          >
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Timer
            className={`w-3 h-3 ${urgente ? "text-error" : "text-texto-terciario"}`}
          />
          <span
            className={`text-xs ${urgente ? "text-error font-medium" : "text-texto-terciario"}`}
          >
            {formatear(pedido.creado_en)}
          </span>
          {urgente && (
            <span className="text-[10px] font-semibold text-error bg-error/10 px-1.5 py-0.5 rounded-md ml-0.5">
              Urgente
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2 px-3.5">
        <div className="space-y-1 mb-2.5">
          {pedido.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primario font-semibold text-xs tabular-nums mt-0.5 shrink-0 w-5 text-right">
                {item.cantidad}x
              </span>
              <span className="text-texto font-medium leading-snug">{item.plato_nombre}</span>
            </div>
          ))}
        </div>
        <Separator className="bg-borde/40" />
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-xs text-texto-terciario font-medium">Total</span>
          <span className="font-playfair text-sm font-semibold text-texto tabular-nums">
            {formatearPrecio(pedido.total)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-3.5 pb-3 pt-1.5">
        {renderBotonAccion()}
      </CardFooter>
    </Card>
  );
}
