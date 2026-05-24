"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorStaff({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-error" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-texto">
            Algo salio mal
          </h2>
          <p className="text-sm text-texto-secundario">
            Ocurrio un error inesperado al cargar esta pagina. Intenta de nuevo.
          </p>
        </div>
        <Button onClick={reset} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
      </div>
    </div>
  );
}
