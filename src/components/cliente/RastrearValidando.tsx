"use client";

import CargandoPedido from "@/components/ui/cargando-pedido";

export function RastrearValidando() {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div style={{ fontSize: "7px" }}>
        <CargandoPedido />
      </div>
      <p className="text-sm text-texto-secundario animate-pulse">
        Buscando pedido...
      </p>
    </div>
  );
}
