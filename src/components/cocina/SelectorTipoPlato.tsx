import { memo } from "react";
import { Utensils, Coffee, Sandwich } from "lucide-react";

type TipoPlatoValor = "plato_fuerte" | "bebida" | "combo";

const TIPOS_PLATO: {
  valor: TipoPlatoValor;
  etiqueta: string;
  icono: React.ReactNode;
  subtitulo: string;
}[] = [
  {
    valor: "plato_fuerte",
    etiqueta: "Plato Fuerte",
    icono: <Utensils className="w-4 h-4" />,
    subtitulo: "Entrada o principal",
  },
  {
    valor: "bebida",
    etiqueta: "Bebida",
    icono: <Coffee className="w-4 h-4" />,
    subtitulo: "Refresco o licor",
  },
  {
    valor: "combo",
    etiqueta: "Combo",
    icono: <Sandwich className="w-4 h-4" />,
    subtitulo: "Paquete especial",
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
    <div className="flex gap-2">
      {TIPOS_PLATO.map((tipo) => {
        const activo = valor === tipo.valor;
        return (
          <button
            key={tipo.valor}
            type="button"
            onClick={() => onChange(tipo.valor)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${
              activo
                ? "bg-primario text-primario-texto shadow-sm"
                : "bg-fondo-oscuro text-texto-secundario hover:bg-borde/60"
            }`}
          >
            {tipo.icono}
            <span>{tipo.etiqueta}</span>
          </button>
        );
      })}
    </div>
  );
});
