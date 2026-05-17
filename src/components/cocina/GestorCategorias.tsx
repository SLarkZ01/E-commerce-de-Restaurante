"use client";

import { useState, useDeferredValue, useMemo, useCallback } from "react";
import { Plus, Tags, Search } from "lucide-react";
import type { Categoria } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilaCategoria } from "./FilaCategoria";
import { PaginacionCategorias } from "./PaginacionCategorias";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";

const POR_PAGINA = 6;

function FilasSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-fondo-oscuro">
          <div className="h-4 w-32 bg-borde rounded animate-pulse" />
          <div className="h-4 w-4 bg-borde rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

interface GestorCategoriasProps {
  categorias: Categoria[];
  alCrear: (nombre: string, slug: string) => void;
  alEliminar: (id: string) => void;
}

export function GestorCategorias({
  categorias,
  alCrear,
  alEliminar,
}: GestorCategoriasProps) {
  const [nombre, setNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const busquedaDiferida = useDeferredValue(busqueda);

  const generarSlug = useCallback((texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (nombre.trim()) {
        alCrear(nombre.trim(), generarSlug(nombre.trim()));
        setNombre("");
      }
    },
    [nombre, alCrear, generarSlug]
  );

  const categoriasFiltradas = useMemo(
    () =>
      categorias.filter((cat) =>
        cat.nombre.toLowerCase().includes(busquedaDiferida.toLowerCase())
      ),
    [categorias, busquedaDiferida]
  );

  const totalPaginas = Math.max(1, Math.ceil(categoriasFiltradas.length / POR_PAGINA));
  const inicio = (pagina - 1) * POR_PAGINA;
  const categoriasPaginadas = useMemo(
    () => categoriasFiltradas.slice(inicio, inicio + POR_PAGINA),
    [categoriasFiltradas, inicio]
  );

  const handleBusqueda = useCallback((valor: string) => {
    setBusqueda(valor);
    setPagina(1);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-fondo-card">
      {/* Header compacto */}
      <div className="px-5 py-3 border-b border-borde/40 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primario/10 flex items-center justify-center">
              <Tags className="w-3.5 h-3.5 text-primario" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-texto leading-tight">Categorías</h3>
              <p className="text-[10px] text-texto-secundario">Organiza tu menú</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-texto-terciario tabular-nums">
            {categoriasFiltradas.length}
          </span>
        </div>

        {/* Form inline compacto */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3">
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nueva categoría..."
            className="h-9 text-sm bg-fondo"
          />
          <Button
            type="submit"
            disabled={!nombre.trim()}
            size="sm"
            className="h-9 bg-primario hover:bg-primario-hover text-primario-texto text-xs font-semibold disabled:opacity-40 px-3 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>

      {/* Toolbar listado */}
      <div className="px-5 pt-3 pb-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-texto-terciario" />
          <Input
            value={busqueda}
            onChange={(e) => handleBusqueda(e.target.value)}
            placeholder="Buscar categoría..."
            className="h-9 pl-9 text-xs bg-fondo"
          />
        </div>
      </div>

      {/* Listado */}
      <div className="flex-1 flex flex-col min-h-0 px-5 pb-4 overflow-hidden">
        {categorias.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <FilasSkeleton />
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <EstadoVacio
              icono={Tags}
              titulo="Sin resultados"
              descripcion="Intenta con otro término"
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-1 min-h-0 pr-1">
              {categoriasPaginadas.map((cat) => (
                <FilaCategoria
                  key={cat.id}
                  categoria={cat}
                  onEliminar={alEliminar}
                />
              ))}
            </div>

            {totalPaginas > 1 && (
              <PaginacionCategorias
                pagina={pagina}
                totalPaginas={totalPaginas}
                onCambiarPagina={setPagina}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
