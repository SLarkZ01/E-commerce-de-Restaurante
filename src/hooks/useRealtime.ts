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
    const canalNombre = `realtime-${tabla}-${evento}-${filtro ?? "all"}`;
    let canalActivo = true;

    const channelConfig: Record<string, unknown> = {
      event: evento,
      schema: "public",
      table: tabla,
    };

    if (filtro) {
      channelConfig.filter = filtro;
    }

    // Obtener sesión y configurar auth para realtime
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!canalActivo) return;

      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
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
          if (status === "CHANNEL_ERROR") {
            console.error(`[Observer] Error en canal ${tabla}:`, status);
          }
        });

      // Guardar referencia para cleanup
      (canal as any)._cleanup = () => {
        supabase.removeChannel(canal).catch(() => {});
      };
    });

    return () => {
      canalActivo = false;
    };
  }, [tabla, evento, filtro]);
}
