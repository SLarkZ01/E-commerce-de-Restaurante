"use client";

import { useState, useEffect } from "react";
import { Clock, ArrowRight, Check, AlertTriangle, PackageCheck, Timer } from "lucide-react";
import { cambiarEstadoPedido, type PedidoConItems } from "@/lib/acciones/cocina";
import { formatearPrecio } from "@/lib/formato";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ESTADOS = ["pendiente", "preparando", "listo"] as const;

const CONFIG_ESTADO: Record<string, {
  color: string;
  bg: string;
  bgHeader: string;
  border: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
}> = {
  pendiente: {
    color: "text-info",
    bg: "bg-info/10",
    bgHeader: "bg-info/5",
    border: "border-l-info",
    label: "Pendiente",
    icon: <Clock className="w-4 h-4" />,
    desc: "pedidos en cola",
  },
  preparando: {
    color: "text-advertencia",
    bg: "bg-advertencia/10",
    bgHeader: "bg-advertencia/5",
    border: "border-l-advertencia",
    label: "Preparando",
    icon: <AlertTriangle className="w-4 h-4" />,
    desc: "en preparación",
  },
  listo: {
    color: "text-exito",
    bg: "bg-exito/10",
    bgHeader: "bg-exito/5",
    border: "border-l-exito",
    label: "Listo",
    icon: <Check className="w-4 h-4" />,
    desc: "listo para entregar",
  },
};

interface KanbanPedidosProps {
  pedidosIniciales: PedidoConItems[];
}

