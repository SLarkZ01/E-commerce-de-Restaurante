"use client";

import { useState } from "react";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Flame,
  Leaf,
} from "lucide-react";
import { crearCliente } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PaginaLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const supabase = crearCliente();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError("Correo o contraseña incorrectos");
      setCargando(false);
      return;
    }

    router.push("/cocina");
    router.refresh();
  };

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden">
      {/* ============================================ */}
      {/* CAPAS DE FONDO — SIEMPRE FIJAS               */}
      {/* ============================================ */}
      <div className="fixed inset-0 -z-10">
        {/* Imagen de fondo: en móvil muestra la esquina con frutas */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-left-top sm:bg-center"
          style={{ backgroundImage: "url('/images/background/fondo2.webp')" }}
        />
        {/* Overlay más transparente para que se note el fondo */}
        <div className="absolute inset-0 bg-white/55 sm:bg-white/60 lg:bg-white/65" />
        <div className="absolute inset-0 bg-gradient-to-br from-primario/5 via-transparent to-acento/10" />
      </div>

      {/* ============================================ */}
      {/* ORBS DECORATIVOS FLOTANTES                   */}
      {/* ============================================ */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-primario/12 blur-[80px] sm:blur-[100px] animate-float" />
        <div className="absolute -bottom-[10%] -right-[10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-acento/12 blur-[90px] sm:blur-[120px] animate-float-delayed" />
        <div className="absolute top-[30%] right-[15%] w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-exito/8 blur-[60px] sm:blur-[80px] animate-float-slow hidden sm:block" />
      </div>

      {/* ============================================ */}
      {/* CONTENIDO CENTRADO PERFECTAMENTE             */}
      {/* ============================================ */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center lg:justify-end px-3 sm:px-6 lg:px-16 xl:px-24 py-4 sm:py-8">
        <div className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[420px] animate-scale-in">
          {/* ---------------------------------------- */}
          {/* CARD DE LOGIN — GLASSMORPHISM PREMIUM    */}
          {/* ---------------------------------------- */}
          <div className="relative group">
            {/* Glow sutil detrás de la card */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-primario/30 via-acento/20 to-primario/30 rounded-2xl sm:rounded-[2rem] blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            <div className="relative rounded-2xl sm:rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(45,42,38,0.08),0_2px_8px_rgba(196,69,54,0.06)] overflow-hidden">
              {/* Barra decorativa superior */}
              <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-primario via-acento to-primario" />

              <div className="px-5 pt-5 pb-6 sm:px-8 sm:pt-9 sm:pb-9">
                {/* HEADER */}
                <div className="flex flex-col items-center text-center mb-5 sm:mb-7 animate-fade-up">
                  {/* Logo animado */}
                  <div className="relative mb-3 sm:mb-5">
                    <div className="absolute inset-0 rounded-2xl bg-primario/20 blur-lg scale-110 animate-pulse-glow" />
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-[72px] lg:h-[72px] rounded-xl sm:rounded-2xl bg-gradient-to-br from-primario to-primario-hover flex items-center justify-center shadow-lg shadow-primario/25 rotate-3 hover:rotate-0 transition-transform duration-500">
                      <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  <h1 className="font-playfair text-xl sm:text-2xl lg:text-[2rem] font-bold text-texto leading-tight tracking-tight">
                    Bienvenido a{" "}
                    <span className="text-primario">E-Kitchen</span>
                  </h1>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-texto-secundario max-w-[240px] sm:max-w-[280px] leading-relaxed">
                    Accede al panel de gestión gastronómica. Solo personal autorizado.
                  </p>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
                  {/* Email */}
                  <div className="space-y-1 sm:space-y-1.5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-semibold text-texto ml-1"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative group/input">
                      <Mail
                        className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-texto-terciario transition-colors duration-300 group-focus-within/input:text-primario"
                        strokeWidth={1.5}
                      />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="chef@ekitchen.com"
                        className="h-11 sm:h-[52px] pl-9 sm:pl-10 pr-4 text-sm rounded-xl sm:rounded-2xl border-borde bg-fondo/60 hover:bg-fondo/80 focus:bg-white transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primario/20 focus-visible:border-primario/60 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-1 sm:space-y-1.5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                    <label
                      htmlFor="password"
                      className="block text-xs sm:text-sm font-semibold text-texto ml-1"
                    >
                      Contraseña
                    </label>
                    <div className="relative group/input">
                      <Lock
                        className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-texto-terciario transition-colors duration-300 group-focus-within/input:text-primario"
                        strokeWidth={1.5}
                      />
                      <Input
                        id="password"
                        type={mostrarPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="h-11 sm:h-[52px] pl-9 sm:pl-10 pr-11 sm:pr-12 text-sm rounded-xl sm:rounded-2xl border-borde bg-fondo/60 hover:bg-fondo/80 focus:bg-white transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primario/20 focus-visible:border-primario/60 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-terciario hover:text-texto transition-colors duration-200 p-1 rounded-full hover:bg-fondo-oscuro/50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label={
                          mostrarPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {mostrarPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="animate-fade-up flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-error bg-error/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-error/20">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" strokeWidth={2} />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Botón Submit */}
                  <div className="pt-0.5 sm:pt-1 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                    <Button
                      type="submit"
                      disabled={cargando}
                      className="relative w-full h-11 sm:h-[52px] bg-gradient-to-r from-primario to-primario-hover hover:from-primario-hover hover:to-primario text-white rounded-xl sm:rounded-2xl font-semibold text-sm shadow-lg shadow-primario/20 hover:shadow-xl hover:shadow-primario/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden group/btn"
                    >
                      {/* Efecto shimmer en hover */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

                      {cargando ? (
                        <span className="relative flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Iniciando sesión…
                        </span>
                      ) : (
                        <span className="relative flex items-center justify-center gap-2">
                          Iniciar Sesión
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" strokeWidth={2.5} />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>

                {/* DIVISOR */}
                <div className="relative my-4 sm:my-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-borde/70" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-texto-terciario">
                      Staff Only
                    </span>
                  </div>
                </div>

                {/* FOOTER INFO */}
                <div className="space-y-1.5 sm:space-y-2 animate-fade-up" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-texto-terciario">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primario/70" strokeWidth={2} />
                    <span>Conexión segura con Supabase Auth</span>
                  </div>

                  <div className="flex items-center justify-center gap-2.5 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-texto-terciario/80">
                      <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primario/60" strokeWidth={2} />
                      <span>Cocina</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-borde" />
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-texto-terciario/80">
                      <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-exito/70" strokeWidth={2} />
                      <span>Logística</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-borde" />
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-texto-terciario/80">
                      <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-info/70" strokeWidth={2} />
                      <span>Admin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright fuera de la card */}
          <p className="text-center text-[10px] sm:text-[11px] text-texto-terciario/60 mt-3 sm:mt-5 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            © 2024 E-Kitchen. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}
