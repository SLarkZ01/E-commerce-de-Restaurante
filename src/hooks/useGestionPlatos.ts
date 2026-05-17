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
  const crear = useCallback(
    async (datos: DatosFormularioPlato): Promise<ResultadoPlato> => {
      try {
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
    },
    []
  );

  const actualizar = useCallback(
    async (
      id: string,
      datos: DatosFormularioPlato
    ): Promise<ResultadoPlato> => {
      try {
        let imagenUrl: string | undefined;

        if (datos.archivoImagen) {
          const formData = new FormData();
          formData.append("imagen", datos.archivoImagen);
          imagenUrl = await subirImagenPlato(formData);
        } else if (datos.imagenUrlActual) {
          imagenUrl = datos.imagenUrlActual;
        }

        const actualizacion: Record<string, unknown> = {
          nombre: datos.nombre,
          precio: datos.precio,
          tipoPlato: datos.tipoPlato,
        };
        if (datos.descripcion !== undefined)
          actualizacion.descripcion = datos.descripcion;
        if (datos.categoriaId !== undefined)
          actualizacion.categoriaId = datos.categoriaId;
        if (datos.ingredientes !== undefined)
          actualizacion.ingredientes = datos.ingredientes;
        if (imagenUrl !== undefined) actualizacion.imagenUrl = imagenUrl;

        await actualizarPlato(id, actualizacion);

        return { exito: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        return { exito: false, error: msg };
      }
    },
    []
  );

  const toggleDisponible = useCallback(
    async (id: string, disponible: boolean) => {
      await actualizarPlato(id, { disponible });
    },
    []
  );

  const eliminar = useCallback(async (id: string) => {
    await eliminarPlato(id);
  }, []);

  return { crear, actualizar, toggleDisponible, eliminar };
}
