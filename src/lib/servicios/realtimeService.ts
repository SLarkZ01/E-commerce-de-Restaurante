import { crearCliente } from "@/lib/supabase/browser";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type EventoRealtime = "INSERT" | "UPDATE" | "DELETE" | "*";

export interface OpcionesSuscripcion {
  tabla: string;
  evento: EventoRealtime;
  filtro?: string;
  schema?: string;
}

export type CallbackCambio<TRow extends Record<string, unknown> = Record<string, unknown>> = (
  payload: RealtimePostgresChangesPayload<TRow>
) => void;

export interface ISuscripcionRealtime {
  cancelar: () => Promise<void>;
}

export interface IServicioRealtime {
  suscribir<TRow extends Record<string, unknown>>(
    opciones: OpcionesSuscripcion,
    callback: CallbackCambio<TRow>
  ): Promise<ISuscripcionRealtime>;

  desconectarTodo(): Promise<void>;
}

export class SupabaseRealtimeService implements IServicioRealtime {
  private canales: Map<string, { cancelar: () => Promise<void> }> = new Map();
  private contadorCanales = 0;

  async suscribir<TRow extends Record<string, unknown>>(
    opciones: OpcionesSuscripcion,
    callback: CallbackCambio<TRow>
  ): Promise<ISuscripcionRealtime> {
    const supabase = crearCliente();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
      }
    } catch {
      // Sesión no disponible (cliente anónimo) — continuar sin auth
    }

    this.contadorCanales++;
    const canalNombre = `rt-${opciones.tabla}-${opciones.evento}-${this.contadorCanales}-${Date.now()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channelConfig: Record<string, any> = {
      event: opciones.evento,
      schema: opciones.schema ?? "public",
      table: opciones.tabla,
    };

    if (opciones.filtro) {
      channelConfig.filter = opciones.filtro;
    }

    const canal = supabase
      .channel(canalNombre)
      .on(
        "postgres_changes" as never,
        channelConfig,
        (payload: RealtimePostgresChangesPayload<TRow>) => {
          callback(payload);
        }
      )
      .subscribe((status: string, err?: Error) => {
        if (status === "CHANNEL_ERROR") {
          const msg = err?.message ?? status;
          // Socket closure (1006) es normal en reconexiones y cambios de pestaña
          if (msg.includes("socket closed")) {
            console.warn(
              `[Realtime] Reconexión en ${opciones.tabla} (${opciones.evento}${opciones.filtro ? `, ${opciones.filtro}` : ""}):`,
              msg
            );
          } else {
            console.error(
              `[Realtime] Error en canal ${opciones.tabla} (${opciones.evento}${opciones.filtro ? `, ${opciones.filtro}` : ""}):`,
              msg
            );
          }
        }
        if (status === "SUBSCRIBED") {
          console.log(
            `[Realtime] Canal ${opciones.tabla} (${opciones.evento}${opciones.filtro ? `, filtro: ${opciones.filtro}` : ""}) conectado`
          );
        }
        if (status === "CLOSED") {
          console.log(`[Realtime] Canal ${opciones.tabla} (${opciones.evento}) cerrado`);
        }
        if (status === "TIMED_OUT") {
          console.warn(`[Realtime] Timeout en canal ${opciones.tabla} (${opciones.evento})`);
        }
      });

    const cancelar = async () => {
      try {
        await supabase.removeChannel(canal);
      } catch {
        // Canal ya removido o inválido
      }
      this.canales.delete(canalNombre);
    };

    this.canales.set(canalNombre, { cancelar });

    return { cancelar };
  }

  async desconectarTodo(): Promise<void> {
    const pendientes = Array.from(this.canales.values()).map((c) => c.cancelar());
    await Promise.all(pendientes);
    this.canales.clear();
  }
}

let instanciaGlobal: SupabaseRealtimeService | null = null;

export function crearRealtimeService(): IServicioRealtime {
  if (!instanciaGlobal) {
    instanciaGlobal = new SupabaseRealtimeService();
  }
  return instanciaGlobal;
}
