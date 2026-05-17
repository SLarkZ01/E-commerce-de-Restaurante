"use client";

import React, { useState } from "react";
import { Plus, Loader2, Utensils, Coffee, Sandwich, AlertCircle } from "lucide-react";
import type { Categoria } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/compartidos/ImageDropzone";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TipoPlatoValor = "plato_fuerte" | "bebida" | "combo";

const TIPOS_PLATO: {
  valor: TipoPlatoValor;
  etiqueta: string;
  icono: React.ReactNode;
}[] = [
  { valor: "plato_fuerte", etiqueta: "Plato Fuerte", icono: <Utensils className="w-3.5 h-3.5" /> },
  { valor: "bebida", etiqueta: "Bebida", icono: <Coffee className="w-3.5 h-3.5" /> },
  { valor: "combo", etiqueta: "Combo", icono: <Sandwich className="w-3.5 h-3.5" /> },
];

const TAMANO_MAXIMO_IMG = 5;

export interface DatosFormularioPlato {
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoPlato: string;
  categoriaId?: string;
  ingredientes?: string[];
  archivoImagen?: File;
}

export interface ResultadoGuardado {
  exito: boolean;
  error?: string;
}

interface FormularioPlatoProps {
  alGuardar: (datos: DatosFormularioPlato) => Promise<ResultadoGuardado>;
  alCancelar: () => void;
  categorias: Categoria[];
}

export function FormularioPlato({
  alGuardar,
  alCancelar,
  categorias,
}: FormularioPlatoProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipoPlato, setTipoPlato] = useState<TipoPlatoValor>("plato_fuerte");
  const [categoriaId, setCategoriaId] = useState("");
  const [ingrediente, setIngrediente] = useState("");
  const [ingredientes, setIngredientes] = useState<string[]>([]);
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  const agregarIngrediente = () => {
    if (ingrediente.trim()) {
      setIngredientes([...ingredientes, ingrediente.trim()]);
      setIngrediente("");
    }
  };

  const validarImagen = (): string | null => {
    if (!archivoImagen) return null;
    if (archivoImagen.size > TAMANO_MAXIMO_IMG * 1024 * 1024) {
      return `La imagen supera los ${TAMANO_MAXIMO_IMG}MB. Por favor elige una imagen más pequeña.`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFormulario("");

    const errorImg = validarImagen();
    if (errorImg) {
      setErrorFormulario(errorImg);
      return;
    }

    setGuardando(true);
    try {
      const resultado = await alGuardar({
        nombre,
        descripcion: descripcion || undefined,
        precio: Number(precio),
        tipoPlato,
        categoriaId: categoriaId || undefined,
        ingredientes: ingredientes.length > 0 ? ingredientes : undefined,
        archivoImagen: archivoImagen || undefined,
      });

      if (!resultado.exito && resultado.error) {
        setErrorFormulario(resultado.error);
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="font-playfair text-lg font-bold text-texto">
          Nuevo Plato
        </DialogTitle>
      </DialogHeader>

      {errorFormulario && (
        <div className="px-4 py-3 rounded-xl text-sm flex items-center gap-2 bg-error/10 text-error">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{errorFormulario}</span>
        </div>
      )}

      <div className="flex gap-2">
        {TIPOS_PLATO.map((t) => (
          <button
            key={t.valor}
            type="button"
            onClick={() => setTipoPlato(t.valor)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              tipoPlato === t.valor
                ? "bg-primario text-primario-texto shadow-sm"
                : "bg-fondo-oscuro text-texto-secundario hover:bg-borde"
            }`}
          >
            {t.icono}
            {t.etiqueta}
          </button>
        ))}
      </div>

      <ImageDropzone
        archivo={archivoImagen}
        onArchivoSeleccionado={setArchivoImagen}
        onEliminar={() => setArchivoImagen(null)}
        etiqueta={`Imagen del plato (máx. ${TAMANO_MAXIMO_IMG}MB)`}
        maxTamañoMB={TAMANO_MAXIMO_IMG}
      />

      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-1.5">
          Nombre del plato
        </label>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Ej: Lomo Saltado"
          className="h-10"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-1.5">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={2}
          placeholder="Breve descripción del plato"
          className="w-full px-3 py-2 text-sm rounded-lg border border-borde bg-fondo-card text-texto placeholder-texto-terciario focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-1.5">
          Categoría
        </label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="w-full h-10 px-3 text-sm rounded-lg border border-borde bg-fondo-card text-texto focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario"
        >
          <option value="">Sin categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-1.5">
          Precio (COP)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-texto-terciario">
            $
          </span>
          <Input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            min={0}
            placeholder="0"
            className="h-10 pl-7"
          />
        </div>
      </div>

      {tipoPlato === "plato_fuerte" && (
        <div>
          <label className="block text-xs font-medium text-texto-secundario mb-1.5">
            Ingredientes
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={ingrediente}
              onChange={(e) => setIngrediente(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarIngrediente();
                }
              }}
              placeholder="Ej: Tomate"
              className="h-10"
            />
            <Button
              type="button"
              onClick={agregarIngrediente}
              variant="secondary"
              size="sm"
              className="h-10 px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {ingredientes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ingredientes.map((ing, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-fondo-oscuro text-texto rounded-full text-xs"
                >
                  {ing}
                  <button
                    type="button"
                    onClick={() =>
                      setIngredientes(ingredientes.filter((_, j) => j !== i))
                    }
                    className="text-texto-terciario hover:text-error"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          onClick={alCancelar}
          variant="outline"
          className="flex-1"
          disabled={guardando}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primario hover:bg-primario-hover text-primario-texto"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Plato"
          )}
        </Button>
      </div>
    </form>
  );
}
