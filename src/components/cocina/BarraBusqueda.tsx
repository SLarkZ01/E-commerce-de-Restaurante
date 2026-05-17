import { memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BarraBusquedaProps {
  busqueda: string;
  onCambio: (valor: string) => void;
}

export const BarraBusqueda = memo(function BarraBusqueda({ busqueda, onCambio }: BarraBusquedaProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario/70" />
      <Input
        type="text"
        placeholder="Buscar en tu carta..."
        value={busqueda}
        onChange={(e) => onCambio(e.target.value)}
        className="pl-10 h-10 rounded-xl bg-fondo-card border-borde text-sm placeholder:text-texto-terciario/50 focus-visible:ring-primario/25 focus-visible:border-primario/50 shadow-sm transition-all"
      />
    </div>
  );
});
