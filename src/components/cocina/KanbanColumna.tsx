import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TarjetaPedidoKanban } from "./TarjetaPedidoKanban";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import type { PedidoConItems } from "@/types";
import type { EstadoKanban, EstadoConfig } from "./configEstados";

interface KanbanColumnaProps {
  estado: EstadoKanban;
  config: EstadoConfig;
  pedidos: PedidoConItems[];
  onCambiarEstado: (pedidoId: string, nuevoEstado: string) => void;
}

export function KanbanColumna({
  estado,
  config,
  pedidos,
  onCambiarEstado,
}: KanbanColumnaProps) {
  return (
    <div className={`flex-1 min-w-0 flex flex-col rounded-xl overflow-hidden border border-borde/30 ${config.bgColumna}`}>
      <CardHeader className="pb-3 pt-3.5 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={config.color}>{config.icon}</span>
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-texto-secundario">
              {config.label}
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={`${config.bg} ${config.color} text-xs font-semibold px-2 py-0.5`}
          >
            {pedidos.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-3 pb-3">
        <ScrollArea className="pr-1.5" style={{ maxHeight: "calc(100dvh - 280px)" }}>
          {pedidos.length === 0 ? (
            <EstadoVacio
              elementoIcono={
                <span className={config.color}>{config.icon}</span>
              }
              titulo="Sin pedidos"
              descripcion="Los pedidos aparecerán aquí"
            />
          ) : (
            <div className="space-y-2.5">
              {pedidos.map((pedido) => (
                <TarjetaPedidoKanban
                  key={pedido.id}
                  pedido={pedido}
                  config={config}
                  estado={estado}
                  onCambiarEstado={onCambiarEstado}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </div>
  );
}
