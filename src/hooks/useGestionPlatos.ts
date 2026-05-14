"use client";

import { useCallback } from "react";
import { crearPlato, actualizarPlato, eliminarPlato } from "@/lib/acciones/catalogo";
import { subirImagenPlato } from "@/lib/acciones/imagenes";
import { crearPlatoFactory } from "@/lib/servicios/platoFactory";
import type { Plato, TipoPlato } from "@/types";
import type { DatosFormularioPlato } from "@/components/cocina/FormularioPlato";

export interface ResultadoPlato {
  exito: boolean;
  plato?: Plato;
  error?: string;
}

export function useGestionPlatos() {
  const crear = useCallback(async (datos: DatosFormularioPlato): Promise<ResultadoPlato> => {
    try {
      // Factory: valida según el tipo de plato
      const factory = crearPlatoFactory(datos.tipoPlato as TipoPlato);
      const errorValidacion = factory.validar(datos);
      if (errorValidacion) {
        return { exito: false, error: errorValidacion };
      }

      let imagenUrl: string | undefined;
      if (datos.archivoImagen) {
        const formData = new FormData();
        formData.append("imagen", datos.archivoImagen);
        imagenUrl = await subirImagenPlato(formData);
      }

      const datosDB = factory.transformar(datos, imagenUrl);
      const nuevo = await crearPlato(datosDB);

      return { exito: true, plato: nuevo as Plato };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      return { exito: false, error: msg };
    }
  }, []);

  const actualizar = useCallback(async (id: string, datos: { disponible: boolean }) => {
    await actualizarPlato(id, datos);
  }, []);

  const eliminar = useCallback(async (id: string) => {
    await eliminarPlato(id);
  }, []);

  return { crear, actualizar, eliminar };
}
