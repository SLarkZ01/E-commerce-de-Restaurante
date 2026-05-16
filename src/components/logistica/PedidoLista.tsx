import type { ItemPedidoConImagen } from "@/types";

interface PedidoListaProps {
  items: ItemPedidoConImagen[];
}

const MAX_VISIBLE = 4;

export function PedidoLista({ items }: PedidoListaProps) {
  if (items.length === 0) return null;

  const visibles = items.slice(0, MAX_VISIBLE);
  const restantes = items.length - MAX_VISIBLE;

  return (
    <div className="space-y-0.5">
      {visibles.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-1"
        >
          <span className="text-sm text-texto truncate pr-2">
            {item.plato_nombre}
          </span>
          <span className="text-xs font-semibold text-texto-secundario bg-fondo-oscuro rounded-full px-2 py-0.5 flex-shrink-0 tabular-nums">
            x{item.cantidad}
          </span>
        </div>
      ))}
      {restantes > 0 && (
        <div className="pt-1 border-t border-borde/50">
          <div className="max-h-24 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
            {items.slice(MAX_VISIBLE).map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1"
              >
                <span className="text-sm text-texto truncate pr-2">
                  {item.plato_nombre}
                </span>
                <span className="text-xs font-semibold text-texto-secundario bg-fondo-oscuro rounded-full px-2 py-0.5 flex-shrink-0 tabular-nums">
                  x{item.cantidad}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-texto-terciario mt-1 text-center">
            +{restantes} {restantes === 1 ? "más" : "más"}
          </p>
        </div>
      )}
    </div>
  );
}
