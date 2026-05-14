"use client";

import React, { useState, useMemo, useDeferredValue, useCallback, useRef } from "react";
import { Plus, Utensils, Trash2, Coffee, Sandwich, Tags, X, Search, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  crearPlato,
  actualizarPlato,
  eliminarPlato,
} from "@/lib/acciones/catalogo";
import { subirImagenPlato } from "@/lib/acciones/imagenes";
import {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "@/lib/acciones/categorias";
import { formatearPrecio } from "@/lib/formato";
import type { Plato, Categoria } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const TIPOS_PLATO: { valor: "plato_fuerte" | "bebida" | "combo"; etiqueta: string; icono: React.ReactNode }[] = [
  { valor: "plato_fuerte", etiqueta: "Plato Fuerte", icono: <Utensils className="w-3.5 h-3.5" /> },
  { valor: "bebida", etiqueta: "Bebida", icono: <Coffee className="w-3.5 h-3.5" /> },
  { valor: "combo", etiqueta: "Combo", icono: <Sandwich className="w-3.5 h-3.5" /> },
];

interface TablaPlatosProps {
  platosIniciales: Plato[];
  categorias: Categoria[];
}

export function TablaPlatos({ platosIniciales, categorias: categoriasIniciales }: TablaPlatosProps) {
  const [platos, setPlatos] = useState(platosIniciales);
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleCrear = async (datos: {
    nombre: string;
    descripcion?: string;
    precio: number;
    tipoPlato: string;
    categoriaId?: string;
    ingredientes?: string[];
    archivoImagen?: File;
  }) => {
    try {
      let imagenUrl: string | undefined;
      if (datos.archivoImagen) {
        const formData = new FormData();
        formData.append("imagen", datos.archivoImagen);
        imagenUrl = await subirImagenPlato(formData);
      }

      const nuevo = await crearPlato({
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio: datos.precio,
        tipoPlato: datos.tipoPlato,
        categoriaId: datos.categoriaId,
        ingredientes: datos.ingredientes,
        imagenUrl,
      });
      setPlatos((prev) => [nuevo as Plato, ...prev]);
      setMostrandoFormulario(false);
      setMensaje("Plato creado correctamente");
    } catch {
      setMensaje("Error al crear el plato");
    }
  };

  const handleActualizar = async (
    id: string,
    datos: { disponible: boolean }
  ) => {
    try {
      await actualizarPlato(id, datos);
      setPlatos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...datos } : p))
      );
    } catch {
      setMensaje("Error al actualizar el plato");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar este plato?")) return;
    try {
      await eliminarPlato(id);
      setPlatos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setMensaje("Error al eliminar el plato");
    }
  };

  const handleCrearCategoria = async (nombre: string, slug: string) => {
    try {
      const nueva = await crearCategoria({ nombre, slug });
      setCategorias((prev) => [...prev, nueva as Categoria]);
      setMensaje("Categoría creada correctamente");
    } catch {
      setMensaje("Error al crear la categoría");
    }
  };

  const handleEliminarCategoria = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? Los platos asociados quedarán sin categoría.")) return;
    try {
      await eliminarCategoria(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      setMensaje("Categoría eliminada correctamente");
    } catch {
      setMensaje("Error al eliminar la categoría");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {mensaje && (
        <div className="mx-4 mt-2 px-3 py-2 bg-exito/10 text-exito text-sm rounded-lg flex justify-between items-center">
          {mensaje}
          <button onClick={() => setMensaje("")} className="text-exito/60 hover:text-exito">✕</button>
        </div>
      )}

      <div className="flex items-center gap-2 p-4">
        <Dialog open={mostrandoFormulario} onOpenChange={setMostrandoFormulario}>
          <DialogTrigger className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-primario text-primario-texto text-sm font-medium hover:bg-primario-hover transition-all shadow-sm active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Plato</span>
            <span className="sm:hidden">Nuevo</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <FormularioPlato
              alGuardar={handleCrear}
              alCancelar={() => setMostrandoFormulario(false)}
              categorias={categorias}
            />
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-fondo-card text-texto text-sm font-medium hover:bg-borde transition-all border border-borde">
            <Tags className="w-4 h-4" />
            <span className="hidden sm:inline">Categorías</span>
          </SheetTrigger>
          <SheetContent className="sm:max-w-sm p-0 flex flex-col h-[calc(100dvh-2rem)]" showCloseButton={false}>
            <GestionCategorias
              categorias={categorias}
              alCrear={handleCrearCategoria}
              alEliminar={handleEliminarCategoria}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {platos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-texto-terciario">
            <div className="w-16 h-16 rounded-full bg-fondo-oscuro flex items-center justify-center mb-4">
              <Utensils className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-texto-secundario">No hay platos en el catálogo</p>
            <p className="text-xs mt-1">Agrega tu primer plato</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {platos.map((plato) => (
              <div
                key={plato.id}
                className={`bg-fondo-card rounded-xl border border-borde/60 overflow-hidden shadow-[0_1px_3px_rgba(45,42,38,0.04)] transition-all ${
                  !plato.disponible ? "opacity-50" : "hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)]"
                }`}
              >
                <div className="relative aspect-[16/10] bg-fondo-oscuro overflow-hidden">
                  {plato.imagen_url ? (
                    <img
                      src={plato.imagen_url}
                      alt={plato.nombre}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="400"
                      height="250"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-texto-terciario">
                      {TIPOS_PLATO.find((t) => t.valor === plato.tipo_plato)?.icono || <Utensils className="w-8 h-8" />}
                    </div>
                  )}
                  {!plato.disponible && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Badge variant="destructive" className="text-xs">Agotado</Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair text-sm font-semibold text-texto leading-tight truncate">
                        {plato.nombre}
                      </p>
                      {plato.descripcion && (
                        <p className="text-[11px] text-texto-terciario line-clamp-1 mt-0.5">
                          {plato.descripcion}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleEliminar(plato.id)}
                      className="text-texto-terciario hover:text-error transition-colors p-1 shrink-0 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Separator className="mb-3" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {TIPOS_PLATO.find((t) => t.valor === plato.tipo_plato)?.etiqueta}
                      </Badge>
                      <span className="font-playfair text-sm font-bold text-primario tabular-nums">
                        {formatearPrecio(plato.precio)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-texto-secundario">
                        {plato.disponible ? "Activo" : "Inactivo"}
                      </span>
                      <Switch
                        checked={plato.disponible}
                        onCheckedChange={() =>
                          handleActualizar(plato.id, { disponible: !plato.disponible })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ZonaCargaImagen({
  archivo,
  onArchivoSeleccionado,
  onEliminar,
}: {
  archivo: File | null;
  onArchivoSeleccionado: (file: File) => void;
  onEliminar: () => void;
}) {
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = archivo ? URL.createObjectURL(archivo) : null;

  const validarArchivo = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB");
      return false;
    }
    setError("");
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    const file = e.dataTransfer.files[0];
    if (file && validarArchivo(file)) onArchivoSeleccionado(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const handleDragLeave = () => {
    setArrastrando(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validarArchivo(file)) onArchivoSeleccionado(file);
  };

  if (archivo && previewUrl) {
    return (
      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-1.5">
          Imagen del plato
        </label>
        <div className="relative group rounded-lg overflow-hidden border border-borde">
          <img
            src={previewUrl}
            alt="Vista previa"
            className="w-full aspect-[16/10] object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white/90 hover:bg-white text-texto p-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onEliminar}
              className="bg-white/90 hover:bg-white text-error p-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-texto-secundario mb-1.5">
        Imagen del plato
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`w-full aspect-[16/10] rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
          arrastrando
            ? "border-primario bg-primario/5"
            : "border-borde bg-fondo-oscuro hover:border-primario/50 hover:bg-fondo-card"
        } ${error ? "border-error/50 bg-error/5" : ""}`}
      >
        <ImageIcon className={`w-8 h-8 ${arrastrando ? "text-primario" : "text-texto-terciario"}`} />
        <span className={`text-xs font-medium ${arrastrando ? "text-primario" : "text-texto-secundario"}`}>
          {arrastrando ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic para seleccionar"}
        </span>
        <span className="text-[10px] text-texto-terciario">JPG, PNG, WebP (max 5MB)</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {error && (
        <p className="text-xs text-error mt-1">{error}</p>
      )}
    </div>
  );
}

function FormularioPlato({
  alGuardar,
  alCancelar,
  categorias,
}: {
  alGuardar: (datos: {
    nombre: string;
    descripcion?: string;
    precio: number;
    tipoPlato: string;
    categoriaId?: string;
    ingredientes?: string[];
    archivoImagen?: File;
  }) => void;
  alCancelar: () => void;
  categorias: Categoria[];
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipoPlato, setTipoPlato] = useState<"plato_fuerte" | "bebida" | "combo">("plato_fuerte");
  const [categoriaId, setCategoriaId] = useState("");
  const [ingrediente, setIngrediente] = useState("");
  const [ingredientes, setIngredientes] = useState<string[]>([]);
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  const agregarIngrediente = () => {
    if (ingrediente.trim()) {
      setIngredientes([...ingredientes, ingrediente.trim()]);
      setIngrediente("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await alGuardar({
        nombre,
        descripcion: descripcion || undefined,
        precio: Number(precio),
        tipoPlato,
        categoriaId: categoriaId || undefined,
        ingredientes: ingredientes.length > 0 ? ingredientes : undefined,
        archivoImagen: archivoImagen || undefined,
      });
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

      <ZonaCargaImagen
        archivo={archivoImagen}
        onArchivoSeleccionado={setArchivoImagen}
        onEliminar={() => setArchivoImagen(null)}
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
            <Button type="button" onClick={agregarIngrediente} variant="secondary" size="sm" className="h-10 px-3">
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
                    onClick={() => setIngredientes(ingredientes.filter((_, j) => j !== i))}
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
        <Button type="button" onClick={alCancelar} variant="outline" className="flex-1" disabled={guardando}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-primario hover:bg-primario-hover text-primario-texto" disabled={guardando}>
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

const FilasSkeleton = () => (
  <>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-fondo-oscuro">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    ))}
  </>
);

const FilaCategoria = React.memo(function FilaCategoria({
  categoria,
  onEliminar,
}: {
  categoria: Categoria;
  onEliminar: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-fondo-oscuro transition-all">
      <p className="text-sm font-medium text-texto truncate mr-3">
        {categoria.nombre}
      </p>
      <button
        onClick={() => onEliminar(categoria.id)}
        className="text-texto-terciario hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10 shrink-0"
        aria-label={`Eliminar ${categoria.nombre}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
});

function GestionCategorias({
  categorias,
  alCrear,
  alEliminar,
}: {
  categorias: Categoria[];
  alCrear: (nombre: string, slug: string) => void;
  alEliminar: (id: string) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  const busquedaDiferida = useDeferredValue(busqueda);

  const generarSlug = useCallback((texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      alCrear(nombre.trim(), generarSlug(nombre.trim()));
      setNombre("");
    }
  }, [nombre, alCrear, generarSlug]);

  const puedeEnviar = nombre.trim().length > 0;

  const categoriasFiltradas = useMemo(
    () =>
      categorias.filter((cat) =>
        cat.nombre.toLowerCase().includes(busquedaDiferida.toLowerCase())
      ),
    [categorias, busquedaDiferida]
  );

  const totalPaginas = Math.ceil(categoriasFiltradas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const categoriasPaginadas = useMemo(
    () => categoriasFiltradas.slice(inicio, inicio + porPagina),
    [categoriasFiltradas, inicio, porPagina]
  );

  const handleBusqueda = useCallback((valor: string) => {
    setBusqueda(valor);
    setPagina(1);
  }, []);

  const irPaginaAnterior = useCallback(() => {
    setPagina((p) => Math.max(1, p - 1));
  }, []);

  const irPaginaSiguiente = useCallback(() => {
    setPagina((p) => Math.min(totalPaginas, p + 1));
  }, [totalPaginas]);

  const mostrarBusqueda = categorias.length > 5;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-5 py-4 border-b border-borde/60 shrink-0">
        <h3 className="text-sm font-semibold text-texto">Nueva categoría</h3>
        <p className="text-xs text-texto-secundario mt-1">
          Agrega categorías para organizar tu menú
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3 border-b border-borde/60 shrink-0">
        <div>
          <label className="block text-xs font-medium text-texto-secundario mb-2">
            Nombre
          </label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Platos Fuertes"
            className="h-10"
          />
        </div>
        <Button
          type="submit"
          disabled={!puedeEnviar}
          className="w-full h-10 bg-primario hover:bg-primario-hover text-primario-texto text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </form>

      <div className="flex-1 flex flex-col min-h-0 px-5 py-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-sm font-semibold text-texto">
            Todas las categorías
          </h3>
          <span className="text-xs text-texto-terciario bg-fondo-oscuro px-2 py-0.5 rounded-full">
            {categoriasFiltradas.length}
          </span>
        </div>

        {mostrarBusqueda && (
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto-terciario" />
            <Input
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="Buscar categoría..."
              className="h-9 pl-9 text-sm"
            />
          </div>
        )}

        {categorias.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <FilasSkeleton />
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-fondo-oscuro flex items-center justify-center mb-3">
              <Tags className="w-6 h-6 text-texto-terciario" />
            </div>
            <p className="text-sm font-medium text-texto-secundario">
              {busquedaDiferida ? "Sin resultados" : "Sin categorías"}
            </p>
            <p className="text-xs text-texto-terciario mt-1">
              {busquedaDiferida ? "Intenta con otro término" : "Crea tu primera categoría arriba"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1">
              {categoriasPaginadas.map((cat) => (
                <FilaCategoria
                  key={cat.id}
                  categoria={cat}
                  onEliminar={alEliminar}
                />
              ))}
            </div>

            {totalPaginas > 1 && (
              <Pagination className="mt-4 pt-4 border-t border-borde/40 justify-between shrink-0">
                <p className="text-xs text-texto-terciario self-center">
                  Página {pagina} de {totalPaginas}
                </p>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={irPaginaAnterior}
                      disabled={pagina === 1}
                      className="disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                    .filter((num) => {
                      if (totalPaginas <= 5) return true;
                      if (num === 1 || num === totalPaginas) return true;
                      if (Math.abs(num - pagina) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | "ellipsis")[]>((acc, num, idx, arr) => {
                      if (idx > 0 && num - (arr[idx - 1] as number) > 1) {
                        acc.push("ellipsis");
                      }
                      acc.push(num);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={item}>
                          <PaginationLink
                            onClick={() => setPagina(item)}
                            isActive={item === pagina}
                            size="sm"
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={irPaginaSiguiente}
                      disabled={pagina === totalPaginas}
                      className="disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function SkeletonTablaPlatos() {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border border-borde/60 overflow-hidden">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-px w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
