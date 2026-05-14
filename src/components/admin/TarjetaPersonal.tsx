import { Trash2, Users, ChefHat, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { obtenerIniciales } from "@/lib/iniciales";
import type { Perfil } from "@/types";

const COLOR_ROL: Record<string, { color: string; icono: React.ReactNode; etiqueta: string }> = {
  cocinero: { color: "bg-advertencia/10 text-advertencia", icono: <ChefHat className="w-4 h-4" />, etiqueta: "Cocinero" },
  mesero: { color: "bg-info/10 text-info", icono: <User className="w-4 h-4" />, etiqueta: "Mesero" },
  admin: { color: "bg-primario/10 text-primario", icono: <Users className="w-4 h-4" />, etiqueta: "Admin" },
};

interface TarjetaPersonalProps {
  perfil: Perfil;
  onEliminar: (id: string) => void;
}

export function TarjetaPersonal({ perfil, onEliminar }: TarjetaPersonalProps) {
  const rolInfo = COLOR_ROL[perfil.rol] ?? COLOR_ROL.cocinero;

  return (
    <div className="bg-fondo-card rounded-xl border border-borde/60 p-5 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar className="w-11 h-11 border-2 border-borde">
          <AvatarFallback className="bg-primario/10 text-primario text-sm font-bold">
            {obtenerIniciales(perfil.nombre)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-texto truncate">{perfil.nombre}</p>
          <p className="text-sm text-texto-terciario truncate">{perfil.email}</p>
        </div>
        <Badge variant="secondary" className={`text-xs font-semibold px-3 py-1 ${rolInfo.color}`}>
          {rolInfo.icono}
          {rolInfo.etiqueta}
        </Badge>
        <button
          onClick={() => onEliminar(perfil.id)}
          className="text-texto-terciario hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
