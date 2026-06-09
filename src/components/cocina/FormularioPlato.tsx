"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, AlertCircle, Sparkles, ImagePlus, DollarSign, Pencil } from "lucide-react";
import type { Categoria, Plato } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  id?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoPlato: string;
  categoriaId?: string;
  ingredientes?: string[];
  archivoImagen?: File;
  imagenUrlActual?: string;
}

export interface ResultadoGuardado {
  exito: boolean;
  error?: string;
}

interface FormularioPlatoProps {
  alGuardar: (datos: DatosFormularioPlato) => Promise<ResultadoGuardado>;
  alCancelar: () => void;
  categorias: Categoria[];
  platoInicial?: Plato | null;
}

export function FormularioPlato({
  alGuardar,
  alCancelar,
  categorias,
  platoInicial,
}: FormularioPlatoProps) {
  const esEdicion = !!platoInicial;

  const [nombre, setNombre] = useState(platoInicial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(platoInicial?.descripcion ?? "");
  const [precio, setPrecio] = useState(platoInicial ? String(platoInicial.precio) : "");
  const [tipoPlato, setTipoPlato] = useState<TipoPlatoValor>(
    (platoInicial?.tipo_plato as TipoPlatoValor) ?? "plato_fuerte"
  );
  const [categoriaId, setCategoriaId] = useState(platoInicial?.categoria_id ?? "");
  const [ingrediente, setIngrediente] = useState("");
  const [ingredientes, setIngredientes] = useState<string[]>(platoInicial?.ingredientes ?? []);
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [cambiandoImagen, setCambiandoImagen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNombre(platoInicial?.nombre ?? "");
    setDescripcion(platoInicial?.descripcion ?? "");
    setPrecio(platoInicial ? String(platoInicial.precio) : "");
    setTipoPlato((platoInicial?.tipo_plato as TipoPlatoValor) ?? "plato_fuerte");
    setCategoriaId(platoInicial?.categoria_id ?? "");
    setIngredientes(platoInicial?.ingredientes ?? []);
    setIngrediente("");
    setArchivoImagen(null);
    setCambiandoImagen(false);
    setErrorFormulario("");
  }, [platoInicial]);

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
        id: platoInicial?.id,
        nombre,
        descripcion: descripcion || undefined,
        precio: Number(precio),
        tipoPlato,
        categoriaId: categoriaId || undefined,
        ingredientes: ingredientes.length > 0 ? ingredientes : undefined,
        archivoImagen: archivoImagen || undefined,
        imagenUrlActual: platoInicial?.imagen_url ?? undefined,
      });

      if (!resultado.exito && resultado.error) {
        setErrorFormulario(resultado.error);
      }
    } finally {
      setGuardando(false);
    }
  };

  const esPlatoFuerte = tipoPlato === "plato_fuerte";

  const iconoHeader = esEdicion ? (
    <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
      <Pencil className="w-4 h-4 text-info" />
    </div>
  ) : (
    <div className="w-9 h-9 rounded-xl bg-primario/10 flex items-center justify-center shrink-0">
      <Sparkles className="w-4 h-4 text-primario" />
    </div>
  );

  const titulo = esEdicion
    ? `Editar ${platoInicial?.nombre ?? ""}`
    : esPlatoFuerte
      ? "Nuevo Plato"
      : tipoPlato === "bebida"
        ? "Nueva Bebida"
        : "Nuevo Combo";

  const subtitulo = esEdicion
    ? "Modifica los campos y guarda los cambios"
    : esPlatoFuerte
      ? "Agrega un plato fuerte o entrada al menú"
      : tipoPlato === "bebida"
        ? "Agrega una bebida al menú"
        : "Agrega un combo al menú";

  const tieneImagenActual = esEdicion && platoInicial?.imagen_url && !cambiandoImagen;
  const categoriaNombre = categorias.find((c) => c.id === categoriaId)?.nombre;

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader className="mb-6">
        <div className="flex items-center gap-2.5">
          {iconoHeader}
          <div>
            <DialogTitle className="font-playfair text-lg font-bold text-texto leading-tight">
              {titulo}
            </DialogTitle>
            <p className="text-[11px] text-texto-secundario mt-0.5">
              {subtitulo}
            </p>
          </div>
        </div>
      </DialogHeader>

      {errorFormulario && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2 bg-error/10 text-error border border-error/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{errorFormulario}</span>
        </div>
      )}

      <div className="space-y-5">
        <section className="bg-fondo-oscuro/50 rounded-xl p-4 border border-borde/30">
          <label className="block text-[10px] font-semibold text-texto-secundario uppercase tracking-wider mb-2.5">
            Tipo de ítem
          </label>
          <SelectorTipoPlato valor={tipoPlato} onChange={setTipoPlato} />
        </section>

        <section>
          <div className="flex items-center gap-1.5 mb-2">
            <ImagePlus className="w-3.5 h-3.5 text-texto-secundario" />
            <label className="text-[10px] font-semibold text-texto-secundario uppercase tracking-wider">
              Foto
            </label>
          </div>
          {tieneImagenActual ? (
            <div className="space-y-2">
              <div className="relative rounded-xl border border-borde/40 overflow-hidden bg-white h-40">
                <Image
                  src={platoInicial!.imagen_url!}
                  alt={platoInicial!.nombre}
                  fill
                  sizes="400px"
                  className="object-contain p-2"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setCambiandoImagen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fondo-oscuro text-xs font-medium text-texto-secundario hover:text-primario hover:bg-primario/10 border border-borde/40 transition-colors"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  Cambiar imagen
                </button>
              </div>
            </div>
          ) : (
            <ImageDropzone
              archivo={archivoImagen}
              onArchivoSeleccionado={(f) => { setArchivoImagen(f); setCambiandoImagen(true); }}
              onEliminar={() => { setArchivoImagen(null); setCambiandoImagen(false); }}
              etiqueta=""
              maxTamañoMB={TAMANO_MAXIMO_IMG}
            />
          )}
        </section>

        <section className="bg-fondo-oscuro/50 rounded-xl p-4 border border-borde/30 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-texto-secundario uppercase tracking-wider mb-1.5">
                Nombre
              </label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: Lomo Saltado"
                className="h-9 bg-fondo-card"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-texto-secundario uppercase tracking-wider mb-1.5">
                Categoría
              </label>
              <Select value={categoriaId} onValueChange={(v) => setCategoriaId(v ?? "")}>
                <SelectTrigger className="h-10 bg-fondo-card text-sm [&>span]:line-clamp-1">
                  <SelectValue>
                    {categoriaNombre || "Sin categoría"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin categoría</SelectItem>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-texto-secundario uppercase tracking-wider mb-1.5">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              placeholder="Breve descripción del plato..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-borde bg-fondo-card text-texto placeholder:text-texto-terciario/70 focus:outline-none focus:ring-2 focus:ring-primario/30 focus:border-primario focus-visible:ring-2 focus-visible:ring-primario/30 focus-visible:border-primario transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-texto-secundario uppercase tracking-wider mb-1.5">
              Precio
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
              <Input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                min={0}
                placeholder="0"
                className="h-10 pl-10 bg-fondo-card"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-texto-terciario uppercase">
                COP
              </span>
            </div>
          </div>
        </section>

        {esPlatoFuerte && (
          <section className="bg-fondo-oscuro/50 rounded-xl p-4 border border-borde/30">
            <IngredientesInput
              ingrediente={ingrediente}
              onChangeIngrediente={setIngrediente}
              onAgregar={agregarIngrediente}
              ingredientes={ingredientes}
              onEliminar={(i) => setIngredientes((prev) => prev.filter((_, j) => j !== i))}
            />
          </section>
        )}
      </div>

      <div className="flex gap-2.5 mt-6 pt-5 border-t border-borde/30">
        <Button
          type="button"
          onClick={alCancelar}
          variant="outline"
          className="flex-1 h-10 text-sm font-medium"
          disabled={guardando}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 h-10 bg-primario hover:bg-primario-hover text-primario-texto text-sm font-semibold shadow-sm"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : esEdicion ? (
            "Guardar Cambios"
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  );
}
