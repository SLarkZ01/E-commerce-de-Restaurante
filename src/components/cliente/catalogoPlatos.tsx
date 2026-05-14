"use client";

import { useState } from "react";
import { Search, Utensils, Coffee, Soup, Sandwich, Cake, Wine } from "lucide-react";
import { usarCarrito, type ItemCarrito } from "@/stores/cart";
import type { Plato, Categoria } from "@/types";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { TarjetaPlatoCliente } from "./TarjetaPlatoCliente";

export { SkeletonCatalogo } from "./SkeletonCatalogo";

interface CatalogoPlatosProps {
  platos: Plato[];
  categorias: Categoria[];
  mesaUuid: string | null;
}

const ICONOS_POR_SLUG: Record<string, React.ReactNode> = {
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
    const coincideCategoria = !categoriaActiva || p.categoria_id === categoriaActiva;
    const coincideBusqueda =
      !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase());
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
            {ICONOS_POR_SLUG[c.nombre.toLowerCase().replace(/\s+/g, "_")] || (
              <Utensils className="w-3.5 h-3.5" />
            )}
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {platosFiltrados.length === 0 ? (
          <EstadoVacio
            icono={Search}
            titulo="No se encontraron platos"
            descripcion="Intenta con otra búsqueda o categoría"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {platosFiltrados.map((plato) => (
              <TarjetaPlatoCliente
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
