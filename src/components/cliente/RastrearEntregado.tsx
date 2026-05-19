"use client";

import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RastrearEntregadoProps {
  onCerrar: () => void;
}

export function RastrearEntregado({ onCerrar }: RastrearEntregadoProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <CircleCheck className="w-7 h-7 text-green-600" />
      </div>
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
