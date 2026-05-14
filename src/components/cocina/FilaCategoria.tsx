import React from "react";
import { Trash2 } from "lucide-react";
import type { Categoria } from "@/types";

interface FilaCategoriaProps {
  categoria: Categoria;
  onEliminar: (id: string) => void;
}

export const FilaCategoria = React.memo(function FilaCategoria({
  categoria,
  onEliminar,
}: FilaCategoriaProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-fondo-oscuro transition-all">
      <p className="text-sm font-medium text-texto truncate mr-3">
        {categoria.nombre}
      </p>
      <button
        onClick={() => onEliminar(categoria.id)}
        className="text-texto-terciario hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10 shrink-0"
        aria-label={`Eliminar ${categoria.nombre}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
});
