"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { User, MessageSquare, Pencil, Trash2, Check, X } from "lucide-react";
import type { MensajeAsistente } from "@/stores/asistente";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-4 w-3/4 bg-fondo-oscuro/30 rounded" />,
});

interface AsistenteMensajeProps {
  mensaje: MensajeAsistente;
  onEliminar: (id: string) => void;
  onEditar: (id: string, nuevoTexto: string) => void;
  esPenultimo: boolean;
}

export function AsistenteMensaje({
  mensaje,
  onEliminar,
  onEditar,
  esPenultimo,
}: AsistenteMensajeProps) {
  const esUsuario = mensaje.rol === "usuario";
  const [editando, setEditando] = useState(false);
  const [textoEdicion, setTextoEdicion] = useState(mensaje.texto);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editando && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [editando, textoEdicion]);

  const manejarEditar = useCallback(() => {
    if (textoEdicion.trim() && textoEdicion !== mensaje.texto) {
      onEditar(mensaje.id, textoEdicion);
    }
    setEditando(false);
  }, [textoEdicion, mensaje.id, mensaje.texto, onEditar]);

  const manejarCancelar = useCallback(() => {
    setTextoEdicion(mensaje.texto);
    setEditando(false);
  }, [mensaje.texto]);

  const manejarKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        manejarEditar();
      }
      if (e.key === "Escape") manejarCancelar();
    },
    [manejarEditar, manejarCancelar]
  );

  return (
    <div className={`group flex gap-2.5 ${esUsuario ? "flex-col items-end" : "justify-start"}`}>
      <div className={`flex gap-2.5 ${esUsuario ? "justify-end" : "justify-start"}`}>
        {!esUsuario && (
          <div className="w-7 h-7 rounded-lg bg-primario/10 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare className="w-3.5 h-3.5 text-primario" />
          </div>
        )}
        <div
          className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
            esUsuario
              ? "bg-primario text-primario-texto rounded-br-md"
              : "bg-fondo-card border border-borde/40 rounded-bl-md prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-texto prose-headings:text-texto"
          }`}
        >
          {editando ? (
            <div className="flex flex-col gap-2">
              <textarea
                ref={inputRef}
                value={textoEdicion}
                onChange={(e) => setTextoEdicion(e.target.value)}
                onKeyDown={manejarKeyDown}
                rows={1}
                className="w-full resize-none rounded-lg bg-primario-hover/20 text-primario-texto placeholder:text-primario-texto/40 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primario-texto/30"
              />
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={manejarCancelar}
                  className="p-1 rounded hover:bg-primario-hover/30 text-primario-texto/60 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={manejarEditar}
                  disabled={!textoEdicion.trim()}
                  className="p-1 rounded hover:bg-primario-hover/30 text-primario-texto transition-colors disabled:opacity-30"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : esUsuario ? (
            <p className="whitespace-pre-wrap break-words">{mensaje.texto || ""}</p>
          ) : (
            <div className="text-texto">
              {mensaje.texto ? (
                <ReactMarkdown>{mensaje.texto}</ReactMarkdown>
              ) : null}
            </div>
          )}

          {!esUsuario && mensaje.texto && (
            <span className="block text-[10px] text-texto-terciario mt-1">
              <User className="w-2.5 h-2.5 inline mr-0.5" />
              Arianna
            </span>
          )}
        </div>
        {esUsuario && (
          <div className="w-7 h-7 rounded-lg bg-primario flex items-center justify-center shrink-0 mt-0.5">
            <User className="w-3.5 h-3.5 text-primario-texto" />
          </div>
        )}
      </div>

      {esUsuario && !editando && (
        <div className="flex items-center gap-1 self-end mr-10 opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
          <button
            onClick={() => { setEditando(true); setTextoEdicion(mensaje.texto); }}
            className="p-0.5 rounded hover:bg-fondo-oscuro/40 text-texto-terciario hover:text-texto transition-colors"
          >
            <Pencil className="w-3 h-3" />
          </button>
          {esPenultimo && (
            <button
              onClick={() => onEliminar(mensaje.id)}
              className="p-0.5 rounded hover:bg-error/10 text-texto-terciario hover:text-error transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
