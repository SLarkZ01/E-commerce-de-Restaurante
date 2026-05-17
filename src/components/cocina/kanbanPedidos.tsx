"use client";

import { useState, useCallback } from "react";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { KanbanColumna } from "./KanbanColumna";
import { ESTADOS, CONFIG_ESTADO } from "./configEstados";
import { usePedidos } from "@/hooks/usePedidos";
import { usePedidosRealtime } from "@/hooks/usePedidosRealtime";
import type { PedidoConDetalles } from "@/types";

export { SkeletonKanban } from "./SkeletonKanban";

interface KanbanPedidosProps {
  pedidosIniciales: PedidoConDetalles[];
}

export function KanbanPedidos({ pedidosIniciales }: KanbanPedidosProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const { cambiarEstado } = usePedidos();

  const pedidosPorEstado = useCallback(
    (estado: string) => pedidos.filter((p) => p.estado === estado),
    [pedidos]
  );

  usePedidosRealtime({
    onNuevoPedido: useCallback((nuevoPedido: PedidoConDetalles) => {
      setPedidos((prev) => {
        if (prev.some((p) => p.id === nuevoPedido.id)) return prev;
        return [nuevoPedido, ...prev];
      });
    }, []),

    onCambioEstado: useCallback((pedidoId: string, nuevoEstado: string) => {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId
            ? { ...p, estado: nuevoEstado as PedidoConDetalles["estado"] }
            : p
        )
      );
    }, []),

    onPedidoEntregado: useCallback((pedidoId: string) => {
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    }, []),
  });

  const handleCambiarEstado = async (pedidoId: string, nuevoEstado: string) => {
    setMensaje("");
    const resultado = await cambiarEstado(
      pedidoId,
      nuevoEstado as "preparando" | "listo" | "entregado",
      "cocinero"
    );

    if (resultado.error) {
      setMensaje(resultado.error);
      return;
    }

    if (nuevoEstado === "entregado") {
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    } else {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId
            ? { ...p, estado: nuevoEstado as PedidoConDetalles["estado"] }
            : p
        )
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {mensaje && (
        <div className="mx-6 mt-4">
          <MensajeToast mensaje={mensaje} variante="error" onClose={() => setMensaje("")} />
        </div>
      )}
      <div className="flex-1 flex flex-col md:flex-row gap-3 p-4 overflow-auto">
        {ESTADOS.map((estado) => (
          <KanbanColumna
            key={estado}
            estado={estado}
            config={CONFIG_ESTADO[estado]}
            pedidos={pedidosPorEstado(estado)}
            onCambiarEstado={handleCambiarEstado}
          />
        ))}
      </div>
    </div>
  );
}
