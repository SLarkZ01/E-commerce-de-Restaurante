"use client";

import { useState, useCallback } from "react";
import { useMiPedidoRealtime, type CallbacksMiPedido } from "@/hooks/useMiPedidoRealtime";
import { obtenerEstadoPedidoPublico } from "@/lib/acciones/pedidoPublico";
import type { EstadoPedido } from "@/types";

export type EstadoRastreo =
  | "input"
  | "validando"
  | "rastreando"
  | "entregado"
  | "no_encontrado"
  | "error";

export interface UseRastrearPedidoReturn {
  estado: EstadoRastreo;
  inputId: string;
  estadoActual: EstadoPedido | null;
  setInputId: (id: string) => void;
  manejarBuscar: () => void;
  manejarReiniciar: () => void;
}

export function useRastrearPedido(): UseRastrearPedidoReturn {
  const [estado, setEstado] = useState<EstadoRastreo>("input");
  const [inputId, setInputId] = useState("");
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [estadoActual, setEstadoActual] = useState<EstadoPedido | null>(null);

  const onEstadoCambiado = useCallback((nuevoEstado: EstadoPedido) => {
    setEstadoActual(nuevoEstado);
    if (nuevoEstado === "entregado") {
      setEstado("entregado");
    }
  }, []);

  const callbacks: CallbacksMiPedido = { onEstadoCambiado };

  useMiPedidoRealtime(
    estado === "rastreando" ? pedidoId : null,
    callbacks
  );

  const manejarBuscar = useCallback(() => {
    const idLimpio = inputId.trim().toUpperCase();
    if (!idLimpio) return;

    setEstado("validando");
    setPedidoId(null);
    setEstadoActual(null);

    obtenerEstadoPedidoPublico(idLimpio)
      .then((pedido) => {
        if (!pedido) {
          setEstado("no_encontrado");
          return;
        }

        setPedidoId(pedido.id);
        setEstadoActual(pedido.estado);

        if (pedido.estado === "entregado") {
          setEstado("entregado");
        } else {
          setEstado("rastreando");
        }
      })
      .catch(() => {
        setEstado("error");
      });
  }, [inputId]);

  const manejarReiniciar = useCallback(() => {
    setEstado("input");
  }, []);

  return {
    estado,
    inputId,
    estadoActual,
    setInputId,
    manejarBuscar,
    manejarReiniciar,
  };
}
