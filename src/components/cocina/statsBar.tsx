import { Clock, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import type { StatsCocina } from "@/lib/acciones/cocina";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsBarProps {
  stats: StatsCocina;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="sticky top-16 z-20 bg-fondo/95 backdrop-blur-sm border-b border-borde/60 px-6 py-4">
      <div className="flex gap-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-4">
        <StatItem
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-info/10"
          iconColor="text-info"
          label="Pendientes"
          valor={stats.pendientes.toString()}
        />
        <StatItem
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-advertencia/10"
          iconColor="text-advertencia"
          label="Preparando"
          valor={stats.preparando.toString()}
        />
        <StatItem
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-exito/10"
          iconColor="text-exito"
          label="Listos"
          valor={stats.listos.toString()}
        />
        <StatItem
          icon={<Timer className="w-5 h-5" />}
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
    <div className="flex items-center gap-4 bg-fondo-card rounded-2xl border border-borde/60 px-5 py-4 shadow-[0_1px_2px_rgba(45,42,38,0.03)] shrink-0 md:shrink md:w-full min-w-[160px]">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-texto-terciario uppercase tracking-wide">
          {label}
        </p>
        <p className="font-playfair text-xl font-bold text-texto tabular-nums leading-tight mt-0.5">
          {valor}
        </p>
      </div>
    </div>
  );
}

export function SkeletonStatsBar() {
  return (
    <div className="sticky top-16 z-20 bg-fondo/95 backdrop-blur-sm border-b border-borde/60 px-6 py-4">
      <div className="flex gap-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-fondo-card rounded-2xl border border-borde/60 px-5 py-4 shrink-0 min-w-[160px]">
            <Skeleton className="w-11 h-11 rounded-xl" />
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
