import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
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
    <div className={`flex flex-col h-full rounded-2xl overflow-hidden border border-borde/20 shadow-sm ${config.bgColumna} backdrop-blur-[2px] md:min-w-0`}>
      <div className={`sticky top-0 z-10 px-5 py-3.5 border-b border-borde/20 ${config.bgHeader}`}>
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
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
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
    </div>
  );
}
