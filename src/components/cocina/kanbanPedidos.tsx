"use client";

import { useState } from "react";
import { cambiarEstadoPedido } from "@/lib/acciones/cocina";
import { formatearPrecio } from "@/lib/formato";
import type { Pedido } from "@/types";

const ESTADOS = ["pendiente", "preparando", "listo"] as const;
const COLOR_BADGE: Record<string, string> = {
  pendiente: "bg-blue-100 text-blue-700",
  preparando: "bg-amber-100 text-amber-700",
  listo: "bg-green-100 text-green-700",
  entregado: "bg-gray-100 text-gray-500",
};
const ETIQUETA_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
};
const ICONO_ESTADO: Record<string, string> = {
  pendiente: "🔵",
  preparando: "🟡",
  listo: "🟢",
};

interface KanbanPedidosProps {
  pedidosIniciales: Pedido[];
}

export function KanbanPedidos({ pedidosIniciales }: KanbanPedidosProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");

  const pedidosPorEstado = (estado: string) =>
    pedidos.filter((p) => p.estado === estado);

  const handleCambiarEstado = async (
    pedidoId: string,
    nuevoEstado: string
  ) => {
    setMensaje("");
    const resultado = await cambiarEstadoPedido(
      pedidoId,
      nuevoEstado as "preparando" | "listo" | "entregado",
      "cocinero"
    );

    if (resultado.error) {
      setMensaje(resultado.error);
      return;
    }

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId ? { ...p, estado: nuevoEstado as Pedido["estado"] } : p
      )
    );
  };

  const tiempoTranscurrido = (fecha: Date) => {
    const minutos = Math.floor(
      (Date.now() - new Date(fecha).getTime()) / 60000
    );
    if (minutos < 1) return "Ahora";
    if (minutos === 1) return "1 min";
    return `${minutos} min`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {mensaje && (
        <div className="mx-4 mt-2 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg">
          {mensaje}
        </div>
      )}
      <div className="flex-1 flex gap-3 p-4 overflow-x-auto">
        {ESTADOS.map((estado) => (
          <div key={estado} className="flex-1 min-w-[280px] flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="text-xs font-semibold uppercase text-[#78716C] tracking-wide">
                {ETIQUETA_ESTADO[estado]}
              </span>
              <span className="text-xs bg-[#F5F0EB] text-[#78716C] px-2 py-0.5 rounded-full">
                {pedidosPorEstado(estado).length}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {pedidosPorEstado(estado).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-[#A8A29E] text-xs">
                  <span className="text-2xl mb-2">🍳</span>
                  Sin pedidos
                </div>
              ) : (
                pedidosPorEstado(estado).map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-white rounded-xl p-3 border border-[#E7E0D8] shadow-[0_2px_8px_rgba(45,42,38,0.06)]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${COLOR_BADGE[pedido.estado]}`}
                      >
                        {ICONO_ESTADO[pedido.estado]}{" "}
                        {ETIQUETA_ESTADO[pedido.estado]}
                      </span>
                      <span className="text-xs font-semibold text-[#2D2A26]">
                        Mesa {pedido.mesa_id ?? "?"}
                      </span>
                    </div>
                    <p
                      className={`text-[10px] mb-2 ${
                        Number(tiempoTranscurrido(new Date(pedido.creado_en)).split(" ")[0]) > 10
                          ? "text-[#F59E0B] font-medium"
                          : "text-[#A8A29E]"
                      }`}
                    >
                      ⏱                       {tiempoTranscurrido(new Date(pedido.creado_en))}
                    </p>
                    <div className="text-xs text-[#2D2A26] space-y-0.5 mb-3">
                      <p>Pedido #{pedido.id.slice(0, 6)}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#2D2A26] mb-2">
                      {formatearPrecio(pedido.total)}
                    </p>
                    {estado === "pendiente" && (
                      <button
                        onClick={() =>
                          handleCambiarEstado(pedido.id, "preparando")
                        }
                        className="w-full py-2 bg-[#C44536] text-white rounded-lg text-xs font-medium hover:bg-[#A8382C] transition-colors active:scale-[0.98]"
                      >
                        Iniciar →
                      </button>
                    )}
                    {estado === "preparando" && (
                      <button
                        onClick={() =>
                          handleCambiarEstado(pedido.id, "listo")
                        }
                        className="w-full py-2 bg-[#65A30D] text-white rounded-lg text-xs font-medium hover:bg-[#4d7c0f] transition-colors active:scale-[0.98]"
                      >
                        ✅ Listo
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
