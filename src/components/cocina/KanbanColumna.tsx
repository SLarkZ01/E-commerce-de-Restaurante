import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TarjetaPedidoKanban } from "./TarjetaPedidoKanban";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import type { PedidoConDetalles } from "@/types";
import type { EstadoKanban, EstadoConfig } from "./configEstados";

interface KanbanColumnaProps {
  estado: EstadoKanban;
  config: EstadoConfig;
  pedidos: PedidoConDetalles[];
  onCambiarEstado: (pedidoId: string, nuevoEstado: string) => void;
}

export function KanbanColumna({
  estado,
  config,
  pedidos,
  onCambiarEstado,
}: KanbanColumnaProps) {
  return (
    <div className={`flex-1 min-w-[280px] sm:min-w-0 flex flex-col rounded-2xl overflow-hidden border border-borde/20 shadow-sm ${config.bgColumna} backdrop-blur-[2px] max-h-[60vh] md:max-h-none`}>
      <CardHeader className="pb-3 pt-3.5 px-5 border-b border-borde/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={config.color}>{config.icon}</span>
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-texto-secundario">
              {config.label}
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={`${config.bg} ${config.color} text-sm font-bold px-3 py-1 rounded-full`}
          >
            {pedidos.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 px-3 pb-3">
        <div className="h-full overflow-y-auto pr-1.5">
          {pedidos.length === 0 ? (
            <EstadoVacio
              elementoIcono={
                <span className={`${config.color} opacity-50`}>{config.icon}</span>
              }
              titulo="Sin pedidos"
              descripcion="Los pedidos aparecerán aquí"
            />
          ) : (
            <div className="space-y-3">
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
        </div>
      </CardContent>
    </div>
  );
}
