import { Clock, Check, AlertTriangle } from "lucide-react";

export const ESTADOS = ["pendiente", "preparando", "listo"] as const;
export type EstadoKanban = (typeof ESTADOS)[number];

export interface EstadoConfig {
  color: string;
  bg: string;
  bgHeader: string;
  bgColumna: string;
  border: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
}

export const CONFIG_ESTADO: Record<EstadoKanban, EstadoConfig> = {
  pendiente: {
    color: "text-info",
    bg: "bg-info/10",
    bgHeader: "bg-info/5",
    bgColumna: "bg-info/8",
    border: "border-l-info",
    label: "Pendiente",
    icon: <Clock className="w-5 h-5" />,
    desc: "pedidos en cola",
  },
  preparando: {
    color: "text-advertencia",
    bg: "bg-advertencia/10",
    bgHeader: "bg-advertencia/5",
    bgColumna: "bg-advertencia/8",
    border: "border-l-advertencia",
    label: "Preparando",
    icon: <AlertTriangle className="w-5 h-5" />,
    desc: "en preparación",
  },
  listo: {
    color: "text-exito",
    bg: "bg-exito/10",
    bgHeader: "bg-exito/5",
    bgColumna: "bg-exito/8",
    border: "border-l-exito",
    label: "Listo",
    icon: <Check className="w-5 h-5" />,
    desc: "listo para entregar",
  },
};
