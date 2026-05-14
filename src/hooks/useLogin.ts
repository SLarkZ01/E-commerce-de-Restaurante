"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { crearCliente } from "@/lib/supabase/browser";

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
