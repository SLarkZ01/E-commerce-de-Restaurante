"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  const [columnaActiva, setColumnaActiva] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { cambiarEstado } = usePedidos();

  useEffect(() => {
    setPedidos(pedidosIniciales);
  }, [pedidosIniciales]);

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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = columnRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setColumnaActiva(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    columnRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [pedidos]);

  const handleCambiarEstado = async (pedidoId: string, nuevoEstado: string) => {
    setMensaje("");
    const resultado = await cambiarEstado(
      pedidoId,
      nuevoEstado as "preparando" | "listo" | "entregado"
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
        <div className="mx-3 sm:mx-6 mt-2 sm:mt-4">
          <MensajeToast mensaje={mensaje} variante="error" onClose={() => setMensaje("")} />
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 flex md:flex-row gap-3 md:gap-4 px-3 md:px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {ESTADOS.map((estado, index) => (
          <div
            key={estado}
            ref={(el) => { columnRefs.current[index] = el; }}
            className="snap-start shrink-0 w-[85vw] md:w-auto md:flex-1 md:shrink h-full"
          >
            <KanbanColumna
              estado={estado}
              config={CONFIG_ESTADO[estado]}
              pedidos={pedidosPorEstado(estado)}
              onCambiarEstado={handleCambiarEstado}
            />
          </div>
        ))}
      </div>

      <div className="flex md:hidden justify-center gap-2 py-3 bg-fondo/95 backdrop-blur-sm border-t border-borde/40">
        {ESTADOS.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              columnRefs.current[index]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
              });
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              columnaActiva === index
                ? "w-6 bg-primario"
                : "w-2 bg-borde"
            }`}
            aria-label={`Ir a columna ${ESTADOS[index]}`}
          />
        ))}
      </div>
    </div>
  );
}
