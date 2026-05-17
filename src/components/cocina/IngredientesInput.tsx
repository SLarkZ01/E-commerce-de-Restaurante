import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IngredientesInputProps {
  ingrediente: string;
  onChangeIngrediente: (valor: string) => void;
  onAgregar: () => void;
  ingredientes: string[];
  onEliminar: (indice: number) => void;
}

export function IngredientesInput({
  ingrediente,
  onChangeIngrediente,
  onAgregar,
  ingredientes,
  onEliminar,
}: IngredientesInputProps) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-texto-secundario uppercase tracking-wider mb-2.5">
        Ingredientes
      </label>
      <div className="flex gap-2 mb-3">
        <Input
          value={ingrediente}
          onChange={(e) => onChangeIngrediente(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAgregar();
            }
          }}
          placeholder="Ej: Tomate fresco"
          className="h-10 bg-fondo-card text-sm"
        />
        <Button
          type="button"
          onClick={onAgregar}
          size="sm"
          className="h-10 px-3 bg-primario/10 text-primario hover:bg-primario hover:text-primario-texto border border-primario/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {ingredientes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ingredientes.map((ing, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-fondo-card text-texto rounded-full text-xs font-medium border border-borde/50"
            >
              {ing}
              <button
                type="button"
                onClick={() => onEliminar(i)}
                className="text-texto-terciario hover:text-error hover:bg-error/10 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
