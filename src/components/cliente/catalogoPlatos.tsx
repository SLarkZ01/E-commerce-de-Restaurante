"use client";

import { useState } from "react";
import { Search, Plus, Utensils, Coffee, Soup, Sandwich, Cake, Wine } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import { usarCarrito, type ItemCarrito } from "@/stores/cart";
import type { Plato, Categoria } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CatalogoPlatosProps {
  platos: Plato[];
  categorias: Categoria[];
  mesaUuid: string | null;
}

const ICONOS_CATEGORIA: Record<string, React.ReactNode> = {
  plato_fuerte: <Utensils className="w-4 h-4" />,
  bebida: <Coffee className="w-4 h-4" />,
  combo: <Sandwich className="w-4 h-4" />,
};

const ICONOS_CATEGORIA_NOMBRE: Record<string, React.ReactNode> = {
  entradas: <Soup className="w-3.5 h-3.5" />,
  sopas: <Soup className="w-3.5 h-3.5" />,
  platos_fuertes: <Utensils className="w-3.5 h-3.5" />,
  bebidas: <Coffee className="w-3.5 h-3.5" />,
  postres: <Cake className="w-3.5 h-3.5" />,
  combos: <Sandwich className="w-3.5 h-3.5" />,
  vinos: <Wine className="w-3.5 h-3.5" />,
};

export function CatalogoPlatos({
  platos: platosIniciales,
  categorias,
}: CatalogoPlatosProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const agregarItem = usarCarrito((s) => s.agregarItem);

  const categoriasUnicas = categorias.filter((c) =>
    platosIniciales.some((p) => p.categoria_id === c.id)
  );

  const platosFiltrados = platosIniciales.filter((p) => {
    const coincideCategoria =
      !categoriaActiva || p.categoria_id === categoriaActiva;
    const coincideBusqueda =
      !busqueda ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const alAgregar = (plato: Plato) => {
    const item: Omit<ItemCarrito, "cantidad"> = {
      id: plato.id,
      nombre: plato.nombre,
      precio: plato.precio,
      imagenUrl: plato.imagen_url,
    };
    agregarItem(item);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-1">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
          <input
            type="text"
            placeholder="Buscar plato..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-borde bg-fondo-card text-texto placeholder-texto-terciario focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setCategoriaActiva(null)}
          className={`shrink-0 px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
            !categoriaActiva
              ? "bg-primario text-primario-texto border-primario shadow-sm"
              : "bg-fondo-card text-texto-secundario border-borde hover:border-primario/50 hover:text-primario"
          }`}
        >
          Todos
        </button>
        {categoriasUnicas.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoriaActiva(c.id)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
              categoriaActiva === c.id
                ? "bg-primario text-primario-texto border-primario shadow-sm"
                : "bg-fondo-card text-texto-secundario border-borde hover:border-primario/50 hover:text-primario"
            }`}
          >
            {ICONOS_CATEGORIA_NOMBRE[c.nombre.toLowerCase().replace(/\s+/g, "_")] || <Utensils className="w-3.5 h-3.5" />}
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {platosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-texto-terciario">
            <div className="w-16 h-16 rounded-full bg-fondo-oscuro flex items-center justify-center mb-4">
              <Search className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-texto-secundario">No se encontraron platos</p>
            <p className="text-xs mt-1">Intenta con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {platosFiltrados.map((plato) => (
              <TarjetaPlato
                key={plato.id}
                plato={plato}
                alAgregar={alAgregar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TarjetaPlato({
  plato,
  alAgregar,
}: {
  plato: Plato;
  alAgregar: (plato: Plato) => void;
}) {
  return (
    <div className="group bg-fondo-card rounded-2xl border border-borde/60 overflow-hidden shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_8px_24px_rgba(45,42,38,0.10)] hover:border-borde transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] bg-fondo-oscuro overflow-hidden">
        {plato.imagen_url ? (
          <img
            src={plato.imagen_url}
            alt={plato.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-texto-terciario">
            {ICONOS_CATEGORIA[plato.tipo_plato] || <Utensils className="w-8 h-8" />}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
          <p className="text-white text-xs font-bold font-playfair">
            {formatearPrecio(plato.precio)}
          </p>
        </div>
        {!plato.disponible && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs">Agotado</Badge>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-playfair text-sm font-semibold text-texto leading-tight line-clamp-2 mb-1">
          {plato.nombre}
        </h3>
        {plato.descripcion && (
          <p className="text-[11px] text-texto-secundario line-clamp-2 mb-2.5">
            {plato.descripcion}
          </p>
        )}
        <Button
          onClick={() => alAgregar(plato)}
          disabled={!plato.disponible}
          size="sm"
          className="w-full h-8 text-xs font-semibold bg-primario hover:bg-primario-hover text-primario-texto rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Agregar
        </Button>
      </div>
    </div>
  );
}

export function SkeletonCatalogo() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-1">
        <Skeleton className="w-full h-11 rounded-xl" />
      </div>
      <div className="flex gap-2 px-4 py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="w-20 h-8 rounded-full shrink-0" />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-fondo-card rounded-2xl border border-borde/60 overflow-hidden">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
