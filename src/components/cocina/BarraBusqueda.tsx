import { memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BarraBusquedaProps {
  busqueda: string;
  onCambio: (valor: string) => void;
}

export const BarraBusqueda = memo(function BarraBusqueda({ busqueda, onCambio }: BarraBusquedaProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
        <Input
          type="text"
          placeholder="Buscar en tu carta..."
          value={busqueda}
          onChange={(e) => onCambio(e.target.value)}
          className="pl-11 h-10 rounded-xl bg-fondo-card border-borde text-sm placeholder:text-texto-terciario focus-visible:ring-primario/25 focus-visible:border-primario/50 shadow-sm transition-all duration-200"
        />
      </div>
    </div>
  );
});
