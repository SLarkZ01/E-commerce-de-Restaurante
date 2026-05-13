"use client";

import { useState } from "react";
import { UtensilsCrossed, Mail, Lock, Loader2 } from "lucide-react";
import { crearCliente } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function PaginaLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
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
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-fondo via-fondo to-fondo-oscuro px-4">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primario/10 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primario/10">
            <UtensilsCrossed className="w-8 h-8 text-primario" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-texto tracking-tight">
            E-Kitchen
          </h1>
          <p className="text-sm text-texto-secundario mt-1">Panel de Staff</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-fondo-card rounded-2xl shadow-[0_8px_32px_rgba(45,42,38,0.08)] border border-borde/60 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-texto mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-borde bg-fondo text-texto placeholder-texto-terciario focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario transition-all"
                placeholder="chef@ekitchen.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-texto mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-borde bg-fondo text-texto placeholder-texto-terciario focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario transition-all"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-error bg-error/10 px-4 py-3 rounded-xl flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full h-11 bg-primario text-primario-texto rounded-xl font-semibold text-sm hover:bg-primario-hover disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-primario/20 flex items-center justify-center gap-2"
          >
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
