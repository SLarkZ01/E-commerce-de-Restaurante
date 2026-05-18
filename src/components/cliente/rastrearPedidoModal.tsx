"use client";

import { useState, useCallback } from "react";
import { Search, Clock, Flame, ChefHat, CircleCheck, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CargandoPedido from "@/components/ui/cargando-pedido";
import { useRastrearPedido } from "./RastrearPedidoProvider";
import { useMiPedidoRealtime, type CallbacksMiPedido } from "@/hooks/useMiPedidoRealtime";
import { obtenerEstadoPedidoPublico } from "@/lib/acciones/pedidoPublico";
import type { EstadoPedido } from "@/types";

type EstadoRastreo = "input" | "validando" | "rastreando" | "entregado" | "no_encontrado" | "error";

const ESTADOS: EstadoPedido[] = ["pendiente", "preparando", "listo", "entregado"];

const ICONO_ESTADO: Record<EstadoPedido, typeof Clock> = {
  pendiente: Clock,
  preparando: Flame,
  listo: ChefHat,
  entregado: CircleCheck,
};

const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  pendiente: "Pendiente",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
};

const COLOR_ESTADO: Record<EstadoPedido, string> = {
  pendiente: "bg-slate-100 text-slate-500 border-slate-200",
  preparando: "bg-amber-100 text-amber-600 border-amber-200",
  listo: "bg-emerald-100 text-emerald-600 border-emerald-200",
  entregado: "bg-green-100 text-green-700 border-green-200",
};

const COLOR_BARRA_ESTADO: Record<EstadoPedido, string> = {
  pendiente: "bg-slate-400",
  preparando: "bg-amber-500",
  listo: "bg-emerald-500",
  entregado: "bg-green-600",
};

