"use client";

import { useState, useCallback, useRef } from "react";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { KanbanColumna } from "./KanbanColumna";
import { ESTADOS, CONFIG_ESTADO } from "./configEstados";
import { usePedidos } from "@/hooks/usePedidos";
import { useRealtime } from "@/hooks/useRealtime";
import type { PedidoConItems, Pedido } from "@/types";

export { SkeletonKanban } from "./SkeletonKanban";

interface KanbanPedidosProps {
  pedidosIniciales: PedidoConItems[];
}

export function KanbanPedidos({ pedidosIniciales }: KanbanPedidosProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const { cambiarEstado } = usePedidos();
  const pedidosRef = useRef(pedidos);
  pedidosRef.current = pedidos;

  const pedidosPorEstado = useCallback(
    (estado: string) => pedidos.filter((p) => p.estado === estado),
    [pedidos]
  );

  // Observer: suscribirse a nuevos pedidos en tiempo real
  useRealtime("pedidos", "INSERT", useCallback((payload) => {
    const nuevo = payload.new as Pedido;
    if (nuevo.estado === "pendiente") {
      // Refetch completo para obtener los items del pedido
      // (los inserts individuales no incluyen relaciones)
      window.location.reload();
    }
  }, []));

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
            ? { ...p, estado: nuevoEstado as PedidoConItems["estado"] }
            : p
        )
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {mensaje && (
        <div className="mx-6 mt-4">
          <MensajeToast
            mensaje={mensaje}
            onClose={() => setMensaje("")}
            variante="error"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row gap-5 p-6 overflow-auto">
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
