"use client";

import { useState, useCallback } from "react";
import { Clock, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";
import type { StatsCocina, Pedido } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsBarProps {
  stats: StatsCocina;
}

export function StatsBar({ stats: statsIniciales }: StatsBarProps) {
  const [stats, setStats] = useState(statsIniciales);

  // Observer: actualizar contadores en tiempo real
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInsert = useCallback((payload: any) => {
    const nuevo = payload.new as Pedido | undefined;
    if (!nuevo) return;

    setStats((prev) => {
      const next = { ...prev };
      if (nuevo.estado === "pendiente") next.pendientes++;
      else if (nuevo.estado === "preparando") next.preparando++;
      else if (nuevo.estado === "listo") next.listos++;
      return next;
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpdate = useCallback((payload: any) => {
    const nuevo = payload.new as Pedido | undefined;
    const viejo = payload.old as Pedido | undefined;
    if (!nuevo) return;

    setStats((prev) => {
      const next = { ...prev };
      if (viejo?.estado === "pendiente") next.pendientes--;
      else if (viejo?.estado === "preparando") next.preparando--;
      else if (viejo?.estado === "listo") next.listos--;
      if (nuevo.estado === "pendiente") next.pendientes++;
      else if (nuevo.estado === "preparando") next.preparando++;
      else if (nuevo.estado === "listo") next.listos++;
      next.pendientes = Math.max(0, next.pendientes);
      next.preparando = Math.max(0, next.preparando);
      next.listos = Math.max(0, next.listos);
      return next;
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDelete = useCallback((payload: any) => {
    const viejo = payload.old as Pedido | undefined;
    if (!viejo) return;

    setStats((prev) => {
      const next = { ...prev };
      if (viejo.estado === "pendiente") next.pendientes--;
      else if (viejo.estado === "preparando") next.preparando--;
      else if (viejo.estado === "listo") next.listos--;
      next.pendientes = Math.max(0, next.pendientes);
      next.preparando = Math.max(0, next.preparando);
      next.listos = Math.max(0, next.listos);
      return next;
    });
  }, []);

  useRealtime("pedidos", "INSERT", onInsert);
  useRealtime("pedidos", "UPDATE", onUpdate);
  useRealtime("pedidos", "DELETE", onDelete);

  return (
    <div className="sticky top-16 z-20 bg-fondo/95 backdrop-blur-sm border-b border-borde/60 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-4">
        <StatItem
          icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
          iconBg="bg-info/10"
          iconColor="text-info"
          label="Pendientes"
          valor={stats.pendientes.toString()}
        />
        <StatItem
          icon={<AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />}
          iconBg="bg-advertencia/10"
          iconColor="text-advertencia"
          label="Preparando"
          valor={stats.preparando.toString()}
        />
        <StatItem
          icon={<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          iconBg="bg-exito/10"
          iconColor="text-exito"
          label="Listos"
          valor={stats.listos.toString()}
        />
        <StatItem
          icon={<Timer className="w-4 h-4 sm:w-5 sm:h-5" />}
          iconBg="bg-primario/10"
          iconColor="text-primario"
          label="Tiempo promedio"
          valor={stats.tiempoPromedioMin > 0 ? `${stats.tiempoPromedioMin} min` : "—"}
        />
      </div>
    </div>
  );
}

function StatItem({
  icon,
  iconBg,
  iconColor,
  label,
  valor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  valor: string;
}) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-4 bg-fondo-card rounded-xl sm:rounded-2xl border border-borde/60 px-3 sm:px-5 py-2.5 sm:py-4 shadow-[0_1px_2px_rgba(45,42,38,0.03)] shrink-0 md:shrink md:w-full min-w-[140px] sm:min-w-[160px]">
      <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs font-medium text-texto-terciario uppercase tracking-wide">{label}</p>
        <p className="font-playfair text-lg sm:text-xl font-bold text-texto tabular-nums leading-tight mt-0.5">{valor}</p>
      </div>
    </div>
  );
}

export function SkeletonStatsBar() {
  return (
    <div className="sticky top-16 z-20 bg-fondo/95 backdrop-blur-sm border-b border-borde/60 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2.5 sm:gap-4 bg-fondo-card rounded-xl sm:rounded-2xl border border-borde/60 px-3 sm:px-5 py-2.5 sm:py-4 shrink-0 min-w-[140px] sm:min-w-[160px]">
            <Skeleton className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-12 h-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
