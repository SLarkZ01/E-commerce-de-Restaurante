"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RastrearInputProps {
  inputId: string;
  setInputId: (id: string) => void;
  onBuscar: () => void;
}

export function RastrearInput({ inputId, setInputId, onBuscar }: RastrearInputProps) {
  const manejarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onBuscar();
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-texto-secundario">
        Ingresa el ID de tu pedido (Lo encuentras en el recibo enviado a tu correo cuando hagas tu compra).
      </p>
      <Input
        placeholder="Ej: 66DF8CA2"
        value={inputId}
        onChange={(e) => setInputId(e.target.value.toUpperCase())}
        onKeyDown={manejarKeyDown}
        className="text-center font-mono text-lg tracking-widest uppercase"
        maxLength={36}
      />
      <Button onClick={onBuscar} disabled={!inputId.trim()} className="w-full">
        <Search className="w-4 h-4" />
        Rastrear
      </Button>
    </div>
  );
}
