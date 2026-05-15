"use client";

import { useState, useCallback, useEffect } from "react";
import { crearCliente } from "@/lib/supabase/browser";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { KanbanColumna } from "./KanbanColumna";
import { ESTADOS, CONFIG_ESTADO } from "./configEstados";
import { usePedidos } from "@/hooks/usePedidos";
import { useRealtime } from "@/hooks/useRealtime";
import type { PedidoConItems, Pedido, ItemPedidoConPlato } from "@/types";

export { SkeletonKanban } from "./SkeletonKanban";

interface KanbanPedidosProps {
  pedidosIniciales: PedidoConItems[];
}

async function obtenerItemsPedido(pedidoId: string): Promise<ItemPedidoConPlato[]> {
  const supabase = crearCliente();
  const { data } = await supabase
    .from("items_pedido")
    .select("cantidad, precio_unitario, platos(nombre)")
    .eq("pedido_id", pedidoId);

  if (!data) return [];

  return (data as unknown[]).map((item: unknown) => {
    const i = item as { cantidad: number; precio_unitario: number; platos: Array<{ nombre: string }> | null };
    return {
      plato_nombre: i.platos?.[0]?.nombre ?? "Plato",
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
    };
  });
}

export function KanbanPedidos({ pedidosIniciales }: KanbanPedidosProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const { cambiarEstado } = usePedidos();

  const pedidosPorEstado = useCallback(
    (estado: string) => pedidos.filter((p) => p.estado === estado),
    [pedidos]
  );

  // Observer: detectar nuevos pedidos vía Realtime y agregarlos sin recargar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const manejarInsercion = useCallback((payload: any) => {
    const nuevo = payload.new as Pedido;
    if (nuevo?.estado !== "pendiente") return;

    // Verificar si ya tenemos este pedido
    setPedidos((prev) => {
      if (prev.some((p) => p.id === nuevo.id)) return prev;

      // Fetch items del pedido y agregarlo al estado
      obtenerItemsPedido(nuevo.id).then((items) => {
        setPedidos((current) => {
          if (current.some((p) => p.id === nuevo.id)) return current;
          return [{ ...nuevo, items } as PedidoConItems, ...current];
        });
      });

      return prev;
    });
  }, []);

  useRealtime("pedidos", "INSERT", manejarInsercion);

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
