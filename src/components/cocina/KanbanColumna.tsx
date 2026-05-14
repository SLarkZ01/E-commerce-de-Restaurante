import { ArrowRight, Check, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TarjetaPedidoKanban } from "./TarjetaPedidoKanban";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import type { PedidoConItems } from "@/lib/acciones/cocina";
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
    <Card className="flex-1 min-w-0 md:min-w-[340px] md:max-w-[440px] flex flex-col border-borde/60 shadow-[0_1px_3px_rgba(45,42,38,0.04)] rounded-2xl">
      <CardHeader className={`pb-4 ${config.bgHeader} rounded-t-2xl`}>
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

      <CardContent className="flex-1 p-4">
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
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id}>
                  <TarjetaPedidoKanban pedido={pedido} config={config} />
                  <CardFooter className="pt-3 px-0 pb-0">
                    {estado === "pendiente" && (
                      <Button
                        onClick={() => onCambiarEstado(pedido.id, "preparando")}
                        size="sm"
                        className="w-full bg-primario hover:bg-primario-hover text-primario-texto text-sm font-semibold active:scale-[0.98] h-10"
                      >
                        Iniciar Preparación
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    )}
                    {estado === "preparando" && (
                      <Button
                        onClick={() => onCambiarEstado(pedido.id, "listo")}
                        size="sm"
                        className="w-full bg-exito hover:bg-exito/90 text-white text-sm font-semibold active:scale-[0.98] h-10"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        Marcar Listo
                      </Button>
                    )}
                    {estado === "listo" && (
                      <Button
                        onClick={() => onCambiarEstado(pedido.id, "entregado")}
                        size="sm"
                        variant="outline"
                        className="w-full text-sm font-semibold active:scale-[0.98] h-10"
                      >
                        <PackageCheck className="w-4 h-4 mr-1.5" />
                        Entregar
                      </Button>
                    )}
                  </CardFooter>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
