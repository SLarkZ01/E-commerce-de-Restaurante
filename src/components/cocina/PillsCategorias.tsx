import { memo } from "react";
import { Utensils } from "lucide-react";
import type { Categoria } from "@/types";

interface PillsCategoriasProps {
  categorias: Categoria[];
  activa: string;
  onCambio: (id: string) => void;
}

export const PillsCategorias = memo(function PillsCategorias({ categorias, activa, onCambio }: PillsCategoriasProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        onClick={() => onCambio("todas")}
        className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activa === "todas"
            ? "bg-primario text-primario-texto shadow-sm"
            : "bg-fondo-card text-texto-secundario hover:text-primario hover:border-primario/30 border border-borde"
        }`}
      >
        <Utensils className="w-3.5 h-3.5" />
        <span>Todas</span>
      </button>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCambio(cat.id)}
          className={`shrink-0 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activa === cat.id
              ? "bg-primario text-primario-texto shadow-sm"
              : "bg-fondo-card text-texto-secundario hover:text-primario hover:border-primario/30 border border-borde"
          }`}
        >
          <span>{cat.nombre}</span>
        </button>
      ))}
    </div>
  );
});
