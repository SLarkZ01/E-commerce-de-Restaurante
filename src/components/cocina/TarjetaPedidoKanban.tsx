import { Timer } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PedidoConItems } from "@/types";
import type { EstadoConfig } from "./configEstados";
import { useTiempoTranscurrido } from "@/hooks/useTiempoTranscurrido";

interface TarjetaPedidoKanbanProps {
  pedido: PedidoConItems;
  config: EstadoConfig;
}

export function TarjetaPedidoKanban({ pedido, config }: TarjetaPedidoKanbanProps) {
  const { formatear, esUrgente } = useTiempoTranscurrido();
  const urgente = esUrgente(pedido.creado_en, 10);

  return (
    <Card
      className={`border-borde/60 border-l-4 ${config.border} shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all rounded-xl`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-playfair text-xl font-bold text-texto">
            Mesa {pedido.mesa_id ? `#${pedido.mesa_id.slice(0, 4)}` : "?"}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`${config.bg} ${config.color} text-[10px] font-semibold`}
          >
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Timer
            className={`w-4 h-4 ${urgente ? "text-advertencia animate-pulse" : "text-texto-terciario"}`}
          />
          <span
            className={`text-sm ${urgente ? "text-advertencia font-semibold" : "text-texto-terciario"}`}
          >
            {formatear(pedido.creado_en)}
          </span>
          {urgente && (
            <Badge variant="destructive" className="text-[10px] font-semibold ml-1 animate-pulse">
              Urgente
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2 mb-4">
          {pedido.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-texto font-medium">
                <span className="text-primario font-bold mr-2">{item.cantidad}x</span>
                {item.plato_nombre}
              </span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-texto-secundario">Total</span>
          <span className="font-playfair text-lg font-bold text-primario tabular-nums">
            {formatearPrecio(pedido.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
