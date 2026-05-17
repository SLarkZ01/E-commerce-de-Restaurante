import { memo } from "react";
import { Utensils, Coffee, Sandwich } from "lucide-react";

type TipoPlatoValor = "plato_fuerte" | "bebida" | "combo";

const TIPOS_PLATO: {
  valor: TipoPlatoValor;
  etiqueta: string;
  icono: React.ReactNode;
  color: string;
}[] = [
  {
    valor: "plato_fuerte",
    etiqueta: "Plato Fuerte",
    icono: <Utensils className="w-5 h-5" />,
    color: "bg-acento/10 text-acento border-acento/20",
  },
  {
    valor: "bebida",
    etiqueta: "Bebida",
    icono: <Coffee className="w-5 h-5" />,
    color: "bg-info/10 text-info border-info/20",
  },
  {
    valor: "combo",
    etiqueta: "Combo",
    icono: <Sandwich className="w-5 h-5" />,
    color: "bg-exito/10 text-exito border-exito/20",
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
    <div className="grid grid-cols-3 gap-2">
      {TIPOS_PLATO.map((tipo) => {
        const activo = valor === tipo.valor;
        return (
          <button
            key={tipo.valor}
            type="button"
            onClick={() => onChange(tipo.valor)}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200 ${
              activo
                ? `bg-primario text-primario-texto border-primario shadow-sm`
                : `bg-fondo-card text-texto-secundario border-borde/50 hover:border-primario/30 hover:text-texto`
            }`}
          >
            <span className={activo ? "text-primario-texto" : tipo.color.split(" ")[1]}>
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
