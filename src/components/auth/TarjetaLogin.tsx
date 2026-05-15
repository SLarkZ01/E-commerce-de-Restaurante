import type { ReactNode } from "react";
import {
  UtensilsCrossed,
  ShieldCheck,
  Flame,
  Leaf,
} from "lucide-react";

interface TarjetaLoginProps {
  children: ReactNode;
}

export function TarjetaLogin({ children }: TarjetaLoginProps) {
  return (
    <div className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[420px] animate-scale-in">
      {/* Card con efecto glassmorphism */}
      <div className="relative group">
        {/* Glow detrás de la card */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-primario/30 via-acento/20 to-primario/30 rounded-2xl sm:rounded-[2rem] blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        <div className="relative rounded-2xl sm:rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(45,42,38,0.08),0_2px_8px_rgba(196,69,54,0.06)] overflow-hidden">
          {/* Barra decorativa superior */}
          <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-primario via-acento to-primario" />

          <div className="px-5 pt-5 pb-6 sm:px-8 sm:pt-9 sm:pb-9">
            {/* Header */}
            <Encabezado />

            {/* Formulario (children) */}
            {children}

            {/* Divider */}
            <Separador />

            {/* Footer */}
            <PieTarjeta />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <CopyRight />
    </div>
  );
}

function Encabezado() {
  return (
    <div className="flex flex-col items-center text-center mb-5 sm:mb-7 animate-fade-up">
      {/* Logo animado */}
      <div className="relative mb-3 sm:mb-5">
        <div className="absolute inset-0 rounded-2xl bg-primario/20 blur-lg scale-110 animate-pulse-glow" />
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-[72px] lg:h-[72px] rounded-xl sm:rounded-2xl bg-gradient-to-br from-primario to-primario-hover flex items-center justify-center shadow-lg shadow-primario/25 rotate-3 hover:rotate-0 transition-transform duration-500">
          <UtensilsCrossed
            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
            strokeWidth={2}
          />
        </div>
      </div>

      <h1 className="font-playfair text-xl sm:text-2xl lg:text-[2rem] font-bold text-texto leading-tight tracking-tight">
        Bienvenido a <span className="text-primario">E-Kitchen</span>
      </h1>
      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-texto-secundario max-w-[240px] sm:max-w-[280px] leading-relaxed">
        Accede al panel de gestión gastronómica. Solo personal autorizado.
      </p>
    </div>
  );
}

function Separador() {
  return (
    <div className="relative my-4 sm:my-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-borde/70" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-transparent px-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-texto-terciario">
          Solo miembros autorizados
        </span>
      </div>
    </div>
  );
}

function PieTarjeta() {
  return (
    <div className="space-y-1.5 sm:space-y-2 animate-fade-up" style={{ animationDelay: "0.5s" }}>
      <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-texto-terciario">
        <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primario/70" strokeWidth={2} />
        <span>Conexión segura con Supabase Auth</span>
      </div>

      <div className="flex items-center justify-center gap-2.5 sm:gap-4">
        <RolEtiqueta icono={<Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primario/60" strokeWidth={2} />} texto="Cocina" />
        <div className="w-1 h-1 rounded-full bg-borde" />
        <RolEtiqueta icono={<Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-exito/70" strokeWidth={2} />} texto="Logística" />
        <div className="w-1 h-1 rounded-full bg-borde" />
        <RolEtiqueta icono={<ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-info/70" strokeWidth={2} />} texto="Admin" />
      </div>
    </div>
  );
}

function RolEtiqueta({ icono, texto }: { icono: ReactNode; texto: string }) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-texto-terciario/80">
      {icono}
      <span>{texto}</span>
    </div>
  );
}

function CopyRight() {
  return (
    <p
      className="text-center text-[11px] sm:text-xs text-texto/85 font-medium mt-3 sm:mt-5 animate-fade-in"
      style={{ animationDelay: "0.7s", textShadow: "0 1px 3px rgba(255,255,255,0.7)" }}
    >
      © 2026 E-Kitchen. Todos los derechos reservados.
    </p>
  );
}
