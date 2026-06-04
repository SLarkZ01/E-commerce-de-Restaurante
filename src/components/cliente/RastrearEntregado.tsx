"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface RastrearEntregadoProps {
  onCerrar: () => void;
}

export function RastrearEntregado({ onCerrar }: RastrearEntregadoProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <Image
        src="/gifs/chefsito.gif"
        alt="Chef despidiéndose"
        width={112}
        height={112}
        className="object-contain"
        unoptimized
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
