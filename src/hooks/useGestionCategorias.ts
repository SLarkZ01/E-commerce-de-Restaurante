"use client";

import { useCallback } from "react";
import { crearCategoria, eliminarCategoria } from "@/lib/acciones/categorias";
import type { Categoria } from "@/types";

export interface ResultadoCategoria {
  exito: boolean;
  categoria?: Categoria;
  error?: string;
}

export function useGestionCategorias() {
  const crear = useCallback(async (nombre: string, slug: string): Promise<ResultadoCategoria> => {
    try {
      const nueva = await crearCategoria({ nombre, slug });
      return { exito: true, categoria: nueva as Categoria };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      return { exito: false, error: msg };
    }
  }, []);

  const eliminar = useCallback(async (id: string) => {
    await eliminarCategoria(id);
  }, []);

  return { crear, eliminar };
}
