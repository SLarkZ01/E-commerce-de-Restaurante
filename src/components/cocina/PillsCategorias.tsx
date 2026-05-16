import { Utensils } from "lucide-react";
import type { Categoria } from "@/types";

interface PillsCategoriasProps {
  categorias: Categoria[];
  activa: string;
  onCambio: (id: string) => void;
}

export function PillsCategorias({ categorias, activa, onCambio }: PillsCategoriasProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
      <button
        onClick={() => onCambio("todas")}
        className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          activa === "todas"
            ? "bg-gradient-to-r from-[#E8472A] to-[#FF6B35] text-white shadow-md shadow-[#E8472A]/20"
            : "bg-white text-[#6B7280] hover:text-[#E8472A] hover:border-[#E8472A]/40 border border-[#E2E8F0] shadow-sm"
        }`}
      >
        <Utensils className="w-4 h-4" />
        <span>Todas</span>
      </button>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCambio(cat.id)}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activa === cat.id
              ? "bg-gradient-to-r from-[#E8472A] to-[#FF6B35] text-white shadow-md shadow-[#E8472A]/20"
              : "bg-white text-[#6B7280] hover:text-[#E8472A] hover:border-[#E8472A]/40 border border-[#E2E8F0] shadow-sm"
          }`}
        >
          <span>{cat.nombre}</span>
        </button>
      ))}
    </div>
  );
}
