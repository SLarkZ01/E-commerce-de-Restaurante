"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { usePedidos } from "@/hooks/usePedidos";
import { useRealtime } from "@/hooks/useRealtime";
import { useTiempoTranscurrido } from "@/hooks/useTiempoTranscurrido";
import { obtenerPedidoConDetalles } from "@/lib/acciones/cocina";
import type { PedidoConDetalles } from "@/types";

export function useEntregaPedidos(pedidosIniciales: PedidoConDetalles[]) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const { cambiarEstado } = usePedidos();

  useEffect(() => {
    setPedidos(pedidosIniciales);
  }, [pedidosIniciales]);
  const { esUrgente } = useTiempoTranscurrido();

  useRealtime("pedidos", "UPDATE", useCallback(async (payload) => {
    const id = (payload.new as { id: string }).id;
    const pedidoCompleto = await obtenerPedidoConDetalles(id);
    if (!pedidoCompleto) return;

    setPedidos((prev) => {
      const existe = prev.find((p) => p.id === id);
      if (existe) {
        return prev.map((p) =>
          p.id === id ? { ...p, ...pedidoCompleto } : p
        );
      }
      return [...prev, pedidoCompleto];
    });
  }, []), "estado=eq.listo");

  const handleEntregar = async (pedidoId: string) => {
    setConfirmando(null);
    const resultado = await cambiarEstado(pedidoId, "entregado");

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

  const urgentes = useMemo(
    () => pedidos.filter((p) => esUrgente(p.creado_en, 15)).length,
    [pedidos, esUrgente]
  );

  return {
    pedidos,
    confirmando,
    mensaje,
    tipoMensaje,
    urgentes,
    handleEntregar,
    handleCancelarConfirmacion,
    handleSolicitarConfirmacion,
    limpiarMensaje,
  };
}
