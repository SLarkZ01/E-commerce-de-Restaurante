"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "@/lib/chart-setup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatearPrecio } from "@/lib/formato";
import type { IngresoPorDia } from "@/types";

interface GraficoTendenciaSemanalProps {
  datos: IngresoPorDia[];
}

function formatearFecha(fecha: string): string {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const [a, m, d] = fecha.split("-").map(Number);
  return dias[new Date(a, m - 1, d).getDay()];
}

function abreviarMoneda(valor: number): string {
  if (valor >= 1_000_000) {
    return `$${(valor / 1_000_000).toFixed(valor % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (valor >= 1_000) {
    return `$${(valor / 1_000).toFixed(0)}k`;
  }
  return `$${valor}`;
}

export function GraficoTendenciaSemanal({ datos }: GraficoTendenciaSemanalProps) {
  const chartData = useMemo(() => {
    const labels = datos.map((d) => formatearFecha(d.fecha));
    const values = datos.map((d) => d.total);
    return {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: values,
          backgroundColor: "#D4A574",
          borderRadius: 4,
          maxBarThickness: 48,
        },
      ],
    };
  }, [datos]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
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
          title: (items: { label: string }[]) => items[0]?.label ?? "",
          label: (ctx: { raw: unknown }) => formatearPrecio(ctx.raw as number),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#78716C", font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: "#E7E0D8" },
        ticks: {
          color: "#78716C",
          font: { size: 11 },
          callback: (v: string | number) => abreviarMoneda(Number(v)),
        },
        border: { display: false },
      },
    },
  }), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-texto">
          Tendencia semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
