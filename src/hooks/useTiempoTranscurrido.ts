"use client";

import { useState, useEffect, useCallback } from "react";

export function useTiempoTranscurrido(intervaloMs = 30000) {
  const [ahora, setAhora] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAhora(Date.now());
    const id = setInterval(() => setAhora(Date.now()), intervaloMs);
    return () => clearInterval(id);
  }, [intervaloMs]);

  const formatear = useCallback(
    (fecha: string | Date) => {
      if (ahora === null) return "—";
      const fechaMs =
        typeof fecha === "string" ? new Date(fecha).getTime() : fecha.getTime();
      const minutos = Math.floor((ahora - fechaMs) / 60000);
      if (minutos < 1) return "Ahora";
      if (minutos === 1) return "1 min";
      return `${minutos} min`;
    },
    [ahora]
  );

  const esUrgente = useCallback(
    (fecha: string | Date, umbralMin = 10) => {
      if (ahora === null) return false;
      const fechaMs =
        typeof fecha === "string" ? new Date(fecha).getTime() : fecha.getTime();
      return Math.floor((ahora - fechaMs) / 60000) > umbralMin;
    },
    [ahora]
  );

  return { ahora, formatear, esUrgente };
}
