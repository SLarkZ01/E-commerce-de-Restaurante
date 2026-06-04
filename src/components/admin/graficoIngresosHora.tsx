"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "@/lib/chart-setup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatearPrecio } from "@/lib/formato";
import type { IngresoPorHora } from "@/types";

interface GraficoIngresosHoraProps {
  datos: IngresoPorHora[];
}

function formatearHoraAMPM(hora: number): string {
  if (hora === 0) return "12:00 a.m.";
  if (hora === 12) return "12:00 p.m.";
  if (hora < 12) return `${hora}:00 a.m.`;
  return `${hora - 12}:00 p.m.`;
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

export function GraficoIngresosHora({ datos }: GraficoIngresosHoraProps) {
  const chartData = useMemo(() => {
    const labels = datos.map((d, i) => (i % 3 === 0 ? formatearHoraAMPM(d.hora) : ""));
    const values = datos.map((d) => d.total);
    return {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: values,
          backgroundColor: "#C44536",
          borderRadius: 4,
          maxBarThickness: 40,
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
          title: (items: { dataIndex: number }[]) => {
            const idx = items[0]?.dataIndex ?? 0;
            return formatearHoraAMPM(idx);
          },
          label: (ctx: { raw: unknown }) => formatearPrecio(ctx.raw as number),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#78716C", font: { size: 10 } },
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
          Ingresos por hora (hoy)
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
