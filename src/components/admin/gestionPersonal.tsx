"use client";

import { useState } from "react";
import type { Perfil } from "@/types";
import { crearPerfil, eliminarPerfil } from "@/lib/acciones/admin";

const ROLES = [
  { valor: "cocinero", etiqueta: "👨‍🍳 Cocinero" },
  { valor: "mesero", etiqueta: "🧑‍💼 Mesero" },
  { valor: "admin", etiqueta: "👑 Admin" },
];

export function GestionPersonal({
  perfilesIniciales,
}: {
  perfilesIniciales: Perfil[];
}) {
  const [perfiles, setPerfiles] = useState(perfilesIniciales);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("cocinero");

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nuevo = await crearPerfil({ nombre, email, rol });
      setPerfiles((prev) => [nuevo as Perfil, ...prev]);
      setMostrandoFormulario(false);
      setNombre("");
      setEmail("");
      setRol("cocinero");
      setMensaje("Personal agregado correctamente");
    } catch {
      setMensaje("Error al agregar personal");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await eliminarPerfil(id);
      setPerfiles((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setMensaje("Error al eliminar usuario");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 bg-[#FEFAF6] border-b border-[#E7E0D8] shadow-sm">
        <h1 className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
          Gestión de Personal
        </h1>
      </header>

      <div className="p-6">
        {mensaje && (
          <div className="mb-3 px-3 py-2 bg-green-50 text-green-700 text-sm rounded-lg flex justify-between">
            {mensaje}
            <button onClick={() => setMensaje("")}>✕</button>
          </div>
        )}

        <button
          onClick={() => setMostrandoFormulario(true)}
          className="mb-4 px-4 py-2 bg-[#C44536] text-white rounded-lg text-sm font-medium hover:bg-[#A8382C] transition-colors"
        >
          + Agregar Personal
        </button>

        {mostrandoFormulario && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMostrandoFormulario(false)} />
            <form onSubmit={handleCrear} className="relative bg-white rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-xl">
              <h3 className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
                Agregar Personal
              </h3>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Nombre completo" className="w-full h-10 px-3 text-sm rounded-lg border border-[#E7E0D8] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Correo electrónico" className="w-full h-10 px-3 text-sm rounded-lg border border-[#E7E0D8] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30" />
              <div className="flex gap-2">
                {ROLES.map((r) => (
                  <button key={r.valor} type="button" onClick={() => setRol(r.valor)} className={`flex-1 py-2 rounded-lg text-xs font-medium ${rol === r.valor ? "bg-[#C44536] text-white" : "bg-[#F5F0EB] text-[#78716C]"}`}>
                    {r.etiqueta}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#A8A29E]">Al guardar, se enviará un correo de invitación para crear contraseña.</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setMostrandoFormulario(false)} className="flex-1 py-2.5 border border-[#E7E0D8] rounded-xl text-sm text-[#78716C]">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#C44536] text-white rounded-xl text-sm font-medium">Guardar</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#E7E0D8] shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F0EB] text-[#78716C] text-xs">
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Rol</th>
                <th className="px-3 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {perfiles.map((p) => (
                <tr key={p.id} className="border-t border-[#E7E0D8]">
                  <td className="px-3 py-2 font-medium text-[#2D2A26] text-xs">{p.nombre}</td>
                  <td className="px-3 py-2 text-[#78716C] text-xs">{p.email}</td>
                  <td className="px-3 py-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F0EB] text-[#78716C]">
                      {ROLES.find((r) => r.valor === p.rol)?.etiqueta}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => handleEliminar(p.id)} className="text-xs text-[#A8A29E] hover:text-[#DC2626]">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
