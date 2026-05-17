"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import type { Categoria } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/compartidos/ImageDropzone";
import { SelectorTipoPlato } from "./SelectorTipoPlato";
import { IngredientesInput } from "./IngredientesInput";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TipoPlatoValor = "plato_fuerte" | "bebida" | "combo";

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
      setIngredientes((prev) => [...prev, ingrediente.trim()]);
      setIngrediente("");
    }
  };

  const validarImagen = (): string | null => {
    if (!archivoImagen) return null;
    if (archivoImagen.size > TAMANO_MAXIMO_IMG * 1024 * 1024) {
      return `La imagen supera los ${TAMANO_MAXIMO_IMG}MB. Elige una más pequeña.`;
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

  const titulo = tipoPlato === "plato_fuerte" ? "Nuevo Plato" : tipoPlato === "bebida" ? "Nueva Bebida" : "Nuevo Combo";
  const tituloGuardar = tipoPlato === "plato_fuerte" ? "Guardar Plato" : tipoPlato === "bebida" ? "Guardar Bebida" : "Guardar Combo";

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primario/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primario" />
          </div>
          <DialogTitle className="font-playfair text-lg font-bold text-texto">
            {titulo}
          </DialogTitle>
        </div>
        <p className="text-xs text-texto-secundario ml-10">
          Completa los datos del {tipoPlato === "plato_fuerte" ? "plato" : tipoPlato === "bebida" ? "bebida" : "combo"} para agregarlo al menú
        </p>
      </DialogHeader>

      {errorFormulario && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2 bg-error/10 text-error border border-error/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{errorFormulario}</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-texto-secundario mb-2">
            Tipo
          </label>
          <SelectorTipoPlato valor={tipoPlato} onChange={setTipoPlato} />
        </div>

        <ImageDropzone
          archivo={archivoImagen}
          onArchivoSeleccionado={setArchivoImagen}
          onEliminar={() => setArchivoImagen(null)}
          etiqueta={`Imagen (máx. ${TAMANO_MAXIMO_IMG}MB)`}
          maxTamañoMB={TAMANO_MAXIMO_IMG}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-texto-secundario mb-1.5">
              Nombre
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
        </div>

        <div>
          <label className="block text-xs font-medium text-texto-secundario mb-1.5">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Breve descripción"
            className="w-full px-3 py-2 text-sm rounded-lg border border-borde bg-fondo-card text-texto placeholder:text-texto-terciario focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-texto-secundario mb-1.5">
            Precio (COP)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-texto-secundario">
              $
            </span>
            <Input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              min={0}
              placeholder="0"
              className="h-10 pl-8"
            />
          </div>
        </div>

        {tipoPlato === "plato_fuerte" && (
          <IngredientesInput
            ingrediente={ingrediente}
            onChangeIngrediente={setIngrediente}
            onAgregar={agregarIngrediente}
            ingredientes={ingredientes}
            onEliminar={(i) => setIngredientes((prev) => prev.filter((_, j) => j !== i))}
          />
        )}
      </div>

      <div className="flex gap-3 mt-6 pt-4 border-t border-borde/40">
        <Button
          type="button"
          onClick={alCancelar}
          variant="outline"
          className="flex-1 h-10"
          disabled={guardando}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 h-10 bg-primario hover:bg-primario-hover text-primario-texto shadow-sm"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            tituloGuardar
          )}
        </Button>
      </div>
    </form>
  );
}
