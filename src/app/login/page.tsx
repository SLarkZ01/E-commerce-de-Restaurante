"use client";

import { useState } from "react";
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
    <div className="min-h-dvh flex items-center justify-center bg-[#FEFAF6] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🍽️</span>
          <h1 className="font-[Playfair_Display] text-2xl font-bold text-[#2D2A26] mt-3">
            E-Kitchen
          </h1>
          <p className="text-sm text-[#78716C] mt-1">Panel de Staff</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(45,42,38,0.10)] p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-[#2D2A26] mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-3 text-sm rounded-lg border border-[#E7E0D8] bg-white text-[#2D2A26] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30 focus:border-[#C44536]"
              placeholder="chef@ekitchen.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2A26] mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-3 text-sm rounded-lg border border-[#E7E0D8] bg-white text-[#2D2A26] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30 focus:border-[#C44536]"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full h-11 bg-[#C44536] text-white rounded-xl font-medium text-sm hover:bg-[#A8382C] disabled:opacity-50 transition-colors active:scale-[0.98]"
          >
            {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
