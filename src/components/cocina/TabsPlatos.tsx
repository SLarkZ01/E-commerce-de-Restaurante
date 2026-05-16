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

export function TabsPlatos({ tabs, activa, onCambio }: TabsPlatosProps) {
  return (
    <div className="flex items-center gap-8">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onCambio(tab.key)}
          className="relative pb-3 text-sm font-semibold transition-colors group"
        >
          <span className={activa === tab.key ? "text-[#1A1A2E]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"}>
            {tab.label}
          </span>
          <span className={`ml-1.5 text-xs ${activa === tab.key ? "text-[#6B7280]" : "text-[#D1D5DB]"}`}>
            {tab.count}
          </span>
          {activa === tab.key && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#E8472A] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
