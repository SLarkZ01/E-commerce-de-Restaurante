"use client";

import { useState } from "react";
import { QrCode, Trash2, Copy, Plus, X } from "lucide-react";
import type { Mesa } from "@/types";
import { crearMesa, eliminarMesa } from "@/lib/acciones/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function GestionMesas({
  mesasIniciales,
}: {
  mesasIniciales: Mesa[];
}) {
  const [mesas, setMesas] = useState(mesasIniciales);
  const [mostrandoQR, setMostrandoQR] = useState<Mesa | null>(null);
  const [numeroNuevo, setNumeroNuevo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nueva = await crearMesa(Number(numeroNuevo));
      setMesas((prev) => [nueva as Mesa, ...prev]);
      setNumeroNuevo("");
      setMensaje("Mesa creada correctamente");
    } catch {
      setMensaje("Error al crear la mesa");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta mesa?")) return;
    try {
      await eliminarMesa(id);
      setMesas((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setMensaje("Error al eliminar mesa");
    }
  };

  const urlMesa = (qr: string) => `/mesa/${qr}`;

  return (
    <div className="p-4 sm:p-6">
      {mensaje && (
        <div className="mb-4 px-4 py-3 bg-exito/10 text-exito text-sm rounded-xl flex justify-between items-center">
          {mensaje}
          <button onClick={() => setMensaje("")} className="text-exito/60 hover:text-exito">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleCrear} className="flex flex-col sm:flex-row gap-2 mb-6">
        <Input
          type="number"
          value={numeroNuevo}
          onChange={(e) => setNumeroNuevo(e.target.value)}
          required
          min={1}
          placeholder="Número de mesa"
          className="w-full sm:w-40 h-10"
        />
        <Button type="submit" className="bg-primario hover:bg-primario-hover text-primario-texto rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" />
          Agregar Mesa
        </Button>
      </form>

      {mesas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-texto-terciario">
          <div className="w-16 h-16 rounded-full bg-fondo-oscuro flex items-center justify-center mb-4">
            <QrCode className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium text-texto-secundario">No hay mesas registradas</p>
          <p className="text-xs mt-1">Agrega tu primera mesa</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mesas.map((m) => (
            <div
              key={m.id}
              className="bg-fondo-card rounded-xl border border-borde/60 p-5 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primario/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="font-playfair text-lg font-bold text-primario">
                      {m.numero}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-texto-secundario">Mesa</p>
                    <p className="font-playfair text-lg font-bold text-texto">
                      #{m.numero}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleEliminar(m.id)}
                  className="text-texto-terciario hover:text-error transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-fondo-oscuro rounded-lg p-3 mb-3">
                <p className="text-[10px] text-texto-terciario font-mono truncate">
                  {m.codigo_qr}
                </p>
              </div>

              <Button
                onClick={() => setMostrandoQR(m)}
                variant="outline"
                size="sm"
                className="w-full h-9 text-xs font-medium"
              >
                <QrCode className="w-3.5 h-3.5 mr-1.5" />
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
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-fondo-oscuro rounded-2xl flex items-center justify-center">
              <QrCode className="w-20 h-20 text-texto-terciario" />
            </div>
            <div className="bg-fondo-oscuro rounded-lg p-3 w-full">
              <p className="text-[10px] text-texto-terciario font-mono text-center break-all">
                {mostrandoQR && urlMesa(mostrandoQR.codigo_qr)}
              </p>
            </div>
            <p className="text-xs text-texto-secundario text-center">
              Escanea este QR para acceder al menú
            </p>
            <div className="flex gap-3 w-full">
              <Button
                onClick={() => {
                  if (mostrandoQR) {
                    navigator.clipboard.writeText(
                      window.location.origin + urlMesa(mostrandoQR.codigo_qr)
                    );
                  }
                }}
                variant="outline"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                Copiar URL
              </Button>
              <Button
                onClick={() => setMostrandoQR(null)}
                className="flex-1 bg-primario hover:bg-primario-hover text-primario-texto"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SkeletonGestionMesas() {
  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
        <Skeleton className="w-40 h-10" />
        <Skeleton className="w-32 h-10" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border border-borde/60 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="w-10 h-3" />
                <Skeleton className="w-16 h-5" />
              </div>
            </div>
            <Skeleton className="w-full h-8 rounded-lg" />
            <Skeleton className="w-full h-9 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
