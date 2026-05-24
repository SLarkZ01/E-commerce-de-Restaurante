"use client";

import { PanelLeft } from "lucide-react";
import { useAsistente } from "./AsistenteProvider";
import { useAsistenteChat } from "@/hooks/useAsistenteChat";
import { AsistenteSidebar } from "./AsistenteSidebar";
import { AsistenteMensajes } from "./AsistenteMensajes";
import { AsistenteBienvenida } from "./AsistenteBienvenida";
import { AsistenteInput } from "./AsistenteInput";
import { AlertCircle } from "lucide-react";

export function AsistenteChat() {
  const { sidebarAbierto, toggleSidebar } = useAsistente();
  const {
    estado,
    error,
    mensajes,
    enviarMensaje,
    cancelar,
    manejarEliminar,
    manejarEditar,
  } = useAsistenteChat();

  const cargando = estado === "recibiendo" || estado === "enviando";
  const hayMensajes = mensajes.length > 0;

  return (
    <div className="flex h-[calc(100dvh-4rem)] bg-fondo overflow-hidden">
      <AsistenteSidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-fondo-oscuro/20">
        {/* Header */}
        <div className="px-4 py-3 border-b border-borde/40 bg-fondo-card flex items-center gap-3">
          {!sidebarAbierto && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-fondo-oscuro/30 text-texto-terciario hover:text-texto transition-colors"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="font-playfair text-sm font-bold text-texto">Arianna AI</h1>
            <p className="text-[10px] text-texto-terciario">Tu asistente de cocina</p>
          </div>
          {cargando && (
            <span className="ml-auto text-[10px] text-texto-terciario animate-pulse">
              Pensando...
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-error/10 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Contenido */}
        {hayMensajes ? (
          <AsistenteMensajes mensajes={mensajes} cargando={cargando} onEliminar={manejarEliminar} onEditar={manejarEditar} />
        ) : (
          <AsistenteBienvenida />
        )}

        {/* Input */}
        <AsistenteInput onEnviar={enviarMensaje} onCancelar={cancelar} cargando={cargando} />
      </div>
    </div>
  );
}
