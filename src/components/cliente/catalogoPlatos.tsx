"use client";

import { useState } from "react";
import { formatearPrecio } from "@/lib/formato";
import { usarCarrito, type ItemCarrito } from "@/stores/cart";
import type { Plato, Categoria } from "@/types";

interface CatalogoPlatosProps {
  platos: Plato[];
  categorias: Categoria[];
  mesaUuid: string;
}

export function CatalogoPlatos({
  platos: platosIniciales,
  categorias,
}: CatalogoPlatosProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const agregarItem = usarCarrito((s) => s.agregarItem);

  const categoriasUnicas = categorias.filter((c) =>
    platosIniciales.some((p) => p.categoriaId === c.id)
  );

  const platosFiltrados = platosIniciales.filter((p) => {
    const coincideCategoria =
      !categoriaActiva || p.categoriaId === categoriaActiva;
    const coincideBusqueda =
      !busqueda ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const alAgregar = (plato: Plato) => {
    const item: Omit<ItemCarrito, "cantidad"> = {
      id: plato.id,
      nombre: plato.nombre,
      precio: Number(plato.precio),
      imagenUrl: plato.imagenUrl,
    };
    agregarItem(item);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar plato..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full h-11 pl-10 pr-4 text-sm rounded-lg border border-[#E7E0D8] bg-white text-[#2D2A26] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30 focus:border-[#C44536]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]">
            🔍
          </span>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setCategoriaActiva(null)}
          className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
            !categoriaActiva
              ? "bg-[#C44536] text-white border-[#C44536]"
              : "bg-white text-[#78716C] border-[#E7E0D8] hover:border-[#C44536]"
          }`}
        >
          Todos
        </button>
        {categoriasUnicas.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoriaActiva(c.id)}
            className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              categoriaActiva === c.id
                ? "bg-[#C44536] text-white border-[#C44536]"
                : "bg-white text-[#78716C] border-[#E7E0D8] hover:border-[#C44536]"
            }`}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {platosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#A8A29E]">
            <span className="text-4xl mb-3">🍳</span>
            <p className="text-sm">No se encontraron platos</p>
          </div>
        ) : (
          <div className="space-y-3">
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
    <div className="flex gap-3 bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(45,42,38,0.06)] border border-[#E7E0D8]">
      <div className="w-24 h-24 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-3xl shrink-0">
        {plato.imagenUrl ? (
          <img
            src={plato.imagenUrl}
            alt={plato.nombre}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span>{plato.tipoPlato === "bebida" ? "🥤" : "🍝"}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-[Playfair_Display] text-base font-semibold text-[#2D2A26] leading-tight">
          {plato.nombre}
        </h3>
        {plato.descripcion && (
          <p className="text-xs text-[#78716C] mt-0.5 line-clamp-2">
            {plato.descripcion}
          </p>
        )}
        <p className="text-sm font-semibold text-[#2D2A26] mt-1.5">
          {formatearPrecio(Number(plato.precio))}
        </p>
      </div>

      <button
        onClick={() => alAgregar(plato)}
        className="self-end w-10 h-10 flex items-center justify-center rounded-lg bg-[#F5F0EB] text-[#C44536] font-bold text-lg hover:bg-[#C44536] hover:text-white transition-colors active:scale-95 shrink-0"
        aria-label={`Agregar ${plato.nombre} al carrito`}
      >
        +
      </button>
    </div>
  );
}
