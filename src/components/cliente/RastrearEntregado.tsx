"use client";

import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RastrearEntregadoProps {
  onCerrar: () => void;
}

export function RastrearEntregado({ onCerrar }: RastrearEntregadoProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <img
        src="/gifs/chefsito.gif"
        alt="Chef despidiéndose"
        className="w-28 h-28 object-contain"
      />
      <div className="text-center">
        <p className="font-playfair text-lg font-bold text-green-700">
          Pedido Entregado
        </p>
        <p className="text-sm text-texto-secundario mt-1">
          Tu pedido ha sido entregado. Que lo disfrutes!
        </p>
      </div>
      <Button variant="outline" onClick={onCerrar} className="mt-2">
        Cerrar
      </Button>
    </div>
  );
}
