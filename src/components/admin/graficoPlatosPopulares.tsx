"use client";

import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import "@/lib/chart-setup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatearPrecio } from "@/lib/formato";
import type { PlatoPopular } from "@/types";

interface GraficoPlatosPopularesProps {
  datos: PlatoPopular[];
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

export function GraficoPlatosPopulares({ datos }: GraficoPlatosPopularesProps) {
  const [metrica, setMetrica] = useState<"cantidad" | "total">("cantidad");

  const invertido = useMemo(() => [...datos].reverse(), [datos]);

  const chartData = useMemo(() => {
    const labels = invertido.map((d) =>
      d.nombre.length > 18 ? d.nombre.slice(0, 18) + "..." : d.nombre
    );
    const values = invertido.map((d) => d[metrica]);
    return {
      labels,
      datasets: [
        {
          label: metrica === "cantidad" ? "Unidades vendidas" : "Ingresos",
          data: values,
          backgroundColor: metrica === "cantidad" ? "#3B82F6" : "#65A30D",
          borderRadius: 4,
          maxBarThickness: 28,
        },
      ],
    };
  }, [invertido, metrica]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
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
          label: (ctx: { raw: unknown }) =>
            metrica === "total"
              ? formatearPrecio(ctx.raw as number)
              : `${ctx.raw} unid.`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#E7E0D8" },
        ticks: {
          color: "#78716C",
          font: { size: 11 },
          callback: (v: string | number) =>
            metrica === "total"
              ? abreviarMoneda(Number(v))
              : Number(v).toString(),
        },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#78716C",
          font: { size: 11 },
        },
        border: { display: false },
      },
    },
  }), [metrica]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-texto">
          Platos más vendidos
        </CardTitle>
        <Tabs
          value={metrica}
          onValueChange={(v) => setMetrica(v as "cantidad" | "total")}
        >
          <TabsList className="h-8">
            <TabsTrigger value="cantidad" className="text-xs px-3 h-7">
              Unidades
            </TabsTrigger>
            <TabsTrigger value="total" className="text-xs px-3 h-7">
              Ingresos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
