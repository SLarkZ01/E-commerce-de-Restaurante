"use client";

export function BarraSuperior() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#FEFAF6] border-b border-[#E7E0D8] shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">🍽️</span>
        <span className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
          E-Kitchen
        </span>
      </div>
      <a
        href="/login"
        className="text-xs font-medium text-[#78716C] hover:text-[#C44536] transition-colors"
      >
        Staff
      </a>
    </header>
  );
}
