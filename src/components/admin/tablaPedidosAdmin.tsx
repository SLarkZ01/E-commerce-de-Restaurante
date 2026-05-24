"use client";

import { useMemo, useState, useEffect, memo, useCallback } from "react";
import { Clock, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

const TiempoHace = memo(function TiempoHace({ creadoEn }: { creadoEn: string }) {
  const [texto, setTexto] = useState(() => formatearHace(creadoEn));

  useEffect(() => {
    const id = setInterval(() => setTexto(formatearHace(creadoEn)), 30000);
    return () => clearInterval(id);
  }, [creadoEn]);

  const horaExacta = new Date(creadoEn).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(/\./g, "");

  return (
    <Tooltip>
      <TooltipTrigger className="cursor-default">
        <>{texto}</>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">Creado: {horaExacta}</p>
      </TooltipContent>
    </Tooltip>
  );
});

function formatearHace(creadoEn: string): string {
  const diff = Date.now() - new Date(creadoEn).getTime();
  const minutos = Math.floor(diff / 60000);
  if (minutos < 1) return "Ahora";
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas} h`;
  return `${Math.floor(horas / 24)} d`;
}

function PaginasVisibles({
  pagina,
  totalPaginas,
  onCambiarPagina,
}: {
  pagina: number;
  totalPaginas: number;
  onCambiarPagina: (p: number) => void;
}) {
  const paginas = useMemo(() => {
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
  }, [totalPaginas, pagina]);

  return (
    <div className="flex items-center gap-0.5">
      {paginas.map((item, idx) =>
        item === "ellipsis" ? (
          <span
            key={`e-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-[11px] text-texto-terciario"
          >
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
  );
}

function FilaPedido({ pedido }: { pedido: PedidoConDetalles }) {
  return (
    <TableRow>
      <TableCell className="px-6 py-4 text-texto-secundario text-sm tabular-nums">
        <TiempoHace creadoEn={pedido.creado_en} />
      </TableCell>
      <TableCell className="px-6 py-4 font-medium text-texto text-sm">
        #{pedido.id.slice(0, 8)}
      </TableCell>
      <TableCell className="px-6 py-4 text-texto-secundario text-sm">
        {pedido.mesa_numero ? (
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primario/40" />
            Mesa {pedido.mesa_numero}
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
          {pedido.items.map((i) => `${i.cantidad}x ${i.plato_nombre}`).join(", ")}
        </span>
      </TableCell>
      <TableCell className="px-6 py-4 text-right font-semibold text-texto text-sm tabular-nums">
        {formatearPrecio(pedido.total)}
      </TableCell>
      <TableCell className="px-6 py-4 text-center">
        <Badge
          variant="outline"
          className={`text-xs font-semibold ${ESTADO_COLORES[pedido.estado] ?? "bg-fondo-oscuro text-texto-secundario"}`}
        >
          {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

export function TablaPedidosAdmin({
  pedidos,
  pagina,
  totalPaginas,
  onCambiarPagina,
}: TablaPedidosAdminProps) {
  const anterior = useCallback(
    () => onCambiarPagina(pagina - 1),
    [pagina, onCambiarPagina]
  );
  const siguiente = useCallback(
    () => onCambiarPagina(pagina + 1),
    [pagina, onCambiarPagina]
  );

  return (
    <div className="bg-fondo-card rounded-2xl border border-borde/60 shadow-[0_1px_3px_rgba(45,42,38,0.04)] overflow-hidden">
      <div className="px-6 py-5 border-b border-borde/60">
        <h2 className="text-base font-semibold text-texto">
          Pedidos recientes
        </h2>
        <p className="text-sm text-texto-secundario mt-1">
          Historial de transacciones
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
            {pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-texto-terciario">
                  No hay pedidos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              pedidos.map((p) => <FilaPedido key={p.id} pedido={p} />)
            )}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="px-6 py-3 border-t border-borde/60 flex items-center justify-between">
          <span className="text-[11px] text-texto-terciario tabular-nums">
            {pagina} / {totalPaginas}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={anterior}
              disabled={pagina <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-texto-secundario hover:bg-fondo-oscuro hover:text-texto disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <PaginasVisibles
              pagina={pagina}
              totalPaginas={totalPaginas}
              onCambiarPagina={onCambiarPagina}
            />

            <button
              onClick={siguiente}
              disabled={pagina >= totalPaginas}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-texto-secundario hover:bg-fondo-oscuro hover:text-texto disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
