"use client";

import { useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRastrearPedido as usarContexto } from "./RastrearPedidoProvider";
import { useRastrearPedido } from "@/hooks/useRastrearPedido";
import { RastrearInput } from "./RastrearInput";
import { RastrearValidando } from "./RastrearValidando";
import { RastrearSiguiendo } from "./RastrearSiguiendo";
import { RastrearEntregado } from "./RastrearEntregado";
import { RastrearNoEncontrado } from "./RastrearNoEncontrado";
import { RastrearError } from "./RastrearError";

export function RastrearPedidoModal() {
  const { abierto, cerrar } = usarContexto();
  const {
    estado,
    inputId,
    estadoActual,
    setInputId,
    manejarBuscar,
    manejarReiniciar,
  } = useRastrearPedido();

  const manejarCerrar = useCallback(() => {
    cerrar();
  }, [cerrar]);

  return (
    <Dialog open={abierto} onOpenChange={(abierto) => { if (!abierto) manejarCerrar(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-lg text-texto">
            Rastrear Pedido
          </DialogTitle>
        </DialogHeader>

        {estado === "input" && (
          <RastrearInput
            inputId={inputId}
            setInputId={setInputId}
            onBuscar={manejarBuscar}
          />
        )}

        {estado === "validando" && <RastrearValidando />}

        {estado === "rastreando" && estadoActual && (
          <RastrearSiguiendo estadoActual={estadoActual} />
        )}

        {estado === "entregado" && (
          <RastrearEntregado onCerrar={manejarCerrar} />
        )}

        {estado === "no_encontrado" && (
          <RastrearNoEncontrado onReintentar={manejarReiniciar} />
        )}

        {estado === "error" && (
          <RastrearError onReintentar={manejarReiniciar} />
        )}
      </DialogContent>
    </Dialog>
  );
}
