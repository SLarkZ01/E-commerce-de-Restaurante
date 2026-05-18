"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatearPrecio } from "@/lib/formato";
import type { IngresoPorHora } from "@/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface GraficoIngresosHoraProps {
  datos: IngresoPorHora[];
}

export function GraficoIngresosHora({ datos }: GraficoIngresosHoraProps) {
  const chartData = useMemo(() => {
    const labels = datos.map((d) => `${d.hora.toString().padStart(2, "0")}:00`);
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
          callback: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k`,
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
