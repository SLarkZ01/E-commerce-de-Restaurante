"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { crearCliente } from "@/lib/supabase/browser";
import { RUTA_POR_ROL } from "@/lib/redirecciones";
import type { Rol } from "@/types";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const router = useRouter();

  const toggleMostrarPassword = useCallback(() => {
    setMostrarPassword((prev) => !prev);
  }, []);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setCargando(true);

      const supabase = crearCliente();
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (err || !data.user) {
        setError("Correo o contraseña incorrectos");
        setCargando(false);
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", data.user.id)
        .single();

      const rolUsuario = (perfil as { rol: Rol } | null)?.rol ?? "cocinero";
      const destino = RUTA_POR_ROL[rolUsuario];

      router.push(destino);
      router.refresh();
    },
    [email, password, router],
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    cargando,
    mostrarPassword,
    toggleMostrarPassword,
    handleLogin,
  };
}
