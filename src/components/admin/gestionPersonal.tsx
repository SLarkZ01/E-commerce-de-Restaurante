"use client";

import { useState } from "react";
import { Users, Trash2, Plus, X, Mail, User, ChefHat } from "lucide-react";
import type { Perfil } from "@/types";
import { crearPerfil, eliminarPerfil } from "@/lib/acciones/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ROLES = [
  { valor: "cocinero", etiqueta: "Cocinero", icono: <ChefHat className="w-3.5 h-3.5" />, color: "bg-advertencia/10 text-advertencia" },
  { valor: "mesero", etiqueta: "Mesero", icono: <User className="w-3.5 h-3.5" />, color: "bg-info/10 text-info" },
  { valor: "admin", etiqueta: "Admin", icono: <Users className="w-3.5 h-3.5" />, color: "bg-primario/10 text-primario" },
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

  const getIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 bg-fondo/95 backdrop-blur-sm border-b border-borde/60">
        <h1 className="font-playfair text-lg font-bold text-texto tracking-tight">
          Gestión de Personal
        </h1>
      </header>

      <div className="p-6">
        {mensaje && (
          <div className="mb-4 px-4 py-3 bg-exito/10 text-exito text-sm rounded-xl flex justify-between items-center">
            {mensaje}
            <button onClick={() => setMensaje("")} className="text-exito/60 hover:text-exito">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <Button
          onClick={() => setMostrandoFormulario(true)}
          className="mb-6 bg-primario hover:bg-primario-hover text-primario-texto rounded-xl"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Agregar Personal
        </Button>

        <Dialog open={mostrandoFormulario} onOpenChange={setMostrandoFormulario}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-playfair text-lg font-bold text-texto">
                Agregar Personal
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-texto-secundario mb-1.5">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Juan Pérez"
                    className="h-10 pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-texto-secundario mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="juan@ekitchen.com"
                    className="h-10 pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-texto-secundario mb-1.5">
                  Rol
                </label>
                <div className="flex gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.valor}
                      type="button"
                      onClick={() => setRol(r.valor)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        rol === r.valor
                          ? "bg-primario text-primario-texto shadow-sm"
                          : "bg-fondo-oscuro text-texto-secundario hover:bg-borde"
                      }`}
                    >
                      {r.icono}
                      {r.etiqueta}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-texto-terciario">
                Al guardar, se enviará un correo de invitación para crear contraseña.
              </p>
              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={() => setMostrandoFormulario(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-primario hover:bg-primario-hover text-primario-texto">
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {perfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-texto-terciario">
            <div className="w-16 h-16 rounded-full bg-fondo-oscuro flex items-center justify-center mb-4">
              <Users className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-texto-secundario">No hay personal registrado</p>
            <p className="text-xs mt-1">Agrega tu primer miembro</p>
          </div>
        ) : (
          <div className="space-y-3">
            {perfiles.map((p) => {
              const rolInfo = ROLES.find((r) => r.valor === p.rol);
              return (
                <div
                  key={p.id}
                  className="bg-fondo-card rounded-xl border border-borde/60 p-4 shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-borde">
                      <AvatarFallback className="bg-primario/10 text-primario text-xs font-bold">
                        {getIniciales(p.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-texto truncate">
                        {p.nombre}
                      </p>
                      <p className="text-xs text-texto-terciario truncate">
                        {p.email}
                      </p>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] font-semibold ${rolInfo?.color}`}>
                      {rolInfo?.icono}
                      {rolInfo?.etiqueta}
                    </Badge>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="text-texto-terciario hover:text-error transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export function SkeletonGestionPersonal() {
  return (
    <main className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 bg-fondo/95 backdrop-blur-sm border-b border-borde/60">
        <Skeleton className="w-36 h-6" />
      </header>
      <div className="p-6">
        <div className="flex gap-2 mb-6">
          <Skeleton className="w-36 h-10" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-fondo-card rounded-xl border border-borde/60 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-32 h-3" />
                </div>
                <Skeleton className="w-16 h-5 rounded-full" />
                <Skeleton className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
