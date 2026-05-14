"use client";

import { useEffect } from "react";
import { crearCliente } from "@/lib/supabase/browser";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type CallbackCambio = (
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>
) => void;

/**
 * Patrón Observer: suscribe al cliente a cambios en tiempo real de Supabase.
 * El componente que lo usa actúa como "observador" de la tabla especificada.
 *
 * @param tabla - Nombre de la tabla a observar ("pedidos", "platos", etc.)
 * @param evento - Tipo de evento: "INSERT", "UPDATE", "DELETE" o "*" para todos
 * @param callback - Función que se ejecuta cuando ocurre un cambio
 * @param filtro - Filtro opcional (ej: "estado=eq.listo")
 */
export function useRealtime(
  tabla: string,
  evento: "INSERT" | "UPDATE" | "DELETE" | "*",
  callback: CallbackCambio,
  filtro?: string
) {
  useEffect(() => {
    const supabase = crearCliente();

    const canal = supabase
      .channel(`realtime-${tabla}-${evento}`)
      .on(
        "postgres_changes" as never,
        {
          event: evento,
          schema: "public",
          table: tabla,
          filter: filtro,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [tabla, evento, callback, filtro]);
}
