"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormularioCrearMesaProps {
  onCrear: (numero: number) => Promise<void>;
}

export function FormularioCrearMesa({ onCrear }: FormularioCrearMesaProps) {
  const [numero, setNumero] = useState("");
  const [creando, setCreando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreando(true);
    try {
      await onCrear(Number(numero));
      setNumero("");
    } finally {
      setCreando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <Input
          type="number"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
          min={1}
          placeholder="Nº de mesa"
          className="h-9 w-32 text-sm"
        />
      </div>
      <Button
        type="submit"
        disabled={creando}
        className="bg-primario hover:bg-primario-hover text-primario-texto rounded-lg h-9 px-4 text-sm shadow-sm"
      >
        {creando ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            Creando...
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Agregar
          </>
        )}
      </Button>
    </form>
  );
}
