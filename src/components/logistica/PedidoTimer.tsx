import { memo } from "react";
import { Clock } from "lucide-react";
import { useTiempoTranscurrido } from "@/hooks/useTiempoTranscurrido";

interface PedidoTimerProps {
  creadoEn: string;
  umbralMin?: number;
}

export const PedidoTimer = memo(function PedidoTimer({
  creadoEn,
  umbralMin = 15,
}: PedidoTimerProps) {
  const { formatear, esUrgente } = useTiempoTranscurrido();
  const urgente = esUrgente(creadoEn, umbralMin);

  return (
    <div className="flex items-center gap-1.5">
      <Clock
        className={`w-3.5 h-3.5 ${
          urgente ? "text-advertencia" : "text-texto-terciario"
        }`}
      />
      <span
        className={`text-xs tabular-nums ${
          urgente
            ? "text-advertencia font-medium"
            : "text-texto-terciario"
        }`}
      >
        {formatear(creadoEn)}
      </span>
    </div>
  );
});

export function useUrgencia(creadoEn: string, umbralMin = 15) {
  const { esUrgente } = useTiempoTranscurrido();
  return esUrgente(creadoEn, umbralMin);
}
