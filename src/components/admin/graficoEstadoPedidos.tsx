"use client";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DistribucionEstado } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoEstadoPedidosProps {
  datos: DistribucionEstado[];
}

export function GraficoEstadoPedidos({ datos }: GraficoEstadoPedidosProps) {
  const total = datos.reduce((sum, d) => sum + d.cantidad, 0);

  const chartData = useMemo(() => ({
    labels: datos.map((d) => d.estado.charAt(0).toUpperCase() + d.estado.slice(1)),
    datasets: [
      {
        data: datos.map((d) => d.cantidad),
        backgroundColor: datos.map((d) => d.color),
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  }), [datos]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#FFFFFF",
        titleColor: "#2D2A26",
        bodyColor: "#78716C",
        borderColor: "#E7E0D8",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { raw: unknown; label: string }) => [`${ctx.raw} pedidos`, ctx.label],
        },
      },
    },
  }), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-texto">
          Estado de pedidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-6">
          <div className="relative w-[220px] h-[220px] shrink-0">
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-playfair text-2xl font-bold text-texto">
                {total}
              </span>
              <span className="text-xs text-texto-secundario">total</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {datos.map((d) => (
              <div key={d.estado} className="flex items-center gap-2">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-sm text-texto-secundario capitalize">{d.estado}</span>
                <span className="text-sm font-semibold text-texto tabular-nums ml-auto">
                  {d.cantidad}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
