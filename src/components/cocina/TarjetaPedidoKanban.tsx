"use client";

import { ArrowRight, Check, PackageCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatearPrecio } from "@/lib/formato";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MesaBadge } from "@/components/compartidos/MesaBadge";
import { DishThumbnails } from "@/components/compartidos/DishThumbnails";
import { useTiempoTranscurrido } from "@/hooks/useTiempoTranscurrido";
import type { PedidoConDetalles } from "@/types";
import type { EstadoKanban, EstadoConfig } from "./configEstados";

interface TarjetaPedidoKanbanProps {
  pedido: PedidoConDetalles;
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
  const barraColor = config.border.replace("border-l-", "bg-");
  const mesaNumero = pedido.mesa_numero;

  const renderBotonAccion = () => {
    if (estado === "pendiente") {
      return (
        <Button
          onClick={() => onCambiarEstado(pedido.id, "preparando")}
          size="sm"
          className="w-full bg-primario hover:bg-primario-hover text-primario-texto text-sm font-semibold active:scale-[0.98] h-10 shadow-sm shadow-primario/20"
        >
          Iniciar Preparación
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      );
    }
    if (estado === "preparando") {
      return (
        <Button
          onClick={() => onCambiarEstado(pedido.id, "listo")}
          size="sm"
          className="w-full bg-exito hover:bg-exito/90 text-white text-sm font-semibold active:scale-[0.98] h-10 shadow-sm shadow-exito/20"
        >
          <Check className="w-4 h-4 mr-1.5" />
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
          className="w-full text-sm font-semibold active:scale-[0.98] h-10 border-exito/30 text-exito hover:bg-exito/5 hover:border-exito/50"
        >
          <PackageCheck className="w-4 h-4 mr-1.5" />
          Entregar
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="group bg-fondo-card border border-borde/30 shadow-[0_2px_8px_rgba(45,42,38,0.04)] hover:shadow-[0_8px_30px_rgba(45,42,38,0.08)] sm:hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden">
      <div className={`h-1 sm:h-1.5 w-full ${barraColor}`} />
      <CardHeader className="pb-2 pt-2.5 sm:pt-3 px-3 sm:px-4">
        <div className="flex items-center justify-between gap-2">
          {mesaNumero ? (
            <MesaBadge numero={mesaNumero} urgente={urgente} />
          ) : (
            <Badge className="bg-fondo-oscuro text-texto-secundario text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5">
              Para llevar
            </Badge>
          )}
          <Badge
            variant="secondary"
            className={`${config.bg} ${config.color} text-xs font-semibold px-2 sm:px-2.5 py-1 shrink-0`}
          >
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
          <Timer
            className={`w-3.5 h-3.5 ${urgente ? "text-error animate-pulse" : "text-texto-terciario"}`}
          />
          <span
            className={`text-xs ${urgente ? "text-error font-semibold" : "text-texto-terciario"}`}
          >
            {formatear(pedido.creado_en)}
          </span>
          {urgente && (
            <span className="text-[10px] font-bold text-error bg-error/10 px-1.5 sm:px-2 py-0.5 rounded-md ml-1 ring-1 ring-error/20 animate-pulse">
              Urgente
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2 px-3 sm:px-4">
        <div className="bg-fondo-oscuro/30 rounded-xl p-2 sm:p-2.5">
          <DishThumbnails items={pedido.items ?? []} />
        </div>
        <Separator className="bg-borde/30 my-2 sm:my-3" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-texto-terciario font-medium">Total</span>
          <span className="font-playfair text-sm sm:text-base font-bold text-primario tabular-nums">
            {formatearPrecio(pedido.total)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-3 sm:px-4 pb-2.5 sm:pb-3 pt-1 sm:pt-1.5">
        {renderBotonAccion()}
      </CardFooter>
    </Card>
  );
}
