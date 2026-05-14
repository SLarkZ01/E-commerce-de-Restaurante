import type { LucideIcon } from "lucide-react";

interface EstadoVacioProps {
  icono?: LucideIcon;
  elementoIcono?: React.ReactNode;
  titulo: string;
  descripcion: string;
}

export function EstadoVacio({ icono: Icono, elementoIcono, titulo, descripcion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-texto-terciario">
      <div className="w-16 h-16 rounded-full bg-fondo-oscuro flex items-center justify-center mb-4">
        {elementoIcono ?? (Icono ? <Icono className="w-7 h-7" /> : null)}
      </div>
      <p className="text-sm font-medium text-texto-secundario">{titulo}</p>
      <p className="text-xs mt-1">{descripcion}</p>
    </div>
  );
}
