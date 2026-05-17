import { PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PanelHeaderProps {
  totalPedidos: number;
  urgentes: number;
}

export function PanelHeader({ totalPedidos, urgentes }: PanelHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <PackageCheck className="w-3.5 h-3.5 text-texto-terciario" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-texto-terciario">
            Pedidos para entregar
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className="bg-fondo-oscuro/60 text-texto-secundario border-borde/30 text-xs font-medium">
          {totalPedidos} {totalPedidos === 1 ? "pedido" : "pedidos"}
        </Badge>
        {urgentes > 0 && (
          <Badge className="bg-advertencia/10 text-advertencia border-advertencia/20 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-advertencia mr-1.5" />
            {urgentes} {urgentes === 1 ? "urgente" : "urgentes"}
          </Badge>
        )}
      </div>
    </div>
  );
}
