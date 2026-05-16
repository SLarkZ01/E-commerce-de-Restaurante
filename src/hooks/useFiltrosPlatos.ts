import { useState, useMemo, useDeferredValue } from "react";
import type { Plato } from "@/types";

type TabActiva = "todos" | "disponibles" | "agotados";

export function useFiltrosPlatos(platos: Plato[]) {
  const [busqueda, setBusqueda] = useState("");
  const [tabActiva, setTabActiva] = useState<TabActiva>("todos");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");

  const busquedaDiferida = useDeferredValue(busqueda);

  const platosDisponibles = useMemo(
    () => platos.filter((p) => p.disponible).length,
    [platos]
  );

  const platosFiltrados = useMemo(() => {
    let resultado = [...platos];

    if (tabActiva === "disponibles") {
      resultado = resultado.filter((p) => p.disponible);
    } else if (tabActiva === "agotados") {
      resultado = resultado.filter((p) => !p.disponible);
    }

    if (categoriaActiva !== "todas") {
      resultado = resultado.filter((p) => p.categoria_id === categoriaActiva);
    }

    if (busquedaDiferida.trim()) {
      const termino = busquedaDiferida.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.descripcion?.toLowerCase().includes(termino)
      );
    }

    return resultado;
  }, [platos, tabActiva, categoriaActiva, busquedaDiferida]);

  return {
    busqueda,
    setBusqueda,
    tabActiva,
    setTabActiva,
    categoriaActiva,
    setCategoriaActiva,
    platosFiltrados,
    platosDisponibles,
  };
}
