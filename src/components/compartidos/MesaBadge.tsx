import { memo } from "react";
import { UtensilsCrossed } from "lucide-react";

interface MesaBadgeProps {
  numero: number;
  urgente?: boolean;
}

export const MesaBadge = memo(function MesaBadge({ numero, urgente }: MesaBadgeProps) {
  return (
    <div
      className={`inline-flex items-baseline gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-colors ${
        urgente
          ? "bg-advertencia/10 text-advertencia"
          : "bg-fondo-oscuro text-texto"
      }`}
    >
      <UtensilsCrossed className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 self-center" />
      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider opacity-60">
        Mesa
      </span>
      <span className="font-playfair text-lg sm:text-xl font-bold leading-none">
        {numero}
      </span>
    </div>
  );
});
