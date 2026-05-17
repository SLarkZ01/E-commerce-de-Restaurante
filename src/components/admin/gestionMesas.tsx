"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";
import type { Mesa } from "@/types";
import { useGestionAdmin } from "@/hooks/useGestionAdmin";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { TarjetaMesa } from "./TarjetaMesa";
import { DialogoQRMesa } from "./DialogoQRMesa";
import { FormularioCrearMesa } from "./FormularioCrearMesa";

export { SkeletonGestionMesas } from "./SkeletonGestionMesas";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

const construirUrl = (codigoQr: string) => `${BASE_URL}/mesa/${codigoQr}`;

export function GestionMesas({
  mesasIniciales,
}: {
  mesasIniciales: Mesa[];
}) {
  const [mesas, setMesas] = useState(mesasIniciales);
  const [mostrandoQR, setMostrandoQR] = useState<Mesa | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");
  const { crearMesa, eliminarMesa } = useGestionAdmin();

  const handleCrear = async (numero: number) => {
    const resultado = await crearMesa(numero);
    const mesaCreada = resultado.mesa;
    if (resultado.exito && mesaCreada) {
      setMesas((prev) => [mesaCreada, ...prev]);
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

  return (
    <div className="flex-1 overflow-y-auto">
      {mensaje && (
        <MensajeToast mensaje={mensaje} variante={tipoMensaje} onClose={() => setMensaje("")} />
      )}

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <FormularioCrearMesa onCrear={handleCrear} />
          {mesas.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-fondo-oscuro rounded-lg border border-borde/40 shrink-0">
              <QrCode className="w-3.5 h-3.5 text-texto-terciario" />
              <span className="text-xs font-medium text-texto-secundario">
                {mesas.length} {mesas.length === 1 ? "mesa" : "mesas"}
              </span>
            </div>
          )}
        </div>

        {mesas.length === 0 ? (
          <EstadoVacio
            icono={QrCode}
            titulo="No hay mesas registradas"
            descripcion="Agrega tu primera mesa para comenzar"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mesas.map((m) => (
              <TarjetaMesa
                key={m.id}
                mesa={m}
                onEliminar={handleEliminar}
                onVerQR={setMostrandoQR}
              />
            ))}
          </div>
        )}

        <DialogoQRMesa
          mesa={mostrandoQR}
          onClose={() => setMostrandoQR(null)}
          construirUrl={construirUrl}
          onMensaje={(msg, tipo) => {
            setMensaje(msg);
            setTipoMensaje(tipo);
          }}
        />
      </div>
    </div>
  );
}
