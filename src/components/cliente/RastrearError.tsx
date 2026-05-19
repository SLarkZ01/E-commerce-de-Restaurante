"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RastrearErrorProps {
  onReintentar: () => void;
}

export function RastrearError({ onReintentar }: RastrearErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-error" />
      </div>
      <div className="text-center">
        <p className="font-medium text-texto">Error al buscar</p>
        <p className="text-sm text-texto-secundario mt-1">
          Ocurrió un error. Intenta de nuevo más tarde.
        </p>
      </div>
      <Button variant="outline" onClick={onReintentar} className="mt-2">
        Intentar de nuevo
      </Button>
    </div>
  );
}
