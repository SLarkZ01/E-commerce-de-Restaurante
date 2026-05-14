"use client";

import React, { useState, useDeferredValue, useMemo, useCallback } from "react";
import { Plus, Tags, Search, Trash2 } from "lucide-react";
import type { Categoria } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilaCategoria } from "./FilaCategoria";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";

const POR_PAGINA = 6;

function FilasSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-fondo-oscuro">
          <div className="h-4 w-24 bg-borde rounded animate-pulse" />
          <div className="h-4 w-4 bg-borde rounded animate-pulse" />
        </div>
      ))}
    </>
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

  const totalPaginas = Math.ceil(categoriasFiltradas.length / POR_PAGINA);
  const inicio = (pagina - 1) * POR_PAGINA;
  const categoriasPaginadas = useMemo(
    () => categoriasFiltradas.slice(inicio, inicio + POR_PAGINA),
    [categoriasFiltradas, inicio]
  );

  const handleBusqueda = useCallback((valor: string) => {
    setBusqueda(valor);
    setPagina(1);
  }, []);

  const irPaginaAnterior = useCallback(() => {
    setPagina((p) => Math.max(1, p - 1));
  }, []);

  const irPaginaSiguiente = useCallback(() => {
    setPagina((p) => Math.min(totalPaginas, p + 1));
  }, [totalPaginas]);

  const mostrarBusqueda = categorias.length > 5;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-5 py-4 border-b border-borde/60 shrink-0">
        <h3 className="text-sm font-semibold text-texto">Nueva categoría</h3>
        <p className="text-xs text-texto-secundario mt-1">
          Agrega categorías para organizar tu menú
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-5 py-4 space-y-3 border-b border-borde/60 shrink-0"
      >
        <div>
          <label className="block text-xs font-medium text-texto-secundario mb-2">
            Nombre
          </label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Platos Fuertes"
            className="h-10"
          />
        </div>
        <Button
          type="submit"
          disabled={!nombre.trim()}
          className="w-full h-10 bg-primario hover:bg-primario-hover text-primario-texto text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </form>

      <div className="flex-1 flex flex-col min-h-0 px-5 py-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-sm font-semibold text-texto">
            Todas las categorías
          </h3>
          <span className="text-xs text-texto-terciario bg-fondo-oscuro px-2 py-0.5 rounded-full">
            {categoriasFiltradas.length}
          </span>
        </div>

        {mostrarBusqueda && (
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
            <Input
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="Buscar categoría..."
              className="h-9 pl-9 text-sm"
            />
          </div>
        )}

        {categorias.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <FilasSkeleton />
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <EstadoVacio
              icono={Tags}
              titulo={busquedaDiferida ? "Sin resultados" : "Sin categorías"}
              descripcion={
                busquedaDiferida
                  ? "Intenta con otro término"
                  : "Crea tu primera categoría arriba"
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1">
              {categoriasPaginadas.map((cat) => (
                <FilaCategoria
                  key={cat.id}
                  categoria={cat}
                  onEliminar={alEliminar}
                />
              ))}
            </div>

            {totalPaginas > 1 && (
              <Pagination className="mt-4 pt-4 border-t border-borde/40 justify-between shrink-0">
                <p className="text-xs text-texto-terciario self-center">
                  Página {pagina} de {totalPaginas}
                </p>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={irPaginaAnterior}
                      disabled={pagina === 1}
                      className="disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                    .filter((num) => {
                      if (totalPaginas <= 5) return true;
                      if (num === 1 || num === totalPaginas) return true;
                      if (Math.abs(num - pagina) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | "ellipsis")[]>((acc, num, idx, arr) => {
                      if (idx > 0 && num - (arr[idx - 1] as number) > 1) {
                        acc.push("ellipsis");
                      }
                      acc.push(num);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={item}>
                          <PaginationLink
                            onClick={() => setPagina(item)}
                            isActive={item === pagina}
                            size="sm"
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={irPaginaSiguiente}
                      disabled={pagina === totalPaginas}
                      className="disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
