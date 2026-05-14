import { Check } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CarritoResumenProps {
  totalMostrado: number;
  pagando: boolean;
  itemsCount: number;
  onConfirmar: () => void;
}

export function CarritoResumen({
  totalMostrado,
  pagando,
  itemsCount,
  onConfirmar,
}: CarritoResumenProps) {
  return (
    <div className="px-5 py-4 border-t border-borde/60 space-y-3 bg-fondo-card">
      <div className="flex justify-between text-sm">
        <span className="text-texto-secundario">Subtotal</span>
        <span className="font-medium text-texto tabular-nums">
          {formatearPrecio(totalMostrado)}
        </span>
      </div>
      <Separator />
      <div className="flex justify-between">
        <span className="font-playfair text-base font-bold text-texto">Total</span>
        <span className="font-playfair text-xl font-bold text-primario tabular-nums">
          {formatearPrecio(totalMostrado)}
        </span>
      </div>

      <Button
        onClick={onConfirmar}
        disabled={itemsCount === 0 || pagando}
        className="w-full h-12 bg-primario hover:bg-primario-hover text-primario-texto rounded-xl font-semibold text-sm shadow-lg shadow-primario/20 active:scale-[0.98]"
      >
        {pagando ? (
          "Procesando..."
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Confirmar Pedido
          </>
        )}
      </Button>
      <p className="text-center text-xs text-texto-terciario">
        PayPal próximamente
      </p>
    </div>
  );
}
