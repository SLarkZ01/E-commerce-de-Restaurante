import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
    <div className={`flex-1 min-w-0 md:min-w-[340px] md:max-w-[440px] flex flex-col rounded-2xl overflow-hidden ${config.bgColumna}`}>
      <CardHeader className="pb-4 pt-5 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={config.color}>{config.icon}</span>
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-texto-secundario">
              {config.label}
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={`${config.bg} ${config.color} text-xs font-bold px-2.5 py-1`}
          >
            {pedidos.length}
          </Badge>
        </div>
        <CardDescription className="text-xs mt-1">
          {pedidos.length} {config.desc}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-4">
        <ScrollArea className="pr-2" style={{ maxHeight: "calc(100dvh - 340px)" }}>
          {pedidos.length === 0 ? (
            <EstadoVacio
              elementoIcono={
                <span className={config.color}>{config.icon}</span>
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
        </ScrollArea>
      </CardContent>
    </div>
  );
}
