import { PackageCheck, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PanelHeaderProps {
  totalPedidos: number;
  urgentes: number;
}

export function PanelHeader({ totalPedidos, urgentes }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-exito" />
          <h2 className="font-playfair text-xl font-bold text-texto">
            Platos Listos
          </h2>
        </div>
        <Badge className="bg-exito/10 text-exito text-xs font-semibold">
          {totalPedidos} {totalPedidos === 1 ? "pedido" : "pedidos"}
        </Badge>
      </div>
      {urgentes > 0 && (
        <Badge
          variant="destructive"
          className="text-xs font-semibold animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
          {urgentes} {urgentes === 1 ? "urgente" : "urgentes"}
        </Badge>
      )}
    </div>
  );
}
