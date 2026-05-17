"use client";

import { useState } from "react";
import { Loader2, User, Mail, Users, ChefHat, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLES = [
  { valor: "cocinero", etiqueta: "Cocinero", icono: <ChefHat className="w-4 h-4" />, color: "bg-advertencia/10 text-advertencia" },
  { valor: "mesero", etiqueta: "Mesero", icono: <User className="w-4 h-4" />, color: "bg-info/10 text-info" },
  { valor: "admin", etiqueta: "Admin", icono: <Users className="w-4 h-4" />, color: "bg-primario/10 text-primario" },
];

export interface DatosPersonal {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

interface FormularioPersonalProps {
  alGuardar: (datos: DatosPersonal) => Promise<void>;
  alCancelar: () => void;
}

export function FormularioPersonal({ alGuardar, alCancelar }: FormularioPersonalProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cocinero");
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return;
    setGuardando(true);
    try {
      await alGuardar({ nombre, email, password, rol });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-2">
          Nombre completo
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Juan Pérez"
            className="h-10 pl-10"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-2">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="juan@ekitchen.com"
            className="h-10 pl-10"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-2">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="h-10 pl-10"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-2">
          Rol
        </label>
        <div className="flex gap-2">
          {ROLES.map((r) => (
            <button
              key={r.valor}
              type="button"
              onClick={() => setRol(r.valor)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                rol === r.valor
                  ? "bg-primario text-primario-texto shadow-sm"
                  : "bg-fondo-oscuro text-texto-secundario hover:bg-borde"
              }`}
            >
              {r.icono}
              {r.etiqueta}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-3">
        <Button type="button" onClick={alCancelar} variant="outline" className="flex-1 h-10">
          Cancelar
        </Button>
        <Button type="submit" disabled={guardando} className="flex-1 bg-primario hover:bg-primario-hover text-primario-texto h-10">
          {guardando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  );
}