export function KanbanPedidos({ pedidosIniciales }: KanbanPedidosProps) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 30000);
    return () => clearInterval(intervalo);
  }, []);

  const pedidosPorEstado = (estado: string) =>
    pedidos.filter((p) => p.estado === estado);

  const handleCambiarEstado = async (
    pedidoId: string,
    nuevoEstado: string
  ) => {
    setMensaje("");
    const resultado = await cambiarEstadoPedido(
      pedidoId,
      nuevoEstado as "preparando" | "listo" | "entregado",
      "cocinero"
    );

    if (resultado.error) {
      setMensaje(resultado.error);
      return;
    }

    if (nuevoEstado === "entregado") {
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    } else {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, estado: nuevoEstado as PedidoConItems["estado"] } : p
        )
      );
    }
  };

  const tiempoTranscurrido = (fecha: string) => {
    const minutos = Math.floor((ahora - new Date(fecha).getTime()) / 60000);
    if (minutos < 1) return "Ahora";
    if (minutos === 1) return "1 min";
    return `${minutos} min`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {mensaje && (
        <div className="mx-6 mt-3 px-4 py-2.5 bg-error/10 text-error text-sm rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {mensaje}
        </div>
      )}

      <div className="flex-1 flex gap-4 p-6 overflow-x-auto">
        {ESTADOS.map((estado) => {
          const config = CONFIG_ESTADO[estado];
          const pedidosEstado = pedidosPorEstado(estado);
          return (
            <Card key={estado} className="flex-1 min-w-[320px] max-w-[420px] flex flex-col border-borde/60 shadow-[0_1px_3px_rgba(45,42,38,0.04)]">
              <CardHeader className={`pb-3 ${config.bgHeader} rounded-t-xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={config.color}>{config.icon}</span>
                    <CardTitle className="text-sm font-semibold uppercase tracking-wide text-texto-secundario">
                      {config.label}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className={`${config.bg} ${config.color} text-xs font-bold`}>
                    {pedidosEstado.length}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {pedidosEstado.length} {config.desc}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 p-3">
                <ScrollArea className="h-full pr-2" style={{ maxHeight: "calc(100dvh - 280px)" }}>
                  {pedidosEstado.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-texto-terciario">
                      <div className="w-14 h-14 rounded-full bg-fondo-oscuro flex items-center justify-center mb-3">
                        {config.icon}
                      </div>
                      <p className="text-sm font-medium text-texto-secundario">Sin pedidos</p>
                      <p className="text-xs mt-0.5">Los pedidos aparecerán aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pedidosEstado.map((pedido) => {
                        const minutos = Math.floor((ahora - new Date(pedido.creado_en).getTime()) / 60000);
                        const esUrgente = minutos > 10;
                        return (
                          <Card key={pedido.id} className={`border-borde/60 border-l-4 ${config.border} shadow-[0_1px_3px_rgba(45,42,38,0.04)] hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)] transition-all`}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="font-playfair text-xl font-bold text-texto">
                                  Mesa {pedido.mesa_id ? `#${pedido.mesa_id.slice(0, 4)}` : "?"}
                                </CardTitle>
                                <Badge variant="secondary" className={`${config.bg} ${config.color} text-[10px] font-semibold`}>
                                  {config.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Timer className={`w-3.5 h-3.5 ${esUrgente ? "text-advertencia animate-pulse" : "text-texto-terciario"}`} />
                                <span className={`text-xs ${esUrgente ? "text-advertencia font-semibold" : "text-texto-terciario"}`}>
                                  {tiempoTranscurrido(pedido.creado_en)}
                                </span>
                                {esUrgente && (
                                  <Badge variant="destructive" className="text-[10px] font-semibold ml-1 animate-pulse">
                                    Urgente
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>

                            <CardContent className="pb-2">
                              <div className="space-y-1.5 mb-3">
                                {pedido.items.map((item, i) => (
                                  <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-texto font-medium">
                                      <span className="text-primario font-bold mr-1.5">{item.cantidad}x</span>
                                      {item.plato_nombre}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-texto-secundario">Total</span>
                                <span className="font-playfair text-base font-bold text-primario tabular-nums">
                                  {formatearPrecio(pedido.total)}
                                </span>
                              </div>
                            </CardContent>

                            <CardFooter className="pt-2">
                              {estado === "pendiente" && (
                                <Button
                                  onClick={() => handleCambiarEstado(pedido.id, "preparando")}
                                  size="sm"
                                  className="w-full bg-primario hover:bg-primario-hover text-primario-texto text-xs font-semibold active:scale-[0.98]"
                                >
                                  Iniciar Preparación
                                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                              )}
                              {estado === "preparando" && (
                                <Button
                                  onClick={() => handleCambiarEstado(pedido.id, "listo")}
                                  size="sm"
                                  className="w-full bg-exito hover:bg-exito/90 text-white text-xs font-semibold active:scale-[0.98]"
                                >
                                  <Check className="w-3.5 h-3.5 mr-1" />
                                  Marcar Listo
                                </Button>
                              )}
                              {estado === "listo" && (
                                <Button
                                  onClick={() => handleCambiarEstado(pedido.id, "entregado")}
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-xs font-semibold active:scale-[0.98]"
                                >
                                  <PackageCheck className="w-3.5 h-3.5 mr-1" />
                                  Entregar
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function SkeletonKanban() {
  return (
    <div className="flex-1 flex gap-4 p-6 overflow-x-auto">
      {["Pendiente", "Preparando", "Listo"].map((estado) => (
        <Card key={estado} className="flex-1 min-w-[320px] max-w-[420px] flex flex-col border-borde/60">
          <CardHeader className="pb-3 bg-fondo-oscuro rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-6 h-5 rounded-full" />
            </div>
            <Skeleton className="w-24 h-3" />
          </CardHeader>
          <CardContent className="flex-1 p-3">
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card key={i} className="border-borde/60 border-l-4 border-l-fondo-oscuro">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Skeleton className="w-16 h-6" />
                      <Skeleton className="w-14 h-5 rounded-full" />
                    </div>
                    <Skeleton className="w-16 h-3" />
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-full h-px" />
                    <div className="flex justify-between">
                      <Skeleton className="w-8 h-3" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Skeleton className="w-full h-8 rounded-lg" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
