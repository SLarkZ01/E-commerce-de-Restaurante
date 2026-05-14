"use client";

import { useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { cambiarEstadoPedido, type PedidoConItems } from "@/lib/acciones/cocina";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { KanbanColumna } from "./KanbanColumna";
import { ESTADOS, CONFIG_ESTADO } from "./configEstados";

export { SkeletonKanban } from "./SkeletonKanban";

interface KanbanPedidosProps {
  pedidosIniciales: PedidoConItems[];
}

export function KanbanPedidos({ pedidosIniciales }: KanbanPedidosProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");

  const pedidosPorEstado = useCallback(
    (estado: string) => pedidos.filter((p) => p.estado === estado),
    [pedidos]
  );

  const handleCambiarEstado = async (pedidoId: string, nuevoEstado: string) => {
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
