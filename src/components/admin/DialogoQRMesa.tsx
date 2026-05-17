"use client";

import { useCallback, useState } from "react";
import { QrCode, Copy, Printer, Check, Loader2 } from "lucide-react";
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
  const [copiado, setCopiado] = useState(false);
  const [imprimiendo, setImprimiendo] = useState(false);

  const imprimirQR = useCallback(() => {
    if (!qrDataUrl || !mesa) return;

    setImprimiendo(true);

    const ventana = window.open("", "_blank");
    if (!ventana) {
      onMensaje("Permite las ventanas emergentes para imprimir el QR", "error");
      setImprimiendo(false);
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
        setImprimiendo(false);
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
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }, [mesa, construirUrl]);

  if (!mesa) return null;

  const url = construirUrl(mesa.codigo_qr);

  return (
    <Dialog open={!!mesa} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-fondo-oscuro px-6 py-5 border-b border-borde/50">
          <DialogHeader className="text-center">
            <DialogTitle className="font-playfair text-xl font-bold text-texto">
              Mesa {mesa.numero}
            </DialogTitle>
            <DialogDescription className="text-sm text-texto-secundario">
              Escanea este QR para acceder al menú digital
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 flex flex-col items-center space-y-5">
          <div className="w-52 h-52 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm border border-borde/30">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt={`QR Mesa ${mesa.numero}`} className="w-full h-full object-contain" />
            ) : generando ? (
              <div className="flex flex-col items-center gap-3 text-texto-terciario">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs">Generando QR...</span>
              </div>
            ) : (
              <QrCode className="w-20 h-20 text-texto-terciario" />
            )}
          </div>

          <div className="w-full bg-fondo-oscuro rounded-xl p-3 border border-borde/30">
            <p className="text-xs text-texto-secundario font-mono text-center break-all leading-relaxed">
              {url}
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              onClick={copiarUrl}
              variant="outline"
              className={`flex-1 h-11 transition-all ${
                copiado
                  ? "bg-exito/10 text-exito border-exito/30"
                  : ""
              }`}
            >
              {copiado ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copiar
                </>
              )}
            </Button>
            <Button
              onClick={imprimirQR}
              disabled={!qrDataUrl || generando || imprimiendo}
              variant="outline"
              className="flex-1 h-11"
            >
              {imprimiendo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Imprimiendo...
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 mr-1.5" />
                  Imprimir
                </>
              )}
            </Button>
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-10 text-texto-secundario hover:text-texto"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
