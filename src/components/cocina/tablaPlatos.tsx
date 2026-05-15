"use client";

import { useState } from "react";
import { Plus, Utensils, Tags } from "lucide-react";
import type { Plato, Categoria } from "@/types";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { TarjetaPlatoCocina } from "./TarjetaPlatoCocina";
import { FormularioPlato, type DatosFormularioPlato, type ResultadoGuardado } from "./FormularioPlato";
import { GestorCategorias } from "./GestorCategorias";
import { useGestionPlatos } from "@/hooks/useGestionPlatos";
import { useGestionCategorias } from "@/hooks/useGestionCategorias";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export { SkeletonTablaPlatos } from "./SkeletonTablaPlatos";

interface TablaPlatosProps {
  platosIniciales: Plato[];
  categorias: Categoria[];
}

export function TablaPlatos({ platosIniciales, categorias: categoriasIniciales }: TablaPlatosProps) {
  const [platos, setPlatos] = useState(platosIniciales);
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");

  const { crear, actualizar, eliminar } = useGestionPlatos();
  const { crear: crearCat, eliminar: eliminarCat } = useGestionCategorias();

  const handleCrear = async (datos: DatosFormularioPlato): Promise<ResultadoGuardado> => {
    const resultado = await crear(datos);
    const platoCreado = resultado.plato;

    if (!resultado.exito || !platoCreado) {
      return { exito: false, error: resultado.error };
    }

    setPlatos((prev) => [platoCreado, ...prev]);
    setMostrandoFormulario(false);
    setMensaje("Plato creado correctamente");
    setTipoMensaje("exito");
    return { exito: true };
  };

  const handleActualizar = async (id: string, datos: { disponible: boolean }) => {
    try {
      await actualizar(id, datos);
      setPlatos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...datos } : p))
      );
      setMensaje("Plato actualizado correctamente");
      setTipoMensaje("exito");
    } catch {
      setMensaje("Error al actualizar el plato");
      setTipoMensaje("error");
    }
  };

  const handleEliminarPlato = async (id: string) => {
    if (!confirm("¿Eliminar este plato?")) return;
    try {
      await eliminar(id);
      setPlatos((prev) => prev.filter((p) => p.id !== id));
      setMensaje("Plato eliminado correctamente");
      setTipoMensaje("exito");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al eliminar el plato";
      setMensaje(msg);
      setTipoMensaje("error");
    }
  };

  const handleCrearCategoria = async (nombre: string, slug: string) => {
    const resultadoCat = await crearCat(nombre, slug);
    const catCreada = resultadoCat.categoria;
    if (resultadoCat.exito && catCreada) {
      setCategorias((prev) => [...prev, catCreada]);
      setMensaje("Categoría creada correctamente");
      setTipoMensaje("exito");
    } else {
      setMensaje("Error al crear la categoría");
      setTipoMensaje("error");
    }
  };

  const handleEliminarCategoria = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? Los platos asociados quedarán sin categoría."))
      return;
    try {
      await eliminarCat(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      setMensaje("Categoría eliminada correctamente");
      setTipoMensaje("exito");
    } catch {
      setMensaje("Error al eliminar la categoría");
      setTipoMensaje("error");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {mensaje && (
        <div className="mx-4 mt-2">
          <MensajeToast mensaje={mensaje} variante={tipoMensaje} onClose={() => setMensaje("")} />
        </div>
      )}

      <div className="flex items-center gap-2 p-4">
        <Dialog open={mostrandoFormulario} onOpenChange={setMostrandoFormulario}>
          <DialogTrigger className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-primario text-primario-texto text-sm font-medium hover:bg-primario-hover transition-all shadow-sm active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Plato</span>
            <span className="sm:hidden">Nuevo</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <FormularioPlato
              alGuardar={handleCrear}
              alCancelar={() => setMostrandoFormulario(false)}
              categorias={categorias}
            />
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-fondo-card text-texto text-sm font-medium hover:bg-borde transition-all border border-borde">
            <Tags className="w-4 h-4" />
            <span className="hidden sm:inline">Categorías</span>
          </SheetTrigger>
          <SheetContent
            className="sm:max-w-sm p-0 flex flex-col h-[calc(100dvh-2rem)]"
            showCloseButton={false}
          >
            <GestorCategorias
              categorias={categorias}
              alCrear={handleCrearCategoria}
              alEliminar={handleEliminarCategoria}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {platos.length === 0 ? (
          <EstadoVacio
            icono={Utensils}
            titulo="No hay platos en el catálogo"
            descripcion="Agrega tu primer plato"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {platos.map((plato) => (
              <TarjetaPlatoCocina
                key={plato.id}
                plato={plato}
                onEliminar={handleEliminarPlato}
                onToggleDisponible={handleActualizar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
