"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    let canal: ReturnType<ReturnType<typeof crearCliente>["channel"]> | null = null;
    let supabase: ReturnType<typeof crearCliente> | null = null;

    (async () => {
      supabase = crearCliente();

      // Asegurar que la sesión esté cargada antes de suscribir
      await supabase.auth.getSession();

      const channelConfig: Record<string, unknown> = {
        event: evento,
        schema: "public",
        table: tabla,
      };

      if (filtro) {
        channelConfig.filter = filtro;
      }

      canal = supabase
        .channel(`realtime-${tabla}-${evento}-${Date.now()}`)
        .on(
          "postgres_changes" as never,
          channelConfig,
          (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
            callback(payload);
          }
        )
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            console.log(`[Observer] Suscrito a ${evento} en ${tabla}${filtro ? ` (${filtro})` : ""}`);
          }
          if (status === "CHANNEL_ERROR") {
            console.error(`[Observer] Error suscribiendo a ${tabla}`);
          }
        });
    })();

    return () => {
      if (canal && supabase) supabase.removeChannel(canal);
    };
  }, [tabla, evento, callback, filtro]);
}
