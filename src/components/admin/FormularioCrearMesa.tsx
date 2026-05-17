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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
      <Input
        type="number"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        required
        min={1}
        placeholder="Número de mesa"
        className="w-full sm:w-48 h-10"
      />
      <Button
        type="submit"
        disabled={creando}
        className="bg-primario hover:bg-primario-hover text-primario-texto rounded-xl h-10 px-5"
      >
        {creando ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creando...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Mesa
          </>
        )}
      </Button>
    </form>
  );
}
