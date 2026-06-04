import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import type { ItemCarrito } from "@/types";

interface CarritoItemProps {
  item: ItemCarrito;
  onActualizarCantidad: (id: string, cantidad: number) => void;
  onEliminar: (id: string) => void;
}

export function CarritoItem({
  item,
  onActualizarCantidad,
  onEliminar,
}: CarritoItemProps) {
  return (
    <div className="flex items-center gap-3 bg-fondo-oscuro/50 rounded-xl p-3 border border-borde/30">
      <div className="relative w-14 h-14 rounded-lg bg-fondo-card flex items-center justify-center text-texto-terciario shrink-0 overflow-hidden">
        {item.imagenUrl ? (
          <Image
            src={item.imagenUrl}
            alt={item.nombre}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <ShoppingBag className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-texto truncate">{item.nombre}</p>
        <p className="text-xs text-texto-secundario mt-0.5">
          {formatearPrecio(item.precio)} c/u
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
          className="w-7 h-7 rounded-lg bg-fondo-card text-texto flex items-center justify-center hover:bg-borde transition-colors shadow-sm"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-semibold w-6 text-center tabular-nums">
          {item.cantidad}
        </span>
        <button
          onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
          className="w-7 h-7 rounded-lg bg-fondo-card text-texto flex items-center justify-center hover:bg-borde transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        onClick={() => onEliminar(item.id)}
        className="text-texto-terciario hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error/10"
        aria-label={`Eliminar ${item.nombre}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
