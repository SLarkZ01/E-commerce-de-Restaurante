"use client";

import { useEffect, useRef } from "react";
import { crearCliente } from "@/lib/supabase/browser";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type CallbackCambio = (
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>
) => void;

export function useRealtime(
  tabla: string,
  evento: "INSERT" | "UPDATE" | "DELETE" | "*",
  callback: CallbackCambio,
  filtro?: string
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const supabase = crearCliente();
    const canalNombre = `realtime-${tabla}-${evento}-${filtro ?? "all"}-${Date.now()}`;

    const channelConfig: Record<string, unknown> = {
      event: evento,
      schema: "public",
      table: tabla,
    };

    if (filtro) {
      channelConfig.filter = filtro;
    }

    const canal = supabase
      .channel(canalNombre)
      .on(
        "postgres_changes" as never,
        channelConfig,
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          callbackRef.current(payload);
        }
      )
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          console.log(`[Observer] ${evento} → ${tabla}${filtro ? ` (${filtro})` : ""}`);
        } else if (status === "CHANNEL_ERROR") {
          console.error(`[Observer] Error en canal ${tabla}:`, status);
        }
      });

    return () => {
      supabase.removeChannel(canal).catch(() => {});
    };
  }, [tabla, evento, filtro]);
}
