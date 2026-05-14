"use client";

import { useCallback } from "react";
import { crearPerfil, eliminarPerfil, crearMesa, eliminarMesa } from "@/lib/acciones/admin";
import type { Perfil, Mesa } from "@/types";

export interface ResultadoPerfil {
  exito: boolean;
  perfil?: Perfil;
  error?: string;
}

export interface ResultadoMesa {
  exito: boolean;
  mesa?: Mesa;
  error?: string;
}

export function useGestionAdmin() {
  const crearPerfilFn = useCallback(async (datos: { nombre: string; email: string; rol: string }): Promise<ResultadoPerfil> => {
    try {
      const nuevo = await crearPerfil(datos);
      return { exito: true, perfil: nuevo as Perfil };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      return { exito: false, error: msg };
    }
  }, []);

  const eliminarPerfilFn = useCallback(async (id: string) => {
    await eliminarPerfil(id);
  }, []);

  const crearMesaFn = useCallback(async (numero: number): Promise<ResultadoMesa> => {
    try {
      const nueva = await crearMesa(numero);
      return { exito: true, mesa: nueva as Mesa };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      return { exito: false, error: msg };
    }
  }, []);

  const eliminarMesaFn = useCallback(async (id: string) => {
    await eliminarMesa(id);
  }, []);

  return {
    crearPerfil: crearPerfilFn,
    eliminarPerfil: eliminarPerfilFn,
    crearMesa: crearMesaFn,
    eliminarMesa: eliminarMesaFn,
  };
}
