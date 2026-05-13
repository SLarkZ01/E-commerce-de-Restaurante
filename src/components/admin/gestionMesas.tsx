"use client";

import { useState } from "react";
import type { Mesa } from "@/types";
import { crearMesa, eliminarMesa } from "@/lib/acciones/admin";

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
    <main className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 bg-[#FEFAF6] border-b border-[#E7E0D8] shadow-sm">
        <h1 className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
          Gestión de Mesas
        </h1>
      </header>

      <div className="p-6">
        {mensaje && (
          <div className="mb-3 px-3 py-2 bg-green-50 text-green-700 text-sm rounded-lg flex justify-between">
            {mensaje}
            <button onClick={() => setMensaje("")}>✕</button>
          </div>
        )}

        <form onSubmit={handleCrear} className="flex gap-2 mb-4">
          <input
            type="number"
            value={numeroNuevo}
            onChange={(e) => setNumeroNuevo(e.target.value)}
            required
            min={1}
            placeholder="Número de mesa"
            className="h-10 w-40 px-3 text-sm rounded-lg border border-[#E7E0D8] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#C44536] text-white rounded-lg text-sm font-medium hover:bg-[#A8382C] transition-colors"
          >
            + Agregar Mesa
          </button>
        </form>

        <div className="bg-white rounded-xl border border-[#E7E0D8] shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F0EB] text-[#78716C] text-xs">
              <tr>
                <th className="px-3 py-2 text-left"># Mesa</th>
                <th className="px-3 py-2 text-left">Código QR</th>
                <th className="px-3 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((m) => (
                <tr key={m.id} className="border-t border-[#E7E0D8]">
                  <td className="px-3 py-2 font-bold text-[#2D2A26] text-xs">
                    Mesa {m.numero}
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] text-[#A8A29E]">
                    {m.codigo_qr}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setMostrandoQR(m)}
                        className="text-xs px-2 py-1 bg-[#F5F0EB] text-[#2D2A26] rounded-md hover:bg-[#E7E0D8] transition-colors"
                      >
                        📋 QR
                      </button>
                      <button
                        onClick={() => handleEliminar(m.id)}
                        className="text-xs text-[#A8A29E] hover:text-[#DC2626] px-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mostrandoQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMostrandoQR(null)}
            />
            <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl">
              <h3 className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26] mb-4">
                Mesa {mostrandoQR.numero}
              </h3>
              <div className="w-48 h-48 mx-auto bg-[#F5F0EB] rounded-xl flex items-center justify-center mb-4">
                <span className="text-6xl">📱</span>
              </div>
              <p className="text-[10px] text-[#A8A29E] mb-2 font-mono break-all">
                {urlMesa(mostrandoQR.codigo_qr)}
              </p>
              <p className="text-xs text-[#78716C] mb-4">
                Escanea este QR para acceder al menú
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.origin + urlMesa(mostrandoQR.codigo_qr)
                    );
                  }}
                  className="flex-1 py-2.5 border border-[#E7E0D8] rounded-xl text-sm text-[#2D2A26] hover:bg-[#F5F0EB] transition-colors"
                >
                  📋 Copiar URL
                </button>
                <button
                  onClick={() => setMostrandoQR(null)}
                  className="flex-1 py-2.5 bg-[#C44536] text-white rounded-xl text-sm font-medium hover:bg-[#A8382C] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
