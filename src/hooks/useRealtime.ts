"use client";

import { useEffect, useRef, useState } from "react";
import { crearRealtimeService } from "@/lib/servicios/realtimeService";
import type {
  IServicioRealtime,
  ISuscripcionRealtime,
  EventoRealtime,
} from "@/lib/servicios/realtimeService";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type { EventoRealtime };

/**
 * Hook genérico del patrón Observer.
 * Suscribe a cambios en una tabla de Supabase vía WebSocket.
 *
 * DIP: acepta un IServicioRealtime inyectable. Si no se provee, usa el singleton.
 */
export function useRealtime(
  tabla: string,
  evento: EventoRealtime,
  callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
  filtro?: string,
  servicio?: IServicioRealtime
) {
  const callbackRef = useRef(callback);
  const suscripcionRef = useRef<ISuscripcionRealtime | null>(null);
  const generacionRef = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const [svc] = useState(() => servicio ?? crearRealtimeService());

  useEffect(() => {
    let activo = true;
    generacionRef.current++;
    const generacionActual = generacionRef.current;

    svc
      .suscribir(
        { tabla, evento, filtro, schema: "public" },
        (payload) => {
          if (activo) {
            callbackRef.current(payload);
          }
        }
      )
      .then((suscripcion) => {
        if (!activo || generacionRef.current !== generacionActual) {
          suscripcion.cancelar();
          return;
        }
        suscripcionRef.current = suscripcion;
      });

    return () => {
      activo = false;
      if (suscripcionRef.current) {
        suscripcionRef.current.cancelar();
        suscripcionRef.current = null;
      }
    };
  }, [svc, tabla, evento, filtro]);
}
