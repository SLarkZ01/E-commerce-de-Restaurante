"use client";

import { useState } from "react";
import { Search, Utensils, Soup, Coffee, Sandwich, Cake, Wine } from "lucide-react";
import { usarCarrito } from "@/stores/cart";
import type { ItemCarrito, Plato, Categoria } from "@/types";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { TarjetaPlatoCliente } from "./TarjetaPlatoCliente";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export { SkeletonCatalogo } from "./SkeletonCatalogo";

interface CatalogoPlatosProps {
  platos: Plato[];
  categorias: Categoria[];
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
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const agregarItem = usarCarrito((s) => s.agregarItem);

  const categoriasUnicas = categorias.filter((c) =>
    platosIniciales.some((p) => p.categoria_id === c.id)
  );

  const platosFiltrados = platosIniciales.filter((p) => {
    const coincideCategoria = categoriaActiva === "todos" || p.categoria_id === categoriaActiva;
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
      {/* Header con búsqueda */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-texto-terciario" />
          <input
            type="text"
            placeholder="Buscar plato..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full h-12 pl-11 pr-4 text-sm rounded-xl border border-borde/60 bg-fondo-card text-texto placeholder-texto-terciario focus:outline-none focus:ring-2 focus:ring-primario/20 focus:border-primario transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Categorías como Tabs */}
      <Tabs value={categoriaActiva} onValueChange={setCategoriaActiva} className="px-4 pb-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="bg-fondo-oscuro/50 h-auto p-1 gap-1 justify-start rounded-xl">
            <TabsTrigger
              value="todos"
              className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-fondo-card data-[state=active]:text-primario data-[state=active]:shadow-sm text-texto-secundario hover:text-texto transition-all border-0"
            >
              Todos
            </TabsTrigger>
            {categoriasUnicas.map((c) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-fondo-card data-[state=active]:text-primario data-[state=active]:shadow-sm text-texto-secundario hover:text-texto transition-all border-0 flex items-center gap-1.5"
              >
                {ICONOS_POR_SLUG[c.nombre.toLowerCase().replace(/\s+/g, "_")] || (
                  <Utensils className="w-3.5 h-3.5" />
                )}
                {c.nombre}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </Tabs>

      {/* Grid de platos */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 lg:pb-4">
        {platosFiltrados.length === 0 ? (
          <EstadoVacio
            icono={Search}
            titulo="No se encontraron platos"
            descripcion="Intenta con otra búsqueda o categoría"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
