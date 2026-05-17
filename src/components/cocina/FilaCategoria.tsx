import { memo } from "react";
import { Trash2 } from "lucide-react";
import type { Categoria } from "@/types";

interface FilaCategoriaProps {
  categoria: Categoria;
  onEliminar: (id: string) => void;
}

export const FilaCategoria = memo(function FilaCategoria({
  categoria,
  onEliminar,
}: FilaCategoriaProps) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-lg bg-fondo-oscuro hover:bg-borde/40 transition-colors border border-transparent hover:border-borde/40">
      <p className="text-sm font-medium text-texto truncate mr-3">
        {categoria.nombre}
      </p>
      <button
        onClick={() => onEliminar(categoria.id)}
        className="text-texto-terciario hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error/10 opacity-0 group-hover:opacity-100 shrink-0"
        aria-label={`Eliminar ${categoria.nombre}`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});
