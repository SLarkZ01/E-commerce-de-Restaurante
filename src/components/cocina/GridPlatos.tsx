import { Utensils } from "lucide-react";
import type { Plato } from "@/types";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { TarjetaPlatoCocina } from "./TarjetaPlatoCocina";

interface GridPlatosProps {
  platos: Plato[];
  onEliminar: (id: string) => void;
  onToggleDisponible: (id: string, datos: { disponible: boolean }) => void;
}

export function GridPlatos({ platos, onEliminar, onToggleDisponible }: GridPlatosProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      {platos.length === 0 ? (
        <EstadoVacio
          icono={Utensils}
          titulo="No hay platos"
          descripcion="No se encontraron platos con los filtros actuales"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platos.map((plato) => (
            <TarjetaPlatoCocina
              key={plato.id}
              plato={plato}
              onEliminar={onEliminar}
              onToggleDisponible={onToggleDisponible}
            />
          ))}
        </div>
      )}
    </div>
  );
}
