import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface MensajeAsistente {
  id: string;
  rol: "usuario" | "asistente";
  texto: string;
  creado_en: string;
}

export interface Conversacion {
  id: string;
  titulo: string;
  mensajes: MensajeAsistente[];
  creado_en: string;
}

interface EstadoAsistente {
  conversaciones: Conversacion[];
  conversacionActivaId: string | null;

  crearConversacion: () => string;
  activarConversacion: (id: string) => void;
  eliminarConversacion: (id: string) => void;
  agregarMensaje: (conversacionId: string, mensaje: MensajeAsistente) => void;
  actualizarUltimoMensaje: (conversacionId: string, texto: string) => void;
  eliminarMensajesDesde: (conversacionId: string, mensajeId: string) => void;
  editarMensaje: (conversacionId: string, mensajeId: string, nuevoTexto: string) => void;
  getConversacionActiva: () => Conversacion | undefined;
  setConversaciones: (conversaciones: Conversacion[]) => void;
}

function generarId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generarTitulo(texto: string): string {
  const limpio = texto.replace(/^["']|["']$/g, "").trim();
  return limpio.length > 40 ? limpio.slice(0, 40) + "..." : limpio;
}

export const usarAsistenteStore = create<EstadoAsistente>()(
  persist(
    (set, get) => ({
      conversaciones: [],
      conversacionActivaId: null,

      crearConversacion: () => {
        const id = generarId();
        const nueva: Conversacion = {
          id,
          titulo: "Nueva conversación",
          mensajes: [],
          creado_en: new Date().toISOString(),
        };
        set((s) => ({
          conversaciones: [nueva, ...s.conversaciones],
          conversacionActivaId: id,
        }));
        return id;
      },

      activarConversacion: (id: string) => {
        set({ conversacionActivaId: id });
      },

      eliminarConversacion: (id: string) => {
        set((s) => {
          const filtradas = s.conversaciones.filter((c) => c.id !== id);
          return {
            conversaciones: filtradas,
            conversacionActivaId:
              s.conversacionActivaId === id
                ? filtradas[0]?.id ?? null
                : s.conversacionActivaId,
          };
        });
      },

      agregarMensaje: (conversacionId: string, mensaje: MensajeAsistente) => {
        set((s) => ({
          conversaciones: s.conversaciones.map((c) => {
            if (c.id !== conversacionId) return c;
            const esPrimerMensaje = c.mensajes.length === 0 && mensaje.rol === "usuario";
            return {
              ...c,
              titulo: esPrimerMensaje ? generarTitulo(mensaje.texto) : c.titulo,
              mensajes: [...c.mensajes, mensaje],
            };
          }),
        }));
      },

      actualizarUltimoMensaje: (conversacionId: string, texto: string) => {
        set((s) => ({
          conversaciones: s.conversaciones.map((c) => {
            if (c.id !== conversacionId) return c;
            const mensajes = [...c.mensajes];
            const ultimo = mensajes[mensajes.length - 1];
            if (ultimo && ultimo.rol === "asistente") {
              mensajes[mensajes.length - 1] = { ...ultimo, texto };
            }
            return { ...c, mensajes };
          }),
        }));
      },

      getConversacionActiva: () => {
        const { conversaciones, conversacionActivaId } = get();
        return conversaciones.find((c) => c.id === conversacionActivaId);
      },

      setConversaciones: (conversaciones: Conversacion[]) => {
        set({ conversaciones });
      },

      eliminarMensajesDesde: (conversacionId: string, mensajeId: string) => {
        set((s) => ({
          conversaciones: s.conversaciones.map((c) => {
            if (c.id !== conversacionId) return c;
            const idx = c.mensajes.findIndex((m) => m.id === mensajeId);
            if (idx === -1) return c;
            return { ...c, mensajes: c.mensajes.slice(0, idx) };
          }),
        }));
      },

      editarMensaje: (conversacionId: string, mensajeId: string, nuevoTexto: string) => {
        set((s) => ({
          conversaciones: s.conversaciones.map((c) => {
            if (c.id !== conversacionId) return c;
            const idx = c.mensajes.findIndex((m) => m.id === mensajeId);
            if (idx === -1) return c;
            const actualizado = { ...c.mensajes[idx], texto: nuevoTexto };
            const mensajes = [...c.mensajes.slice(0, idx), actualizado];
            return {
              ...c,
              titulo: idx === 0 ? generarTitulo(nuevoTexto) : c.titulo,
              mensajes,
            };
          }),
        }));
      },
    }),
    {
      name: "e-kitchen-asistente",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversaciones: state.conversaciones.map((c) => ({
          ...c,
          mensajes: c.mensajes.slice(-50),
        })),
        conversacionActivaId: state.conversacionActivaId,
      }),
    }
  )
);
