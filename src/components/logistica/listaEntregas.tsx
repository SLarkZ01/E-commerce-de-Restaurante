"use client";

import { PackageCheck } from "lucide-react";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { useEntregaPedidos } from "@/hooks/useEntregaPedidos";
import { PanelHeader } from "./PanelHeader";
import { EntregaCard } from "./EntregaCard";
import type { PedidoConDetalles } from "@/types";

export { SkeletonListaEntregas } from "./SkeletonListaEntregas";

interface ListaEntregasProps {
  pedidosIniciales: PedidoConDetalles[];
}

export function ListaEntregas({ pedidosIniciales }: ListaEntregasProps) {
  const {
    pedidos,
    confirmando,
    mensaje,
    tipoMensaje,
    urgentes,
    handleEntregar,
    handleCancelarConfirmacion,
    handleSolicitarConfirmacion,
    limpiarMensaje,
  } = useEntregaPedidos(pedidosIniciales);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {mensaje && (
        <div className="mb-4">
          <MensajeToast
            mensaje={mensaje}
            variante={tipoMensaje}
            onClose={limpiarMensaje}
          />
        </div>
      )}

      {pedidos.length === 0 ? (
        <EstadoVacio
          icono={PackageCheck}
          titulo="No hay platos listos para entregar"
          descripcion="Esperando que cocina termine..."
        />
      ) : (
        <>
          <PanelHeader totalPedidos={pedidos.length} urgentes={urgentes} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {pedidos.map((pedido) => (
              <EntregaCard
                key={pedido.id}
                pedido={pedido}
                isConfirming={confirmando === pedido.id}
                onConfirm={() => handleEntregar(pedido.id)}
                onCancel={handleCancelarConfirmacion}
                onRequestConfirm={() => handleSolicitarConfirmacion(pedido.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
