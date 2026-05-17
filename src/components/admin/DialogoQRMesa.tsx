"use client";

import { useCallback } from "react";
import { QrCode, Copy, Printer } from "lucide-react";
import type { Mesa } from "@/types";
import { Button } from "@/components/ui/button";
import { useQRMesa } from "@/hooks/useQRMesa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DialogoQRMesaProps {
  mesa: Mesa | null;
  onClose: () => void;
  construirUrl: (codigoQr: string) => string;
  onMensaje: (mensaje: string, tipo: "exito" | "error") => void;
}

export function DialogoQRMesa({ mesa, onClose, construirUrl, onMensaje }: DialogoQRMesaProps) {
  const { qrDataUrl, generando } = useQRMesa(mesa, construirUrl);

  const imprimirQR = useCallback(() => {
    if (!qrDataUrl || !mesa) return;

    const ventana = window.open("", "_blank");
    if (!ventana) {
      onMensaje("Permite las ventanas emergentes para imprimir el QR", "error");
      return;
    }

    const doc = ventana.document;
    doc.open();
    doc.write(
      "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Mesa " +
        mesa.numero +
        " — QR</title></head><body></body></html>"
    );
    doc.close();

    const style = doc.createElement("style");
    style.textContent = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; }
      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: system-ui, sans-serif;
        overflow: hidden;
      }
      .qr-img {
        width: 60vmin;
        height: 60vmin;
        max-width: 500px;
        max-height: 500px;
        background: white;
      }
      h1 {
        font-size: 10vmin;
        font-weight: 700;
        margin-top: 3vmin;
        letter-spacing: 0.05em;
      }
      @media print {
        @page { margin: 0; size: A4; }
        html, body { width: 100%; height: 100%; }
        body { min-height: 100vh; }
        .qr-img { width: 55vmin; height: 55vmin; max-width: none; max-height: none; }
        h1 { font-size: 8vmin; margin-top: 4vmin; }
      }
    `;
    doc.head.appendChild(style);

    const img = doc.createElement("img");
    img.src = qrDataUrl;
    img.alt = "QR Mesa " + mesa.numero;
    img.className = "qr-img";
    doc.body.appendChild(img);

    const h1 = doc.createElement("h1");
    h1.textContent = "Mesa " + mesa.numero;
    doc.body.appendChild(h1);

    let impreso = false;
    const ejecutarImpresion = () => {
      if (!impreso) {
        impreso = true;
        ventana.print();
      }
    };

    img.onload = ejecutarImpresion;
    if (img.complete) ejecutarImpresion();
    setTimeout(ejecutarImpresion, 500);
  }, [qrDataUrl, mesa, onMensaje]);

  const copiarUrl = useCallback(() => {
    if (!mesa) return;
    const url = construirUrl(mesa.codigo_qr);
    navigator.clipboard.writeText(url).catch(() => {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    });
    onMensaje("URL copiada al portapapeles", "exito");
  }, [mesa, construirUrl, onMensaje]);

  return (
    <Dialog open={!!mesa} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-playfair text-lg font-bold text-texto text-center">
            Mesa {mesa?.numero}
          </DialogTitle>
          <DialogDescription className="text-sm text-texto-secundario text-center">
            Escanea este QR para acceder al menú
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-5 pt-2">
          <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center p-2">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt={`QR Mesa ${mesa?.numero}`} className="w-full h-full object-contain" />
            ) : (
              <QrCode className="w-20 h-20 text-texto-terciario" />
            )}
          </div>
          <div className="bg-fondo-oscuro rounded-lg p-3 w-full">
            <p className="text-[10px] text-texto-terciario font-mono text-center break-all">
              {mesa && construirUrl(mesa.codigo_qr)}
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Button onClick={copiarUrl} variant="outline" className="flex-1 h-10">
              <Copy className="w-4 h-4 mr-1.5" />
              Copiar URL
            </Button>
            <Button
              onClick={imprimirQR}
              disabled={!qrDataUrl || generando}
              variant="outline"
              className="flex-1 h-10"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Imprimir QR
            </Button>
            <Button onClick={onClose} className="flex-1 bg-primario hover:bg-primario-hover text-primario-texto h-10">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
