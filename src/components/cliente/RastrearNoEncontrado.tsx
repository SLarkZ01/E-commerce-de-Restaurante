"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RastrearNoEncontradoProps {
  onReintentar: () => void;
}

export function RastrearNoEncontrado({ onReintentar }: RastrearNoEncontradoProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-error" />
      </div>
      <div className="text-center">
        <p className="font-medium text-texto">Pedido no encontrado</p>
        <p className="text-sm text-texto-secundario mt-1">
          Verifica el ID e intenta de nuevo.
        </p>
      </div>
      <Button variant="outline" onClick={onReintentar} className="mt-2">
        Intentar de nuevo
      </Button>
    </div>
  );
}
