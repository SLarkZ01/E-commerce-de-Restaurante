import { memo } from "react";
import { Utensils, Coffee, Sandwich } from "lucide-react";

type TipoPlatoValor = "plato_fuerte" | "bebida" | "combo";

const TIPOS_PLATO: {
  valor: TipoPlatoValor;
  etiqueta: string;
  icono: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  iconoInactivo: string;
}[] = [
  {
    valor: "plato_fuerte",
    etiqueta: "Plato Fuerte",
    icono: <Utensils className="w-5 h-5" />,
    bg: "bg-acento/15",
    text: "text-acento",
    border: "border-acento/40",
    iconoInactivo: "text-acento",
  },
  {
    valor: "bebida",
    etiqueta: "Bebida",
    icono: <Coffee className="w-5 h-5" />,
    bg: "bg-info/15",
    text: "text-info",
    border: "border-info/40",
    iconoInactivo: "text-info",
  },
  {
    valor: "combo",
    etiqueta: "Combo",
    icono: <Sandwich className="w-5 h-5" />,
    bg: "bg-exito/15",
    text: "text-exito",
    border: "border-exito/40",
    iconoInactivo: "text-exito",
  },
];

interface SelectorTipoPlatoProps {
  valor: TipoPlatoValor;
  onChange: (tipo: TipoPlatoValor) => void;
}

export const SelectorTipoPlato = memo(function SelectorTipoPlato({
  valor,
  onChange,
}: SelectorTipoPlatoProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {TIPOS_PLATO.map((tipo) => {
        const activo = valor === tipo.valor;
        return (
          <button
            key={tipo.valor}
            type="button"
            onClick={() => onChange(tipo.valor)}
            className={`flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl border-2 transition-all duration-200 ${
              activo
                ? `${tipo.bg} ${tipo.text} ${tipo.border} shadow-sm scale-[1.02]`
                : `bg-fondo-card text-texto-secundario border-borde/40 hover:border-borde hover:text-texto`
            }`}
          >
            <span className={activo ? tipo.text : tipo.iconoInactivo}>
              {tipo.icono}
            </span>
            <span className="text-[11px] font-semibold leading-tight">
              {tipo.etiqueta}
            </span>
          </button>
        );
      })}
    </div>
  );
});
