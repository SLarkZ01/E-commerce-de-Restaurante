"use client";

import { Plus, Trash2, MessageSquare, PanelLeftClose, X } from "lucide-react";
import { usarAsistenteStore } from "@/stores/asistente";
import { useAsistente } from "./AsistenteProvider";
import { eliminarConversacionRemota } from "@/lib/acciones/asistente";

export function AsistenteSidebar() {
  const store = usarAsistenteStore();
  const { sidebarAbierto, esMovil, cerrarSidebar } = useAsistente();

  const conversaciones = store.conversaciones;
  const activaId = store.conversacionActivaId;

  const manejarNueva = () => {
    store.crearConversacion();
  };

  const manejarEliminar = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    store.eliminarConversacion(id);
    eliminarConversacionRemota(id);
  };

  const contenido = (
    <>
      <div className="px-3 py-3 border-b border-borde/40 flex items-center justify-between">
        <h2 className="font-playfair text-sm font-bold text-texto">Conversaciones</h2>
        <button
          onClick={cerrarSidebar}
          className="p-1.5 rounded-lg hover:bg-fondo-oscuro/30 text-texto-terciario hover:text-texto transition-colors"
        >
          {esMovil ? <X className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      <button
        onClick={manejarNueva}
        className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-borde/50 text-texto-secundario hover:text-primario hover:border-primario/30 hover:bg-primario/5 text-xs font-medium transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Nueva conversación
      </button>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {conversaciones.map((c) => (
          <button
            key={c.id}
            onClick={() => { store.activarConversacion(c.id); if (esMovil) cerrarSidebar(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors group ${
              c.id === activaId
                ? "bg-primario/10 text-primario font-medium"
                : "text-texto-secundario hover:bg-fondo-oscuro/30"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 truncate">{c.titulo}</span>
            <span
              onClick={(e) => manejarEliminar(c.id, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") manejarEliminar(c.id, e as unknown as React.MouseEvent); }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error/10 text-texto-terciario hover:text-error transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </span>
          </button>
        ))}
      </div>
    </>
  );

  if (esMovil) {
    return (
      <>
        {sidebarAbierto && (
          <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={cerrarSidebar} />
        )}
        <aside
          className={`fixed left-0 top-0 bottom-0 z-40 w-72 bg-fondo-card border-r border-borde/40 flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${
            sidebarAbierto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {contenido}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={`border-r border-borde/40 bg-fondo-card flex flex-col h-full shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
        sidebarAbierto ? "w-64 xl:w-72" : "w-0"
      }`}
    >
      <div className="w-64 xl:w-72 flex flex-col h-full">
        {contenido}
      </div>
    </aside>
  );
}
