import { QrCode, Trash2 } from "lucide-react";
import type { Mesa } from "@/types";
import { Button } from "@/components/ui/button";

interface TarjetaMesaProps {
  mesa: Mesa;
  onEliminar: (id: string) => void;
  onVerQR: (mesa: Mesa) => void;
}

export function TarjetaMesa({ mesa, onEliminar, onVerQR }: TarjetaMesaProps) {
  return (
    <div className="group relative bg-fondo-card rounded-xl border border-borde/50 p-5 shadow-[0_1px_2px_rgba(45,42,38,0.03)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.06)] hover:border-borde transition-all">
      <button
        onClick={() => onEliminar(mesa.id)}
        className="absolute top-3 right-3 text-texto-terciario hover:text-error opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-error/10"
        aria-label={`Eliminar mesa ${mesa.numero}`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-primario/10 flex items-center justify-center group-hover:bg-primario/15 transition-colors">
          <span className="font-playfair text-lg font-bold text-primario">
            {mesa.numero}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-texto truncate">
            Mesa {mesa.numero}
          </p>
          <p className="text-[11px] text-texto-terciario font-mono truncate mt-0.5">
            {mesa.codigo_qr}
          </p>
        </div>
      </div>

      <Button
        onClick={() => onVerQR(mesa)}
        variant="outline"
        size="sm"
        className="w-full h-9 text-xs font-medium"
      >
        <QrCode className="w-3.5 h-3.5 mr-1.5" />
        Ver código QR
      </Button>
    </div>
  );
}
