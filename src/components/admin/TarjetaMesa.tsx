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
    <div className="bg-fondo-card rounded-xl border border-borde/60 p-5 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primario/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="font-playfair text-xl font-bold text-primario">
              {mesa.numero}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-texto-secundario">Mesa</p>
            <p className="font-playfair text-xl font-bold text-texto">
              #{mesa.numero}
            </p>
          </div>
        </div>
        <button
          onClick={() => onEliminar(mesa.id)}
          className="text-texto-terciario hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-fondo-oscuro rounded-lg p-3 mb-4">
        <p className="text-[10px] text-texto-terciario font-mono truncate">
          {mesa.codigo_qr}
        </p>
      </div>

      <Button
        onClick={() => onVerQR(mesa)}
        variant="outline"
        size="sm"
        className="w-full h-10 text-sm font-medium"
      >
        <QrCode className="w-4 h-4 mr-2" />
        Ver QR
      </Button>
    </div>
  );
}
