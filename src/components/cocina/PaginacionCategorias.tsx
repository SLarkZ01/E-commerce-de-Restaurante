import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginacionCategoriasProps {
  pagina: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

export function PaginacionCategorias({
  pagina,
  totalPaginas,
  onCambiarPagina,
}: PaginacionCategoriasProps) {
  const anterior = useCallback(() => {
    onCambiarPagina(Math.max(1, pagina - 1));
  }, [pagina, onCambiarPagina]);

  const siguiente = useCallback(() => {
    onCambiarPagina(Math.min(totalPaginas, pagina + 1));
  }, [pagina, totalPaginas, onCambiarPagina]);

  const paginas = (() => {
    const items = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    if (totalPaginas <= 5) return items;

    const visibles = items.filter((num) => {
      if (num === 1 || num === totalPaginas) return true;
      return Math.abs(num - pagina) <= 1;
    });

    return visibles.reduce<(number | "ellipsis")[]>((acc, num, idx) => {
      if (idx > 0 && num - (visibles[idx - 1] as number) > 1) {
        acc.push("ellipsis");
      }
      acc.push(num);
      return acc;
    }, []);
  })();

  return (
    <div className="mt-3 pt-3 border-t border-borde/30 flex items-center justify-between shrink-0">
      <span className="text-[11px] text-texto-terciario tabular-nums">
        {pagina} / {totalPaginas}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={anterior}
          disabled={pagina === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-texto-secundario hover:bg-fondo-oscuro hover:text-texto disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-0.5">
          {paginas.map((item, idx) =>
            item === "ellipsis" ? (
              <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-[11px] text-texto-terciario">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onCambiarPagina(item)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  item === pagina
                    ? "bg-primario text-primario-texto"
                    : "text-texto-secundario hover:bg-fondo-oscuro hover:text-texto"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          onClick={siguiente}
          disabled={pagina === totalPaginas}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-texto-secundario hover:bg-fondo-oscuro hover:text-texto disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
