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

    const channelConfig: Record<string, unknown> = {
      event: evento,
      schema: "public",
      table: tabla,
    };

    if (filtro) {
      channelConfig.filter = filtro;
    }

    const canal = supabase
      .channel(`realtime-${tabla}-${evento}-${filtro ?? "all"}`)
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
        }
      });

    return () => {
      supabase.removeChannel(canal).catch(() => {});
    };
  }, [tabla, evento, filtro]);
}
