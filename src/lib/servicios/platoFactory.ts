// Patrón: Factory Method
// Crea diferentes tipos de Plato (PlatoFuerte, Bebida, Combo)
// con validaciones específicas para cada tipo.
//
// Aplica OCP: añadir un nuevo tipo solo requiere una nueva clase Creador,
// sin modificar el código existente.

import type { TipoPlato } from "@/types";
import type { DatosFormularioPlato } from "@/components/cocina/FormularioPlato";

export interface DatosPlatoDB {
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoPlato: string;
  categoriaId?: string;
  ingredientes?: string[];
  imagenUrl?: string;
}

interface PlatoCreador {
  validar(datos: DatosFormularioPlato): string | null;
  transformar(datos: DatosFormularioPlato, imagenUrl?: string): DatosPlatoDB;
}

class CreadorPlatoFuerte implements PlatoCreador {
  validar(datos: DatosFormularioPlato): string | null {
    if (!datos.nombre?.trim()) return "El nombre es requerido";
    if (datos.precio <= 0) return "El precio debe ser mayor a 0";
    if (!datos.ingredientes || datos.ingredientes.length < 2)
      return "Los platos fuertes requieren al menos 2 ingredientes";
    return null;
  }

  transformar(datos: DatosFormularioPlato, imagenUrl?: string): DatosPlatoDB {
    return {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
      tipoPlato: datos.tipoPlato,
      categoriaId: datos.categoriaId,
      ingredientes: datos.ingredientes,
      imagenUrl,
    };
  }
}

class CreadorBebida implements PlatoCreador {
  validar(datos: DatosFormularioPlato): string | null {
    if (!datos.nombre?.trim()) return "El nombre es requerido";
    if (datos.precio <= 0) return "El precio debe ser mayor a 0";
    return null;
  }

  transformar(datos: DatosFormularioPlato, imagenUrl?: string): DatosPlatoDB {
    return {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
      tipoPlato: datos.tipoPlato,
      categoriaId: datos.categoriaId,
      imagenUrl,
    };
  }
}

class CreadorCombo implements PlatoCreador {
  validar(datos: DatosFormularioPlato): string | null {
    if (!datos.nombre?.trim()) return "El nombre es requerido";
    if (datos.precio <= 0) return "El precio debe ser mayor a 0";
    return null;
  }

  transformar(datos: DatosFormularioPlato, imagenUrl?: string): DatosPlatoDB {
    return {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
      tipoPlato: datos.tipoPlato,
      categoriaId: datos.categoriaId,
      imagenUrl,
    };
  }
}

const CREADORES: Record<TipoPlato, PlatoCreador> = {
  plato_fuerte: new CreadorPlatoFuerte(),
  bebida: new CreadorBebida(),
  combo: new CreadorCombo(),
};

/**
 * Factory: crea un PlatoCreador según el tipo de plato.
 * Único punto de entrada para la creación de platos.
 */
export function crearPlatoFactory(tipo: TipoPlato): PlatoCreador {
  const creador = CREADORES[tipo];
  if (!creador) throw new Error(`Tipo de plato no soportado: ${tipo}`);
  return creador;
}
