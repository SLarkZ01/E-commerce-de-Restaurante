"use client";

import { useMemo, useState, useEffect, memo } from "react";
import { Clock, ShoppingBag } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { formatearPrecio } from "@/lib/formato";
import type { PedidoConDetalles } from "@/types";

interface TablaPedidosAdminProps {
  pedidos: PedidoConDetalles[];
  pagina: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

const ESTADO_COLORES: Record<string, string> = {
  entregado: "bg-exito/10 text-exito border-exito/20",
  listo: "bg-exito/10 text-exito border-exito/20",
  preparando: "bg-advertencia/10 text-advertencia border-advertencia/20",
  pendiente: "bg-info/10 text-info border-info/20",
};

function formatearHace(creadoEn: string): string {
  const diff = Date.now() - new Date(creadoEn).getTime();
  const minutos = Math.floor(diff / 60000);
  if (minutos < 1) return "Ahora";
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas} h`;
  return `${Math.floor(horas / 24)} d`;
}

const TiempoHace = memo(function TiempoHace({ creadoEn }: { creadoEn: string }) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    function actualizar() {
      const diff = Date.now() - new Date(creadoEn).getTime();
      const minutos = Math.floor(diff / 60000);
      if (minutos < 1) setTexto("Ahora");
      else if (minutos < 60) setTexto(`${minutos} min`);
      else {
        const horas = Math.floor(minutos / 60);
        if (horas < 24) setTexto(`${horas} h`);
        else setTexto(`${Math.floor(horas / 24)} d`);
      }
    }
    actualizar();
    const id = setInterval(actualizar, 30000);
    return () => clearInterval(id);
  }, [creadoEn]);

  return <>{texto}</>;
});

export function TablaPedidosAdmin({
  pedidos,
  pagina,
  totalPaginas,
  onCambiarPagina,
}: TablaPedidosAdminProps) {
  const paginas = useMemo(() => {
    const resultado: number[] = [];
    for (let i = 1; i <= totalPaginas; i++) {
      if (i === 1 || i === totalPaginas || (i >= pagina - 1 && i <= pagina + 1)) {
        resultado.push(i);
      } else if (resultado[resultado.length - 1] !== -1) {
        resultado.push(-1);
      }
    }
    return resultado;
  }, [totalPaginas, pagina]);

  return (
    <div className="bg-fondo-card rounded-2xl border border-borde/60 shadow-[0_1px_3px_rgba(45,42,38,0.04)] overflow-hidden">
      <div className="px-6 py-5 border-b border-borde/60">
        <h2 className="text-base font-semibold text-texto">
          Pedidos recientes
        </h2>
        <p className="text-sm text-texto-secundario mt-1">
          Historial de transacciones en tiempo real
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3.5 text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Hace
                </span>
              </TableHead>
              <TableHead className="px-6 py-3.5 text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                Pedido
              </TableHead>
              <TableHead className="px-6 py-3.5 text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                Mesa
              </TableHead>
              <TableHead className="px-6 py-3.5 text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                <span className="inline-flex items-center gap-1.5">
                  <ShoppingBag className="w-3 h-3" />
                  Items
                </span>
              </TableHead>
              <TableHead className="px-6 py-3.5 text-right text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                Total
              </TableHead>
              <TableHead className="px-6 py-3.5 text-center text-xs font-semibold text-texto-secundario uppercase tracking-wide">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="px-6 py-4 text-texto-secundario text-sm tabular-nums">
                  <TiempoHace creadoEn={p.creado_en} />
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-texto text-sm">
                  #{p.id.slice(0, 8)}
                </TableCell>
                <TableCell className="px-6 py-4 text-texto-secundario text-sm">
                  {p.mesa_numero ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primario/40" />
                      Mesa {p.mesa_numero}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-texto-terciario">
                      <span className="w-1.5 h-1.5 rounded-full bg-texto-terciario/40" />
                      Llevar
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-texto-secundario text-sm max-w-56">
                  <span className="truncate block">
                    {p.items.map((i) => `${i.cantidad}x ${i.plato_nombre}`).join(", ")}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-semibold text-texto text-sm tabular-nums">
                  {formatearPrecio(p.total)}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold ${ESTADO_COLORES[p.estado] ?? "bg-fondo-oscuro text-texto-secundario"}`}
                  >
                    {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {pedidos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-texto-terciario">
                  No hay pedidos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="px-6 py-4 border-t border-borde/60 flex items-center justify-between">
          <p className="text-xs text-texto-terciario">
            Página {pagina} de {totalPaginas}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onCambiarPagina(pagina - 1)}
                  className={pagina <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {paginas.map((p, i) =>
                p === -1 ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <span className="flex size-9 items-center justify-center text-texto-terciario">
                      ...
                    </span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === pagina}
                      onClick={() => onCambiarPagina(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onCambiarPagina(pagina + 1)}
                  className={pagina >= totalPaginas ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
