"use client";

import { FondoLogin } from "@/components/auth/FondoLogin";
import { TarjetaLogin } from "@/components/auth/TarjetaLogin";
import { FormularioLogin } from "@/components/auth/FormularioLogin";
import { useLogin } from "@/hooks/useLogin";

export default function PaginaLogin() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    cargando,
    mostrarPassword,
    toggleMostrarPassword,
    handleLogin,
  } = useLogin();

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden">
      <FondoLogin />

      <div className="relative z-10 flex min-h-dvh items-center justify-center lg:justify-end px-3 sm:px-6 lg:px-16 xl:px-24 py-4 sm:py-8">
        <TarjetaLogin>
          <FormularioLogin
            email={email}
            onEmailChange={setEmail}
            password={password}
            onPasswordChange={setPassword}
            mostrarPassword={mostrarPassword}
            onTogglePassword={toggleMostrarPassword}
            error={error}
            cargando={cargando}
            onSubmit={handleLogin}
          />
        </TarjetaLogin>
      </div>
    </main>
  );
}
