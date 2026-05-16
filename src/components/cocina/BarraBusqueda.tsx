import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BarraBusquedaProps {
  busqueda: string;
  onCambio: (valor: string) => void;
}

export function BarraBusqueda({ busqueda, onCambio }: BarraBusquedaProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8472A]" />
        <Input
          type="text"
          placeholder="Buscar en tu carta..."
          value={busqueda}
          onChange={(e) => onCambio(e.target.value)}
          className="pl-11 h-11 rounded-xl bg-white border-[#E2E8F0] text-sm placeholder:text-[#9CA3AF] focus-visible:ring-[#E8472A]/25 focus-visible:border-[#E8472A]/50 shadow-sm transition-all duration-200"
        />
      </div>
    </div>
  );
}
