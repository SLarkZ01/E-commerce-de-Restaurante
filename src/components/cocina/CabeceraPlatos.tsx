import { Utensils } from "lucide-react";
import { useContadorAnimado } from "@/hooks/useContadorAnimado";

interface CabeceraPlatosProps {
  platosDisponibles: number;
}

export function CabeceraPlatos({ platosDisponibles }: CabeceraPlatosProps) {
  const displayCount = useContadorAnimado(platosDisponibles);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8472A] to-[#FF6B35] shadow-md shadow-[#E8472A]/20">
        <Utensils className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E] tracking-tight leading-none">
          Platos Disponibles
        </h2>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="h-0.5 w-8 bg-gradient-to-r from-[#E8472A] to-[#FF6B35] rounded-full" />
          <p className="text-sm text-[#6B7280] font-medium">
            <span key={displayCount} className="animate-count-up inline-block">
              {displayCount}
            </span>{" "}
            {platosDisponibles === 1 ? "plato" : "platos"} en tu carta
          </p>
        </div>
      </div>
    </div>
  );
}
