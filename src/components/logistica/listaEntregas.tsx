"use client";

import { useState } from "react";
import { cambiarEstadoPedido } from "@/lib/acciones/cocina";
import { formatearPrecio } from "@/lib/formato";
import type { Pedido } from "@/types";

interface ListaEntregasProps {
  pedidosIniciales: Pedido[];
}

const TIEMPO_TRANSCURRIDO = (fecha: Date) => {
  const min = Math.floor((Date.now() - new Date(fecha).getTime()) / 60000);
  if (min < 1) return "Ahora";
  return `Hace ${min} min`;
};

export function ListaEntregas({ pedidosIniciales }: ListaEntregasProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [confirmando, setConfirmando] = useState<string | null>(null);

  const handleEntregar = async (pedidoId: string) => {
    setConfirmando(null);
    const resultado = await cambiarEstadoPedido(
      pedidoId,
      "entregado",
      "mesero"
    );

    if (resultado.error) {
      setMensaje(resultado.error);
      return;
    }

    setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    setMensaje("Pedido entregado correctamente");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {mensaje && (
        <div className="mb-3 px-3 py-2 bg-green-50 text-green-700 text-sm rounded-lg text-center">
          {mensaje}
        </div>
      )}

      {pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#A8A29E]">
          <span className="text-4xl mb-3">✅</span>
          <p className="text-sm">No hay platos listos para entregar</p>
          <p className="text-xs mt-1">
            Esperando que cocina termine...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className={`bg-white rounded-xl border-2 p-4 shadow-sm ${
                  Number(TIEMPO_TRANSCURRIDO(new Date(pedido.creado_en)).match(/\d+/)?.[0] ?? 0) > 15
                  ? "border-[#F59E0B]"
                  : "border-[#65A30D]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    🟢 Listo para entregar
                  </span>
                  {Number(TIEMPO_TRANSCURRIDO(new Date(pedido.creado_en)).match(/\d+/)?.[0] ?? 0) > 15 && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">
                      ⏰ Entregar pronto
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#A8A29E]">
                  {TIEMPO_TRANSCURRIDO(new Date(pedido.creado_en))}
                </span>
              </div>

              <p className="text-2xl font-bold text-[#2D2A26] mb-3">
                Mesa {pedido.mesa_id ?? "?"}
              </p>

              <div className="space-y-1 mb-3">
                <p className="text-sm text-[#2D2A26]">
                  Pedido #{pedido.id.slice(0, 6)}
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#E7E0D8]">
                <span className="text-sm text-[#78716C]">Total</span>
                <span className="text-lg font-bold text-[#C44536]">
                  {formatearPrecio(pedido.total)}
                </span>
              </div>

              {confirmando === pedido.id ? (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setConfirmando(null)}
                    className="flex-1 py-2.5 border border-[#E7E0D8] rounded-xl text-sm text-[#78716C] hover:bg-[#F5F0EB] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleEntregar(pedido.id)}
                    className="flex-1 py-2.5 bg-[#65A30D] text-white rounded-xl text-sm font-medium hover:bg-[#4d7c0f] transition-colors active:scale-[0.98]"
                  >
                    ✅ Confirmar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmando(pedido.id)}
                  className="w-full mt-3 py-3 bg-[#65A30D] text-white rounded-xl text-sm font-medium hover:bg-[#4d7c0f] transition-colors active:scale-[0.98]"
                >
                  ✅ Marcar como Entregado
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
