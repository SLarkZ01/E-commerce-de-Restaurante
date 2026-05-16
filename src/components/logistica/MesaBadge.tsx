import { UtensilsCrossed } from "lucide-react";

interface MesaBadgeProps {
  numero: number;
  urgente?: boolean;
}

export function MesaBadge({ numero, urgente }: MesaBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
        urgente
          ? "bg-advertencia/10 border-advertencia/30 text-advertencia"
          : "bg-fondo-oscuro border-borde text-texto"
      }`}
    >
      <UtensilsCrossed className="w-4 h-4 flex-shrink-0" />
      <span className="text-xs font-semibold uppercase tracking-wider">
        Mesa
      </span>
      <span className="font-playfair text-2xl font-bold leading-none">
        {numero}
      </span>
    </div>
  );
}
