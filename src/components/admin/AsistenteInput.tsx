"use client";

import { useRef, useCallback } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AsistenteInputProps {
  onEnviar: (texto: string) => void;
  onCancelar: () => void;
  cargando: boolean;
}

export function AsistenteInput({ onEnviar, onCancelar, cargando }: AsistenteInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const manejarEnviar = useCallback(() => {
    const texto = ref.current?.value.trim();
    if (!texto || cargando) return;
    onEnviar(texto);
    if (ref.current) ref.current.value = "";
    ref.current?.focus();
  }, [onEnviar, cargando]);

  const manejarKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        manejarEnviar();
      }
    },
    [manejarEnviar]
  );

  return (
    <div className="px-4 py-3 border-t border-borde/40 bg-fondo-card">
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          placeholder="Pregúntale a Arianna..."
          onKeyDown={manejarKeyDown}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-borde/50 bg-fondo-oscuro/30 px-3.5 py-2.5 text-sm text-texto placeholder:text-texto-terciario focus:outline-none focus:border-primario/50 focus:ring-2 focus:ring-primario/10 transition-colors max-h-32"
          disabled={cargando}
        />
        {cargando ? (
          <Button
            size="icon"
            variant="outline"
            onClick={onCancelar}
            className="shrink-0 h-10 w-10 rounded-xl"
          >
            <Square className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={manejarEnviar}
            className="shrink-0 h-10 w-10 rounded-xl bg-primario hover:bg-primario-hover text-primario-texto"
          >
            <Send className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
