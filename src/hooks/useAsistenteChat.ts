"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { usarAsistenteStore } from "@/stores/asistente";
import type { MensajeAsistente } from "@/stores/asistente";
import { obtenerHistorial } from "@/lib/acciones/asistente";

type EstadoChat = "idle" | "enviando" | "recibiendo" | "error";

export function useAsistenteChat() {
  const store = usarAsistenteStore();

  const conversacionActiva = store.getConversacionActiva();
  const mensajes = conversacionActiva?.mensajes ?? [];

  const [estado, setEstado] = useState<EstadoChat>("idle");
  const [error, setError] = useState("");
  const [textoStreaming, setTextoStreaming] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const conversacionId = store.conversacionActivaId;

  useEffect(() => {
    obtenerHistorial().then(({ conversaciones, error: _err }) => {
      if (_err) return;
      if (conversaciones.length === 0) return;

      const locales = store.conversaciones;
      const remotas = conversaciones.filter(
        (r) => !locales.some((l) => l.id === r.id)
      );

      if (remotas.length > 0) {
        store.setConversaciones([...locales, ...remotas]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enviarMensaje = useCallback(
    async (texto: string) => {
      if (!texto.trim() || estado !== "idle") return;

      const cId = conversacionId ?? store.crearConversacion();
      const mensajeUsuario: MensajeAsistente = {
        id: crypto.randomUUID?.(),
        rol: "usuario",
        texto: texto.trim(),
        creado_en: new Date().toISOString(),
      };

      store.agregarMensaje(cId, mensajeUsuario);
      setEstado("enviando");
      setError("");

      const mensajeAsistenteId = crypto.randomUUID?.() ?? "";
      store.agregarMensaje(cId, {
        id: mensajeAsistenteId,
        rol: "asistente",
        texto: "",
        creado_en: new Date().toISOString(),
      });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setEstado("recibiendo");
        setTextoStreaming("");

        const res = await fetch("/api/asistente/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mensaje: texto.trim(), conversationId: cId }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error ?? `Error ${res.status}`);
        }

        const contentType = res.headers.get("content-type") ?? "";
        let acumulado = "";

        const reader = res.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lineas = buffer.split("\n");
            buffer = lineas.pop() ?? "";

            for (const linea of lineas) {
              const limpia = linea.trim();
              if (!limpia) continue;

              if (contentType.includes("text/event-stream")) {
                if (limpia.startsWith("data: ")) {
                  const data = limpia.slice(6);
                  if (data === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(data);
                    acumulado += parsed.texto ?? data;
                  } catch {
                    acumulado += data;
                  }
                }
              } else {
                try {
                  const parsed = JSON.parse(limpia);
                  if (parsed.type === "item" && parsed.content !== undefined) {
                    acumulado += parsed.content;
                  } else if (parsed.type === "end" || parsed.type === "begin") {
                    continue;
                  } else if (parsed.output !== undefined) {
                    acumulado += parsed.output;
                  } else if (parsed.text !== undefined) {
                    acumulado += parsed.text;
                  } else if (Array.isArray(parsed)) {
                    for (const item of parsed) {
                      acumulado += (item.output ?? item.text ?? item.content ?? JSON.stringify(item)) + "\n";
                    }
                  }
                } catch {
                  // JSON incompleto, ignorar
                }
              }
            }
            setTextoStreaming(acumulado);
            store.actualizarUltimoMensaje(cId, acumulado);
          }
        } else {
          acumulado = await res.text();
          setTextoStreaming(acumulado);
          store.actualizarUltimoMensaje(cId, acumulado);
        }

        setEstado("idle");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Error al conectar con Arianna";
        setError(msg);
        setEstado("error");
        store.actualizarUltimoMensaje(cId, msg);
      } finally {
        abortRef.current = null;
      }
    },
    [estado, conversacionId, store]
  );

  const cancelar = useCallback(() => {
    abortRef.current?.abort();
    setEstado("idle");
  }, []);

  const manejarEliminar = useCallback(
    (mensajeId: string) => {
      if (!conversacionId) return;
      store.eliminarMensajesDesde(conversacionId, mensajeId);
    },
    [conversacionId, store]
  );

  const manejarEditar = useCallback(
    (mensajeId: string, nuevoTexto: string) => {
      if (!conversacionId || !nuevoTexto.trim()) return;
      store.editarMensaje(conversacionId, mensajeId, nuevoTexto.trim());
      enviarMensaje(nuevoTexto.trim());
    },
    [conversacionId, store, enviarMensaje]
  );

  return {
    estado,
    error,
    mensajes,
    textoStreaming,
    enviarMensaje,
    cancelar,
    manejarEliminar,
    manejarEditar,
    conversacionId,
  };
}