function StepperProgreso({ estadoActual }: { estadoActual: EstadoPedido }) {
  const indiceActual = ESTADOS.indexOf(estadoActual);

  return (
    <div className="flex items-center gap-1">
      {ESTADOS.map((estado, idx) => {
        const Icono = ICONO_ESTADO[estado];
        const completado = idx < indiceActual;
        const activo = idx === indiceActual;

        return (
          <div key={estado} className="flex items-center gap-1 flex-1 last:flex-none">
            <div
              className={`flex flex-col items-center gap-1 transition-all ${
                completado || activo ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  completado
                    ? "bg-green-100 border-green-300"
                    : activo
                    ? "bg-white border-2 shadow-md scale-110"
                    : "bg-white border-slate-200"
                }`}
                style={activo ? { borderColor: COLOR_BARRA_ESTADO[estado].replace("bg-", "").split("-")[0] === "slate" ? "#94a3b8" : undefined } : undefined}
              >
                <Icono
                  className={`w-4 h-4 ${
                    completado ? "text-green-600" : activo ? "text-primario" : "text-slate-400"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  activo ? "text-texto" : "text-texto-terciario"
                }`}
              >
                {ETIQUETA_ESTADO[estado]}
              </span>
            </div>
            {idx < ESTADOS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mt-[-16px] rounded-full transition-all ${
                  idx < indiceActual ? COLOR_BARRA_ESTADO[estado] : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RastrearPedidoModal() {
  const { abierto, cerrar } = useRastrearPedido();
  const [inputId, setInputId] = useState("");
  const [estadoRastreo, setEstadoRastreo] = useState<EstadoRastreo>("input");
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [estadoActual, setEstadoActual] = useState<EstadoPedido | null>(null);

  const resetear = useCallback(() => {
    setInputId("");
    setEstadoRastreo("input");
    setPedidoId(null);
    setEstadoActual(null);
  }, []);

  const onEstadoCambiado = useCallback(
    (nuevoEstado: EstadoPedido) => {
      setEstadoActual(nuevoEstado);
      if (nuevoEstado === "entregado") {
        setEstadoRastreo("entregado");
      }
    },
    []
  );

  const callbacks: CallbacksMiPedido = { onEstadoCambiado };

  useMiPedidoRealtime(
    estadoRastreo === "rastreando" ? pedidoId : null,
    callbacks
  );

  const manejarBuscar = useCallback(async () => {
    const idLimpio = inputId.trim().toUpperCase();
    if (!idLimpio) return;

    setEstadoRastreo("validando");
    setPedidoId(null);
    setEstadoActual(null);

    const pedido = await obtenerEstadoPedidoPublico(idLimpio);

    if (!pedido) {
      setEstadoRastreo("no_encontrado");
      return;
    }

    setPedidoId(pedido.id);
    setEstadoActual(pedido.estado);

    if (pedido.estado === "entregado") {
      setEstadoRastreo("entregado");
    } else {
      setEstadoRastreo("rastreando");
    }
  }, [inputId]);

  const manejarCerrar = useCallback(() => {
    resetear();
    cerrar();
  }, [resetear, cerrar]);

  const manejarKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && estadoRastreo === "input") {
        manejarBuscar();
      }
    },
    [estadoRastreo, manejarBuscar]
  );

  return (
    <Dialog open={abierto} onOpenChange={(abierto) => { if (!abierto) manejarCerrar(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-lg text-texto">
            Rastrear Pedido
          </DialogTitle>
        </DialogHeader>

        {/* Estado: Input */}
        {estadoRastreo === "input" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-texto-secundario">
              Ingresa el ID de tu pedido (lo encuentras en el correo de confirmación).
            </p>
            <Input
              placeholder="Ej: 66DF8CA2"
              value={inputId}
              onChange={(e) => setInputId(e.target.value.toUpperCase())}
              onKeyDown={manejarKeyDown}
              className="text-center font-mono text-lg tracking-widest uppercase"
              maxLength={36}
            />
            <Button onClick={manejarBuscar} disabled={!inputId.trim()} className="w-full">
              <Search className="w-4 h-4" />
              Rastrear
            </Button>
          </div>
        )}

        {/* Estado: Validando */}
        {estadoRastreo === "validando" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <CargandoPedido />
            <p className="text-sm text-texto-secundario animate-pulse">
              Buscando pedido...
            </p>
          </div>
        )}

        {/* Estado: Rastreando */}
        {estadoRastreo === "rastreando" && estadoActual && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <Badge
                className={`text-sm px-4 py-1.5 border ${COLOR_ESTADO[estadoActual]}`}
              >
                {ETIQUETA_ESTADO[estadoActual]}
              </Badge>
            </div>

            <StepperProgreso estadoActual={estadoActual} />

            <p className="text-xs text-texto-terciario text-center">
              El estado se actualiza automáticamente cuando la cocina procese tu pedido.
            </p>
          </div>
        )}

        {/* Estado: Entregado */}
        {estadoRastreo === "entregado" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CircleCheck className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-playfair text-lg font-bold text-green-700">
                Pedido Entregado
              </p>
              <p className="text-sm text-texto-secundario mt-1">
                Tu pedido ha sido entregado. Disfruta.
              </p>
            </div>
            <Button variant="outline" onClick={manejarCerrar} className="mt-2">
              Cerrar
            </Button>
          </div>
        )}

        {/* Estado: No encontrado */}
        {estadoRastreo === "no_encontrado" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-error" />
            </div>
            <div className="text-center">
              <p className="font-medium text-texto">Pedido no encontrado</p>
              <p className="text-sm text-texto-secundario mt-1">
                Verifica el ID e intenta de nuevo.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setEstadoRastreo("input")}
              className="mt-2"
            >
              Intentar de nuevo
            </Button>
          </div>
        )}

        {/* Estado: Error */}
        {estadoRastreo === "error" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-error" />
            </div>
            <div className="text-center">
              <p className="font-medium text-texto">Error al buscar</p>
              <p className="text-sm text-texto-secundario mt-1">
                Ocurrió un error. Intenta de nuevo más tarde.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setEstadoRastreo("input")}
              className="mt-2"
            >
              Intentar de nuevo
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
