"use client";

import { MessageSquare } from "lucide-react";

export function AsistenteBienvenida() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primario/10 flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-primario" />
      </div>
      <h2 className="font-playfair text-xl font-bold text-texto mb-2">
        Arianna
      </h2>
      <p className="text-sm text-texto-secundario max-w-sm leading-relaxed">
        Hola, soy Arianna, tu asistente de cocina. Pregúntame lo que necesites sobre E-Kitchen: ventas, platos, personal, mesas... lo que quieras.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
        {[
          "¿Cuánto vendí hoy?",
          "¿Cuál fue el plato más popular de la semana?",
          "¿Qué mesero entregó más pedidos?",
          "Dame un resumen rápido del día",
        ].map((sugerencia) => (
          <button
            key={sugerencia}
            className="text-left text-xs text-texto-secundario bg-fondo-oscuro/30 hover:bg-primario/10 hover:text-primario rounded-lg px-3 py-2 transition-colors"
          >
            {sugerencia}
          </button>
        ))}
      </div>
    </div>
  );
}
