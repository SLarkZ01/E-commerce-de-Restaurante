import { useState } from "react";
import type { Plato, Categoria } from "@/types";
import type { DatosFormularioPlato, ResultadoGuardado } from "@/components/cocina/FormularioPlato";

interface UseAccionesPlatosReturn {
  mensaje: string;
  tipoMensaje: "exito" | "error";
  setMensaje: (mensaje: string) => void;
  setTipoMensaje: (tipo: "exito" | "error") => void;
  mostrandoFormulario: boolean;
  setMostrandoFormulario: (val: boolean) => void;
  handleCrear: (datos: DatosFormularioPlato) => Promise<ResultadoGuardado>;
  handleActualizar: (id: string, datos: { disponible: boolean }) => Promise<void>;
  handleEliminarPlato: (id: string) => Promise<void>;
  handleCrearCategoria: (nombre: string, slug: string) => Promise<void>;
  handleEliminarCategoria: (id: string) => Promise<void>;
}

export function useAccionesPlatos(
  platos: Plato[],
  setPlatos: React.Dispatch<React.SetStateAction<Plato[]>>,
  categorias: Categoria[],
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>,
  crear: (datos: DatosFormularioPlato) => Promise<{ exito: boolean; plato?: Plato; error?: string }>,
  actualizar: (id: string, datos: { disponible: boolean }) => Promise<void>,
  eliminar: (id: string) => Promise<void>,
  crearCat: (nombre: string, slug: string) => Promise<{ exito: boolean; categoria?: Categoria }>,
  eliminarCat: (id: string) => Promise<void>
): UseAccionesPlatosReturn {
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");

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
    } catch {
      setMensaje("Error al eliminar el plato");
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

  return {
    mensaje,
    tipoMensaje,
    setMensaje,
    setTipoMensaje,
    mostrandoFormulario,
    setMostrandoFormulario,
    handleCrear,
    handleActualizar,
    handleEliminarPlato,
    handleCrearCategoria,
    handleEliminarCategoria,
  };
}
