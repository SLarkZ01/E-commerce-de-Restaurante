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
          className="w-full bg-primario hover:bg-primario-hover text-primario-texto text-sm font-semibold active:scale-[0.98] h-10 rounded-xl"
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
          className="w-full bg-exito hover:bg-exito/90 text-white text-sm font-semibold active:scale-[0.98] h-10 rounded-xl"
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
          className="w-full text-sm font-semibold active:scale-[0.98] h-10 rounded-xl border-borde hover:bg-fondo-oscuro"
        >
          <PackageCheck className="w-4 h-4 mr-1.5" />
          Entregar
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="bg-fondo-card border-0 shadow-[0_1px_3px_rgba(45,42,38,0.06)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.1)] transition-all rounded-2xl overflow-hidden">
      <div className={`h-1 w-full ${config.border.replace("border-l-", "bg-")}`} />
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-playfair text-lg font-bold text-texto">
            Mesa {pedido.mesa_id ? `#${pedido.mesa_id.slice(0, 4)}` : "?"}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`${config.bg} ${config.color} text-[10px] font-semibold px-2 py-0.5`}
          >
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Timer
            className={`w-3.5 h-3.5 ${urgente ? "text-advertencia animate-pulse" : "text-texto-terciario"}`}
          />
          <span
            className={`text-xs ${urgente ? "text-advertencia font-semibold" : "text-texto-terciario"}`}
          >
            {formatear(pedido.creado_en)}
          </span>
          {urgente && (
            <Badge variant="destructive" className="text-[10px] font-semibold px-1.5 py-0 ml-1 animate-pulse">
              Urgente
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2 px-4">
        <div className="space-y-1.5 mb-3">
          {pedido.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-texto font-medium">
                <span className="text-primario font-bold mr-2">{item.cantidad}x</span>
                {item.plato_nombre}
              </span>
            </div>
          ))}
        </div>
        <Separator className="bg-borde/50" />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-texto-secundario font-medium">Total</span>
          <span className="font-playfair text-base font-bold text-primario tabular-nums">
            {formatearPrecio(pedido.total)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-2">
        {renderBotonAccion()}
      </CardFooter>
    </Card>
  );
}
