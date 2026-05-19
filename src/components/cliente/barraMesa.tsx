"use client";

import { UtensilsCrossed, MapPin, Search } from "lucide-react";
import { useRastrearPedido } from "./RastrearPedidoProvider";

interface BarraMesaProps {
  numeroMesa: number;
}

export function BarraMesa({ numeroMesa }: BarraMesaProps) {
  const { abrir } = useRastrearPedido();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 h-16 bg-fondo-card/80 backdrop-blur-md border-b border-borde/40 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primario/10 flex items-center justify-center">
          <UtensilsCrossed className="w-4.5 h-4.5 text-primario" />
        </div>
        <span className="font-playfair text-lg font-bold text-texto tracking-tight">
          E-Kitchen
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={abrir}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-texto-secundario hover:text-primario hover:bg-primario/5 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          Rastrear Pedido
        </button>
        <div className="flex items-center gap-2 bg-primario/10 text-primario px-3.5 py-2 rounded-xl text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          Mesa {numeroMesa}
        </div>
      </div>
    </header>
  );
}
