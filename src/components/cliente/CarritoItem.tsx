import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatearPrecio } from "@/lib/formato";
import type { ItemCarrito } from "@/stores/cart";

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
    <div className="flex items-center gap-3 bg-fondo rounded-xl p-3 border border-borde/40">
      <div className="w-12 h-12 rounded-lg bg-fondo-oscuro flex items-center justify-center text-texto-terciario shrink-0">
        {item.imagenUrl ? (
          <img
            src={item.imagenUrl}
            alt={item.nombre}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <ShoppingBag className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-texto truncate">{item.nombre}</p>
        <p className="text-xs text-texto-secundario">
          {formatearPrecio(item.precio)} c/u
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
          className="w-7 h-7 rounded-md bg-fondo-oscuro text-texto flex items-center justify-center hover:bg-borde transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-semibold w-5 text-center tabular-nums">
          {item.cantidad}
        </span>
        <button
          onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
          className="w-7 h-7 rounded-md bg-fondo-oscuro text-texto flex items-center justify-center hover:bg-borde transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        onClick={() => onEliminar(item.id)}
        className="text-texto-terciario hover:text-error transition-colors p-1"
        aria-label={`Eliminar ${item.nombre}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
