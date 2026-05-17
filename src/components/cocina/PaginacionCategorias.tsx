import { useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    <Pagination className="mt-4 pt-4 border-t border-borde/30 justify-between shrink-0">
      <p className="text-[11px] text-texto-terciario self-center tabular-nums">
        Pág. {pagina} de {totalPaginas}
      </p>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={anterior}
            disabled={pagina === 1}
            className="disabled:opacity-30 disabled:cursor-not-allowed"
          />
        </PaginationItem>
        {paginas.map((item, idx) =>
          item === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                onClick={() => onCambiarPagina(item)}
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
            onClick={siguiente}
            disabled={pagina === totalPaginas}
            className="disabled:opacity-30 disabled:cursor-not-allowed"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
