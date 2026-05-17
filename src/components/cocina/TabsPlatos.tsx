import { memo } from "react";

type TabActiva = "todos" | "disponibles" | "agotados";

interface TabItem {
  key: TabActiva;
  label: string;
  count: number;
}

interface TabsPlatosProps {
  tabs: TabItem[];
  activa: TabActiva;
  onCambio: (key: TabActiva) => void;
}

export const TabsPlatos = memo(function TabsPlatos({ tabs, activa, onCambio }: TabsPlatosProps) {
  return (
    <div className="flex items-center gap-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onCambio(tab.key)}
          className="relative pb-3 text-sm font-semibold transition-colors group"
        >
          <span className={activa === tab.key ? "text-texto" : "text-texto-terciario group-hover:text-texto-secundario"}>
            {tab.label}
          </span>
          <span className={`ml-1.5 text-xs ${activa === tab.key ? "text-texto-secundario" : "text-texto-terciario/50"}`}>
            {tab.count}
          </span>
          {activa === tab.key && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primario rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
});
