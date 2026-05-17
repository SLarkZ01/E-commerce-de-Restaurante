import Link from "next/link";
import { UtensilsCrossed, Lock } from "lucide-react";

export function BarraSuperior() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-fondo/95 backdrop-blur-sm border-b border-borde/60">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primario/10 flex items-center justify-center">
          <UtensilsCrossed className="w-4 h-4 text-primario" />
        </div>
        <span className="font-playfair text-lg font-bold text-texto tracking-tight">
          E-Kitchen
        </span>
      </div>
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs font-medium text-texto-secundario hover:text-primario transition-colors px-3 py-1.5 rounded-lg hover:bg-primario/5"
      >
        <Lock className="w-3.5 h-3.5" />
        Staff
      </Link>
    </header>
  );
}
