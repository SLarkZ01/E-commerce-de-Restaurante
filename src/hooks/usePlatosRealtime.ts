"use client";

import { useCallback } from "react";
import { useRealtime } from "./useRealtime";
import type { IServicioRealtime } from "@/lib/servicios/realtimeService";
import type { Plato } from "@/types";

export interface CallbacksPlato {
  onNuevoPlato: (plato: Plato) => void;
  onPlatoActualizado: (plato: Plato) => void;
  onPlatoEliminado: (platoId: string) => void;
}

export function usePlatosRealtime(
  callbacks: CallbacksPlato,
  servicio?: IServicioRealtime
) {
  const { onNuevoPlato, onPlatoActualizado, onPlatoEliminado } = callbacks;

  const onInsert = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any) => {
      const nuevo = payload.new as Plato;
      if (nuevo && nuevo.disponible) {
        onNuevoPlato(nuevo);
      }
    },
    [onNuevoPlato]
  );

  const onUpdate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any) => {
      const nuevo = payload.new as Plato;
      if (!nuevo) return;

      if (nuevo.disponible) {
        onPlatoActualizado(nuevo);
      } else {
        onPlatoEliminado(nuevo.id);
      }
    },
    [onPlatoActualizado, onPlatoEliminado]
  );

  const onDelete = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any) => {
      const eliminado = payload.old as Plato | undefined;
      if (eliminado?.id) {
        onPlatoEliminado(eliminado.id);
      }
    },
    [onPlatoEliminado]
  );

  useRealtime("platos", "INSERT", onInsert, undefined, servicio);
  useRealtime("platos", "UPDATE", onUpdate, undefined, servicio);
  useRealtime("platos", "DELETE", onDelete, undefined, servicio);
}
