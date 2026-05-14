import { ShoppingBag } from "lucide-react";

export function CarritoSinMesa() {
  return (
    <div className="bg-fondo-oscuro rounded-xl p-5 text-center space-y-2">
      <div className="w-12 h-12 rounded-full bg-borde/50 flex items-center justify-center mx-auto">
        <ShoppingBag className="w-6 h-6 text-texto-secundario" />
      </div>
      <p className="text-sm font-medium text-texto">Escanea el QR de tu mesa</p>
      <p className="text-xs text-texto-secundario">
        Necesitas escanear el código QR de tu mesa para completar el pedido
      </p>
    </div>
  );
}
