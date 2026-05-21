"use client";

import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormularioLoginProps {
  email: string;
  onEmailChange: (valor: string) => void;
  password: string;
  onPasswordChange: (valor: string) => void;
  mostrarPassword: boolean;
  onTogglePassword: () => void;
  error: string;
  cargando: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormularioLogin({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  mostrarPassword,
  onTogglePassword,
  error,
  cargando,
  onSubmit,
}: FormularioLoginProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3.5 sm:space-y-4">
      {/* Email */}
      <div
        className="space-y-1 sm:space-y-1.5 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
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
            onChange={(e) => onEmailChange(e.target.value)}
            required
            placeholder="chef@ekitchen.com"
            className="h-11 sm:h-[52px] pl-9 sm:pl-10 pr-4 text-sm rounded-xl sm:rounded-2xl border-borde bg-fondo/60 hover:bg-fondo/80 focus:bg-white transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primario/20 focus-visible:border-primario/60 shadow-sm"
          />
        </div>
      </div>

      {/* Contraseña */}
      <div
        className="space-y-1 sm:space-y-1.5 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
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
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            placeholder="Ingresa tu contraseña"
            className="h-11 sm:h-[52px] pl-9 sm:pl-10 pr-11 sm:pr-12 text-sm rounded-xl sm:rounded-2xl border-borde bg-fondo/60 hover:bg-fondo/80 focus:bg-white transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primario/20 focus-visible:border-primario/60 shadow-sm"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-terciario hover:text-texto transition-colors duration-200 p-1 rounded-full hover:bg-fondo-oscuro/50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={
              mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {mostrarPassword ? (
              <EyeOff
                className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                strokeWidth={1.5}
              />
            ) : (
              <Eye
                className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                strokeWidth={1.5}
              />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="animate-fade-up flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-error bg-error/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-error/20">
          <ShieldCheck
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Botón Submit */}
      <div
        className="pt-0.5 sm:pt-1 animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
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
              <ArrowRight
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                strokeWidth={2.5}
              />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
