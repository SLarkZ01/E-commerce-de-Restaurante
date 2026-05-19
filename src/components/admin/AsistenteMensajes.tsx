"use client";

import { useEffect, useRef } from "react";
import { AsistenteMensaje } from "./AsistenteMensaje";
import { AsistenteCargando } from "./AsistenteCargando";
import type { MensajeAsistente } from "@/stores/asistente";

interface AsistenteMensajesProps {
  mensajes: MensajeAsistente[];
  cargando: boolean;
  onEliminar: (id: string) => void;
  onEditar: (id: string, nuevoTexto: string) => void;
}

export function AsistenteMensajes({
  mensajes,
  cargando,
  onEliminar,
  onEditar,
}: AsistenteMensajesProps) {
  const finRef = useRef<HTMLDivElement>(null);
  const total = mensajes.length;

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {mensajes.map((m, i) => (
        <AsistenteMensaje
          key={m.id}
          mensaje={m}
          onEliminar={onEliminar}
          onEditar={onEditar}
          esPenultimo={i === total - 2}
        />
      ))}
      {cargando && <AsistenteCargando />}
      <div ref={finRef} />
    </div>
  );
}
