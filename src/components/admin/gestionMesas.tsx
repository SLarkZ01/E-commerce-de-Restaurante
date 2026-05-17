"use client";

import { useState, useEffect } from "react";
import { QrCode, Trash2, Copy, Plus, Printer } from "lucide-react";
import QRCode from "qrcode";
import type { Mesa } from "@/types";
import { useGestionAdmin } from "@/hooks/useGestionAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function GestionMesas({
  mesasIniciales,
}: {
  mesasIniciales: Mesa[];
}) {
  const [mesas, setMesas] = useState(mesasIniciales);
  const [mostrandoQR, setMostrandoQR] = useState<Mesa | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [numeroNuevo, setNumeroNuevo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");
  const { crearMesa, eliminarMesa } = useGestionAdmin();

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultado = await crearMesa(Number(numeroNuevo));
    const mesaCreada = resultado.mesa;
    if (resultado.exito && mesaCreada) {
      setMesas((prev) => [mesaCreada, ...prev]);
      setNumeroNuevo("");
      setMensaje("Mesa creada correctamente");
      setTipoMensaje("exito");
    } else {
      setMensaje("Error al crear la mesa");
      setTipoMensaje("error");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta mesa?")) return;
    try {
      await eliminarMesa(id);
      setMesas((prev) => prev.filter((m) => m.id !== id));
      setMensaje("Mesa eliminada correctamente");
      setTipoMensaje("exito");
    } catch {
      setMensaje("Error al eliminar mesa");
      setTipoMensaje("error");
    }
  };

  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const urlMesa = (qr: string) => `${BASE_URL}/mesa/${qr}`;

  useEffect(() => {
    if (mostrandoQR) {
      const url = urlMesa(mostrandoQR.codigo_qr);
      QRCode.toDataURL(url, { width: 200, margin: 2 })
        .then(setQrDataUrl)
        .catch(() => {
          setMensaje("Error al generar el código QR");
          setTipoMensaje("error");
          setQrDataUrl("");
        });
    } else {
      setQrDataUrl("");
    }
  }, [mostrandoQR]);

  const imprimirQR = () => {
    if (!qrDataUrl || !mostrandoQR) return;
    const url = urlMesa(mostrandoQR.codigo_qr);
    const ventana = window.open("", "_blank");
    if (!ventana) {
      setMensaje("Permite las ventanas emergentes para imprimir el QR");
      setTipoMensaje("error");
      return;
    }

    const doc = ventana.document;
    doc.open();
    doc.write(
      "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Mesa " +
        mostrandoQR.numero +
        " — QR</title></head><body></body></html>"
    );
    doc.close();

    const style = doc.createElement("style");
    style.textContent = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; padding: 2rem; }
      .qr-img { width: 280px; height: 280px; margin-bottom: 1.5rem; background: white; padding: 10px; }
      h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
      p { font-size: 0.75rem; color: #555; word-break: break-all; text-align: center; max-width: 320px; }
      @media print { body { padding: 0; } }
    `;
    doc.head.appendChild(style);

    const img = doc.createElement("img");
    img.src = qrDataUrl;
    img.alt = "QR Mesa " + mostrandoQR.numero;
    img.className = "qr-img";
    doc.body.appendChild(img);

    const h1 = doc.createElement("h1");
    h1.textContent = "Mesa " + mostrandoQR.numero;
    doc.body.appendChild(h1);

    const p = doc.createElement("p");
    p.textContent = url;
    doc.body.appendChild(p);

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
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        {mensaje && (
          <div className="mb-5">
            <MensajeToast mensaje={mensaje} variante={tipoMensaje} onClose={() => setMensaje("")} />
          </div>
        )}

        <form onSubmit={handleCrear} className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            type="number"
            value={numeroNuevo}
            onChange={(e) => setNumeroNuevo(e.target.value)}
            required
            min={1}
            placeholder="Número de mesa"
            className="w-full sm:w-48 h-10"
          />
          <Button type="submit" className="bg-primario hover:bg-primario-hover text-primario-texto rounded-xl h-10 px-5">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Mesa
          </Button>
        </form>

        {mesas.length === 0 ? (
          <EstadoVacio
            icono={QrCode}
            titulo="No hay mesas registradas"
            descripcion="Agrega tu primera mesa"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mesas.map((m) => (
              <div
                key={m.id}
                className="bg-fondo-card rounded-xl border border-borde/60 p-5 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-primario/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="font-playfair text-xl font-bold text-primario">
                        {m.numero}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-texto-secundario">Mesa</p>
                      <p className="font-playfair text-xl font-bold text-texto">
                        #{m.numero}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminar(m.id)}
                    className="text-texto-terciario hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-fondo-oscuro rounded-lg p-3 mb-4">
                  <p className="text-[10px] text-texto-terciario font-mono truncate">
                    {m.codigo_qr}
                  </p>
                </div>

                <Button
                  onClick={() => setMostrandoQR(m)}
                  variant="outline"
                  size="sm"
                  className="w-full h-10 text-sm font-medium"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Ver QR
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!mostrandoQR} onOpenChange={() => setMostrandoQR(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-playfair text-lg font-bold text-texto text-center">
                Mesa {mostrandoQR?.numero}
              </DialogTitle>
              <DialogDescription className="text-sm text-texto-secundario text-center">
                Escanea este QR para acceder al menú
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-5 pt-2">
              <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center p-2">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt={`QR Mesa ${mostrandoQR?.numero}`} className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-20 h-20 text-texto-terciario" />
                )}
              </div>
              <div className="bg-fondo-oscuro rounded-lg p-3 w-full">
                <p className="text-[10px] text-texto-terciario font-mono text-center break-all">
                  {mostrandoQR && urlMesa(mostrandoQR.codigo_qr)}
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <Button
                  onClick={() => {
                    if (mostrandoQR) {
                      navigator.clipboard.writeText(
                        urlMesa(mostrandoQR.codigo_qr)
                      );
                      setMensaje("URL copiada al portapapeles");
                      setTipoMensaje("exito");
                    }
                  }}
                  variant="outline"
                  className="flex-1 h-10"
                >
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copiar URL
                </Button>
                <Button
                  onClick={imprimirQR}
                  disabled={!qrDataUrl}
                  variant="outline"
                  className="flex-1 h-10"
                >
                  <Printer className="w-4 h-4 mr-1.5" />
                  Imprimir QR
                </Button>
                <Button
                  onClick={() => setMostrandoQR(null)}
                  className="flex-1 bg-primario hover:bg-primario-hover text-primario-texto h-10"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function SkeletonGestionMesas() {
  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
        <Skeleton className="w-48 h-10" />
        <Skeleton className="w-32 h-10" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border border-borde/60 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-10 h-3" />
                <Skeleton className="w-16 h-6" />
              </div>
            </div>
            <Skeleton className="w-full h-8 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
