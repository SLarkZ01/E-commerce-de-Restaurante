"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Check, X } from "lucide-react";

interface MensajeToastProps {
  mensaje: string;
  onClose?: () => void;
  variante?: "exito" | "error" | "advertencia";
  duracionMs?: number;
}

const ESTILOS: Record<string, { bg: string; text: string; icono: React.ReactNode }> = {
  exito: {
    bg: "bg-exito/10",
    text: "text-exito",
    icono: <Check className="w-4 h-4 shrink-0" />,
  },
  error: {
    bg: "bg-error/10",
    text: "text-error",
    icono: <AlertTriangle className="w-4 h-4 shrink-0" />,
  },
  advertencia: {
    bg: "bg-advertencia/10",
    text: "text-advertencia",
    icono: <AlertTriangle className="w-4 h-4 shrink-0" />,
  },
};

export function MensajeToast({
  mensaje,
  onClose,
  variante = "exito",
  duracionMs = 4000,
}: MensajeToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!mensaje || !onClose || duracionMs <= 0) return;
    timerRef.current = setTimeout(onClose, duracionMs);
    return () => clearTimeout(timerRef.current);
  }, [mensaje, onClose, duracionMs]);

  if (!mensaje) return null;

  const estilo = ESTILOS[variante];

  return (
    <div
      className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${estilo.bg} ${estilo.text}`}
    >
      {estilo.icono}
      <span className="flex-1">{mensaje}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity shrink-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
