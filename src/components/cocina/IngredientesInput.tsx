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
      <label className="block text-xs font-medium text-texto-secundario mb-1.5">
        Ingredientes
      </label>
      <div className="flex gap-2 mb-2">
        <Input
          value={ingrediente}
          onChange={(e) => onChangeIngrediente(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAgregar();
            }
          }}
          placeholder="Ej: Tomate"
          className="h-9 text-sm"
        />
        <Button
          type="button"
          onClick={onAgregar}
          variant="secondary"
          size="sm"
          className="h-9 px-3 shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {ingredientes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ingredientes.map((ing, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-fondo-oscuro text-texto rounded-full text-xs"
            >
              {ing}
              <button
                type="button"
                onClick={() => onEliminar(i)}
                className="text-texto-terciario hover:text-error transition-colors"
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
