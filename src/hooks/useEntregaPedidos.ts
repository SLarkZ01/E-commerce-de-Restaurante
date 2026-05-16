"use client";

import { useState, useCallback } from "react";
import { usePedidos } from "@/hooks/usePedidos";
import { useRealtime } from "@/hooks/useRealtime";
import type { PedidoConDetalles } from "@/types";

export function useEntregaPedidos(pedidosIniciales: PedidoConDetalles[]) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const { cambiarEstado } = usePedidos();

  useRealtime("pedidos", "UPDATE", useCallback((payload) => {
    const actualizado = payload.new as PedidoConDetalles;
    setPedidos((prev) => {
      const existe = prev.find((p) => p.id === actualizado.id);
      if (existe) return prev;
      return [...prev, actualizado];
    });
  }, []), "estado=eq.listo");

  const handleEntregar = async (pedidoId: string) => {
    setConfirmando(null);
    const resultado = await cambiarEstado(pedidoId, "entregado", "mesero");

    if (resultado.error) {
      setMensaje(resultado.error);
      setTipoMensaje("error");
      return;
    }

    setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    setMensaje("Pedido entregado correctamente");
    setTipoMensaje("exito");
  };

  const handleCancelarConfirmacion = () => setConfirmando(null);
  const handleSolicitarConfirmacion = (pedidoId: string) => setConfirmando(pedidoId);
  const limpiarMensaje = () => setMensaje("");

  return {
    pedidos,
    confirmando,
    mensaje,
    tipoMensaje,
    handleEntregar,
    handleCancelarConfirmacion,
    handleSolicitarConfirmacion,
    limpiarMensaje,
  };
}
