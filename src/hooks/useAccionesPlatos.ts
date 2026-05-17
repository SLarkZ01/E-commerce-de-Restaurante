import { useCallback, useState } from "react";
import type { Plato, Categoria } from "@/types";
import type { DatosFormularioPlato, ResultadoGuardado } from "@/components/cocina/FormularioPlato";
import type { ResultadoPlato } from "@/hooks/useGestionPlatos";

interface UseAccionesPlatosReturn {
  mensaje: string;
  tipoMensaje: "exito" | "error";
  setMensaje: (mensaje: string) => void;
  setTipoMensaje: (tipo: "exito" | "error") => void;
  mostrandoFormulario: boolean;
  setMostrandoFormulario: (val: boolean) => void;
  platoEditando: Plato | null;
  handleCrear: (datos: DatosFormularioPlato) => Promise<ResultadoGuardado>;
  handleGuardarEdicion: (datos: DatosFormularioPlato) => Promise<ResultadoGuardado>;
  handleToggleDisponible: (id: string, datos: { disponible: boolean }) => Promise<void>;
  handleEliminarPlato: (id: string) => Promise<void>;
  handleEditar: (plato: Plato) => void;
  handleCancelarFormulario: () => void;
  handleCrearCategoria: (nombre: string, slug: string) => Promise<void>;
  handleEliminarCategoria: (id: string) => Promise<void>;
}

export function useAccionesPlatos(
  setPlatos: React.Dispatch<React.SetStateAction<Plato[]>>,
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>,
  crear: (datos: DatosFormularioPlato) => Promise<ResultadoPlato>,
  actualizar: (id: string, datos: DatosFormularioPlato) => Promise<ResultadoPlato>,
  toggleDisponible: (id: string, disponible: boolean) => Promise<void>,
  eliminar: (id: string) => Promise<void>,
  crearCat: (nombre: string, slug: string) => Promise<{ exito: boolean; categoria?: Categoria }>,
  eliminarCat: (id: string) => Promise<void>
): UseAccionesPlatosReturn {
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [platoEditando, setPlatoEditando] = useState<Plato | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");

  const handleCrear = useCallback(
    async (datos: DatosFormularioPlato): Promise<ResultadoGuardado> => {
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
    },
    [crear, setPlatos]
  );

  const handleGuardarEdicion = useCallback(
    async (datos: DatosFormularioPlato): Promise<ResultadoGuardado> => {
      if (!datos.id) return { exito: false, error: "ID no proporcionado" };

      const resultado = await actualizar(datos.id, datos);

      if (!resultado.exito) {
        return { exito: false, error: resultado.error };
      }

      setPlatos((prev) =>
        prev.map((p) =>
          p.id === datos.id
            ? {
                ...p,
                nombre: datos.nombre,
                descripcion: datos.descripcion ?? null,
                precio: datos.precio,
                tipo_plato: datos.tipoPlato as Plato["tipo_plato"],
                categoria_id: datos.categoriaId ?? null,
                ingredientes: datos.ingredientes ?? null,
              }
            : p
        )
      );

      setMostrandoFormulario(false);
      setPlatoEditando(null);
      setMensaje("Plato actualizado correctamente");
      setTipoMensaje("exito");
      return { exito: true };
    },
    [actualizar, setPlatos]
  );

  const handleToggleDisponible = useCallback(
    async (id: string, datos: { disponible: boolean }) => {
      try {
        await toggleDisponible(id, datos.disponible);
        setPlatos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...datos } : p))
        );
        setMensaje("Plato actualizado correctamente");
        setTipoMensaje("exito");
      } catch {
        setMensaje("Error al actualizar el plato");
        setTipoMensaje("error");
      }
    },
    [toggleDisponible, setPlatos]
  );

  const handleCancelarFormulario = useCallback(() => {
    setMostrandoFormulario(false);
    setPlatoEditando(null);
  }, []);

  const handleEditar = useCallback((plato: Plato) => {
    setPlatoEditando(plato);
    setMostrandoFormulario(true);
  }, []);

  const handleEliminarPlato = useCallback(
    async (id: string) => {
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
    },
    [eliminar, setPlatos]
  );

  const handleCrearCategoria = useCallback(
    async (nombre: string, slug: string) => {
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
    },
    [crearCat, setCategorias]
  );

  const handleEliminarCategoria = useCallback(
    async (id: string) => {
      if (
        !confirm(
          "¿Eliminar esta categoría? Los platos asociados quedarán sin categoría."
        )
      )
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
    },
    [eliminarCat, setCategorias]
  );

  return {
    mensaje,
    tipoMensaje,
    setMensaje,
    setTipoMensaje,
    mostrandoFormulario,
    setMostrandoFormulario,
    platoEditando,
    handleCrear,
    handleGuardarEdicion,
    handleToggleDisponible,
    handleEliminarPlato,
    handleEditar,
    handleCancelarFormulario,
    handleCrearCategoria,
    handleEliminarCategoria,
  };
}
