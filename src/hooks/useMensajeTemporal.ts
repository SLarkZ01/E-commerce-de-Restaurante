"use client";

import { useState, useCallback, useRef } from "react";

export function useMensajeTemporal(duracionMs = 4000) {
  const [mensaje, setMensaje] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const mostrar = useCallback(
    (texto: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMensaje(texto);
      timerRef.current = setTimeout(() => setMensaje(""), duracionMs);
    },
    [duracionMs]
  );

  const limpiar = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMensaje("");
  }, []);

  return { mensaje, mostrar, limpiar, setMensaje };
}
