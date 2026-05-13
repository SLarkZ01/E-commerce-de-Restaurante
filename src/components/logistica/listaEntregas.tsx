"use client";

import { useState, useEffect } from "react";
import { Clock, PackageCheck, AlertTriangle, Check, X } from "lucide-react";
import { cambiarEstadoPedido } from "@/lib/acciones/cocina";
import { formatearPrecio } from "@/lib/formato";
import type { Pedido } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ListaEntregasProps {
  pedidosIniciales: Pedido[];
}

export function ListaEntregas({ pedidosIniciales }: ListaEntregasProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 30000);
    return () => clearInterval(intervalo);
  }, []);

  const handleEntregar = async (pedidoId: string) => {
    setConfirmando(null);
    const resultado = await cambiarEstadoPedido(
      pedidoId,
      "entregado",
      "mesero"
    );

    if (resultado.error) {
      setMensaje(resultado.error);
      return;
    }

    setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    setMensaje("Pedido entregado correctamente");
    setTimeout(() => setMensaje(""), 3000);
  };

  const tiempoTranscurrido = (fecha: Date) => {
    const min = Math.floor((ahora - new Date(fecha).getTime()) / 60000);
    if (min < 1) return "Ahora";
    return `Hace ${min} min`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {mensaje && (
        <div className="mb-4 px-4 py-3 bg-exito/10 text-exito text-sm rounded-xl text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          {mensaje}
        </div>
      )}

      {pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-texto-terciario">
          <div className="w-16 h-16 rounded-full bg-fondo-oscuro flex items-center justify-center mb-4">
            <PackageCheck className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium text-texto-secundario">No hay platos listos para entregar</p>
          <p className="text-xs mt-1">Esperando que cocina termine...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido) => {
            const minutos = Math.floor((ahora - new Date(pedido.creado_en).getTime()) / 60000);
            const esUrgente = minutos > 15;
            return (
              <div
                key={pedido.id}
                className={`bg-fondo-card rounded-xl border-2 p-5 shadow-[0_1px_3px_rgba(45,42,38,0.04)] transition-all ${
                  esUrgente
                    ? "border-advertencia/50 hover:shadow-[0_4px_16px_rgba(245,158,11,0.15)]"
                    : "border-exito/50 hover:shadow-[0_4px_16px_rgba(101,163,13,0.15)]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs font-semibold ${esUrgente ? "bg-advertencia/10 text-advertencia" : "bg-exito/10 text-exito"}`}>
                      <PackageCheck className="w-3.5 h-3.5 mr-1" />
                      Listo para entregar
                    </Badge>
                    {esUrgente && (
                      <Badge variant="destructive" className="text-xs font-semibold animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        Entregar pronto
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className={`w-3.5 h-3.5 ${esUrgente ? "text-advertencia animate-pulse" : "text-texto-terciario"}`} />
                    <span className={`text-xs ${esUrgente ? "text-advertencia font-semibold" : "text-texto-terciario"}`}>
                      {tiempoTranscurrido(new Date(pedido.creado_en))}
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
                    <Button
                      onClick={() => setConfirmando(null)}
                      variant="outline"
                      className="flex-1"
                    >
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

export function SkeletonListaEntregas() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border-2 border-borde/60 p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="w-28 h-6 rounded-full" />
              <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="w-20 h-7" />
            <Skeleton className="w-full h-px" />
            <div className="flex justify-between">
              <Skeleton className="w-10 h-4" />
              <Skeleton className="w-20 h-5" />
            </div>
            <Skeleton className="w-full h-11 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
