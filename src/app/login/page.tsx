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

  const tarjeta = (
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
  );

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden">
      {/* Mobile: fondo completo con tarjeta centrada */}
      <div className="md:hidden">
        <FondoLogin />
        <div className="relative z-10 flex min-h-dvh items-center justify-center px-3 sm:px-6 py-4 sm:py-8">
          {tarjeta}
        </div>
      </div>

      {/* Tablet & Desktop: fondo continuo sin línea divisoria */}
      <div className="hidden md:flex min-h-dvh w-full gap-0 relative overflow-hidden">
        {/* 1. Imagen de fondo continua para ambas columnas */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-left-top"
          style={{ backgroundImage: "url('/images/background/fondo2.webp')" }}
        />

        {/* 2. Overlay blanco uniforme en TODA la pantalla */}
        <div className="absolute inset-0 bg-white/40" />

        {/* 3. Acento decorativo uniforme en TODA la pantalla */}
        <div className="absolute inset-0 bg-gradient-to-br from-primario/10 via-transparent to-acento/15" />

        {/* 4. Brillo extra para zona derecha — arranca transparente (sin línea) */}
        <div className="absolute inset-y-0 right-0 md:w-[55%] lg:w-[52%] bg-gradient-to-r from-transparent via-white/10 to-white/30 pointer-events-none" />

        {/* 5. Columna izquierda: solo ocupa espacio */}
        <div className="md:w-[45%] lg:w-[48%]" />

        {/* 6. Columna derecha: la tarjeta */}
        <div className="md:w-[55%] lg:w-[52%] relative flex items-center justify-start pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-8 lg:pr-10">
          <div className="relative z-10">
            {tarjeta}
          </div>
        </div>
      </div>
    </main>
  );
}
