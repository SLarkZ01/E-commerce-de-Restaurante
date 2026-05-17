"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import type { Perfil } from "@/types";
import { useGestionAdmin } from "@/hooks/useGestionAdmin";
import { Button } from "@/components/ui/button";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { FormularioPersonal, type DatosPersonal } from "./FormularioPersonal";
import { TarjetaPersonal } from "./TarjetaPersonal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export { SkeletonGestionPersonal } from "./SkeletonGestionPersonal";

export function GestionPersonal({ perfilesIniciales }: { perfilesIniciales: Perfil[] }) {
  const [perfiles, setPerfiles] = useState(perfilesIniciales);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");
  const { crearPerfil, eliminarPerfil } = useGestionAdmin();

  const handleCrear = async (datos: DatosPersonal) => {
    const resultado = await crearPerfil(datos);
    const perfilCreado = resultado.perfil;
    if (resultado.exito && perfilCreado) {
      setPerfiles((prev) => [perfilCreado, ...prev]);
      setMostrandoFormulario(false);
      setMensaje("Personal agregado correctamente");
      setTipoMensaje("exito");
    } else {
      setMensaje("Error al agregar personal");
      setTipoMensaje("error");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await eliminarPerfil(id);
      setPerfiles((prev) => prev.filter((p) => p.id !== id));
      setMensaje("Usuario eliminado correctamente");
      setTipoMensaje("exito");
    } catch {
      setMensaje("Error al eliminar usuario");
      setTipoMensaje("error");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        {mensaje && (
          <div className="mb-5">
            <MensajeToast mensaje={mensaje} variante={tipoMensaje} onClose={() => setMensaje("")} />
          </div>
        )}

        <Button
          onClick={() => setMostrandoFormulario(true)}
          className="mb-6 bg-primario hover:bg-primario-hover text-primario-texto rounded-xl h-10 px-5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Personal
        </Button>

        <Dialog open={mostrandoFormulario} onOpenChange={setMostrandoFormulario}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-playfair text-lg font-bold text-texto">
                Agregar Personal
              </DialogTitle>
              <DialogDescription className="text-sm text-texto-secundario">
                Crea una cuenta para un miembro del staff. Podrá iniciar sesión de inmediato.
              </DialogDescription>
            </DialogHeader>
            <FormularioPersonal
              alGuardar={handleCrear}
              alCancelar={() => setMostrandoFormulario(false)}
            />
          </DialogContent>
        </Dialog>

        {perfiles.length === 0 ? (
          <EstadoVacio
            icono={Users}
            titulo="No hay personal registrado"
            descripcion="Agrega tu primer miembro"
          />
        ) : (
          <div className="space-y-3">
            {perfiles.map((p) => (
              <TarjetaPersonal key={p.id} perfil={p} onEliminar={handleEliminar} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
