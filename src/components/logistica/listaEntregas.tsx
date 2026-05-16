"use client";

import { useState, useCallback } from "react";
import { Clock, PackageCheck, AlertTriangle, Check, X } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { useTiempoTranscurrido } from "@/hooks/useTiempoTranscurrido";
import { usePedidos } from "@/hooks/usePedidos";
import { useRealtime } from "@/hooks/useRealtime";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Pedido } from "@/types";

export { SkeletonListaEntregas } from "./SkeletonListaEntregas";

interface ListaEntregasProps {
  pedidosIniciales: Pedido[];
}

export function ListaEntregas({ pedidosIniciales }: ListaEntregasProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const { formatear, esUrgente } = useTiempoTranscurrido();
  const { cambiarEstado } = usePedidos();

  // Observer: suscribirse a pedidos que pasan a estado "listo" en tiempo real
  useRealtime("pedidos", "UPDATE", useCallback((payload) => {
    const actualizado = payload.new as Pedido;
    if (actualizado.estado === "listo") {
      setPedidos((prev) => {
        const existe = prev.find((p) => p.id === actualizado.id);
        if (existe) return prev;
        return [...prev, actualizado];
      });
    }
  }, []));

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

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {mensaje && (
        <div className="mb-4">
          <MensajeToast mensaje={mensaje} variante={tipoMensaje} onClose={() => setMensaje("")} />
        </div>
      )}

      {pedidos.length === 0 ? (
        <EstadoVacio
          icono={PackageCheck}
          titulo="No hay platos listos para entregar"
          descripcion="Esperando que cocina termine..."
        />
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido) => {
            const urgente = esUrgente(pedido.creado_en, 15);
            return (
              <div
                key={pedido.id}
                className={`bg-fondo-card rounded-xl border-2 p-5 shadow-[0_1px_3px_rgba(45,42,38,0.04)] transition-all ${
                  urgente
                    ? "border-advertencia/50 hover:shadow-[0_4px_16px_rgba(245,158,11,0.15)]"
                    : "border-exito/50 hover:shadow-[0_4px_16px_rgba(101,163,13,0.15)]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-xs font-semibold ${urgente ? "bg-advertencia/10 text-advertencia" : "bg-exito/10 text-exito"}`}
                    >
                      <PackageCheck className="w-3.5 h-3.5 mr-1" />
                      Listo para entregar
                    </Badge>
                    {urgente && (
                      <Badge variant="destructive" className="text-xs font-semibold animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        Entregar pronto
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock
                      className={`w-3.5 h-3.5 ${urgente ? "text-advertencia animate-pulse" : "text-texto-terciario"}`}
                    />
                    <span
                      className={`text-xs ${urgente ? "text-advertencia font-semibold" : "text-texto-terciario"}`}
                    >
                      {formatear(pedido.creado_en)}
                    </span>
                  </div>
                </div>

                <p className="font-playfair text-2xl font-bold text-texto mb-3">
                  Mesa {pedido.mesa_id ?? "?"}
                </p>

                <Separator className="mb-3" />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-texto-secundario">Total</span>
                  <span className="font-playfair text-lg font-bold text-primario tabular-nums">
                    {formatearPrecio(pedido.total)}
                  </span>
                </div>

                {confirmando === pedido.id ? (
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setConfirmando(null)} variant="outline" className="flex-1">
                      <X className="w-4 h-4 mr-1.5" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => handleEntregar(pedido.id)}
                      className="flex-1 bg-exito hover:bg-exito/90 text-white"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Confirmar
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setConfirmando(pedido.id)}
                    className="w-full mt-4 h-11 bg-exito hover:bg-exito/90 text-white rounded-xl font-semibold active:scale-[0.98]"
                  >
                    <PackageCheck className="w-4 h-4 mr-2" />
                    Marcar como Entregado
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
