"use client";

import { useState, useEffect } from "react";
import type { Mesa } from "@/types";

interface UseQRMesaReturn {
  qrDataUrl: string;
  generando: boolean;
}

export function useQRMesa(
  mesa: Mesa | null,
  construirUrl: (codigoQr: string) => string
): UseQRMesaReturn {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [generadoParaId, setGeneradoParaId] = useState<string | null>(null);

  useEffect(() => {
    if (!mesa) return;

    let cancelled = false;

    const url = construirUrl(mesa.codigo_qr);

    import("qrcode").then(({ default: QRCode }) => {
      QRCode.toDataURL(url, { width: 200, margin: 2 })
        .then((dataUrl) => {
          if (!cancelled) {
            setQrDataUrl(dataUrl);
            setGeneradoParaId(mesa.id);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setQrDataUrl("");
            setGeneradoParaId(mesa.id);
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [mesa, construirUrl]);

  const generando = mesa ? generadoParaId !== mesa.id : false;
  const urlValida = mesa && generadoParaId === mesa.id ? qrDataUrl : "";

  return { qrDataUrl: urlValida, generando };
}
