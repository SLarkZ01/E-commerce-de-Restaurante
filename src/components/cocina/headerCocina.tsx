"use client";

import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderCocinaProps {
  titulo: string;
  userEmail: string;
}

export function HeaderCocina({ titulo, userEmail }: HeaderCocinaProps) {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const horaFormateada = hora.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const getIniciales = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 bg-fondo/95 backdrop-blur-sm border-b border-borde/60">
      <h1 className="font-playfair text-lg font-bold text-texto tracking-tight">
        {titulo}
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-fondo-oscuro rounded-lg">
          <span className="text-xs font-mono font-medium text-texto-secundario tabular-nums">
            {horaFormateada}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 cursor-default">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primario/10 text-primario text-xs font-bold">
                  {getIniciales(userEmail)}
                </AvatarFallback>
              </Avatar>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">{userEmail}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
