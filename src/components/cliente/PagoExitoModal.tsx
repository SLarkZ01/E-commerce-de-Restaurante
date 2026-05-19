"use client";

import { CircleCheck, Mail } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePagoExito } from "./PagoExitoProvider";

export function PagoExitoModal() {
  const { pedidoId, cerrar } = usePagoExito();

  const idCorto = pedidoId?.slice(0, 8).toUpperCase() ?? "";

  return (
    <Dialog open={pedidoId !== null} onOpenChange={(abierto) => { if (!abierto) cerrar(); }}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CircleCheck className="w-9 h-9 text-green-600" />
          </div>

          <div className="text-center space-y-1">
            <p className="font-playfair text-xl font-bold text-texto">
              Hemos recibido tu pedido
            </p>
            <p className="text-sm text-texto-secundario">
              Tu orden ya est&aacute; en manos de nuestra cocina.
            </p>
          </div>

          <div className="w-full bg-fondo-oscuro/30 rounded-xl px-4 py-3 text-center">
            <p className="text-[10px] text-texto-terciario uppercase tracking-wider mb-1">
              ID del pedido
            </p>
            <span className="font-mono text-lg font-bold text-texto tracking-[0.15em]">
              {idCorto}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-texto-secundario bg-amber-50 rounded-lg px-3 py-2 w-full">
            <Mail className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Enviamos el recibo a tu correo electr&oacute;nico con toda la informaci&oacute;n de tu compra.
            </span>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-texto-terciario leading-relaxed">
              Usa el bot&oacute;n <strong className="text-texto">Rastrear Pedido</strong> en la barra superior para seguir tu orden en tiempo real.
            </p>
          </div>

          <Button onClick={cerrar} variant="default" className="w-full">
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
