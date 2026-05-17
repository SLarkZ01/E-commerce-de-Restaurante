import { memo } from "react";
import { Utensils } from "lucide-react";
import { useContadorAnimado } from "@/hooks/useContadorAnimado";

interface CabeceraPlatosProps {
  platosDisponibles: number;
}

export const CabeceraPlatos = memo(function CabeceraPlatos({ platosDisponibles }: CabeceraPlatosProps) {
  const displayCount = useContadorAnimado(platosDisponibles);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primario/10">
        <Utensils className="w-5 h-5 text-primario" />
      </div>
      <div>
        <h2 className="font-playfair text-2xl font-bold text-texto tracking-tight leading-none">
          Platos Disponibles
        </h2>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="h-0.5 w-8 bg-primario/40 rounded-full" />
          <p className="text-sm text-texto-secundario font-medium">
            <span key={displayCount} className="animate-count-up inline-block">
              {displayCount}
            </span>{" "}
            {platosDisponibles === 1 ? "plato" : "platos"} en tu carta
          </p>
        </div>
      </div>
    </div>
  );
});
