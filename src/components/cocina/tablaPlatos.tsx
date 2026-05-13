"use client";

import { useState } from "react";
import { Plus, Utensils, Trash2, Coffee, Sandwich } from "lucide-react";
import {
  crearPlato,
  actualizarPlato,
  eliminarPlato,
} from "@/lib/acciones/catalogo";
import { formatearPrecio } from "@/lib/formato";
import type { Plato, Categoria } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const TIPOS_PLATO: { valor: "plato_fuerte" | "bebida" | "combo"; etiqueta: string; icono: React.ReactNode }[] = [
  { valor: "plato_fuerte", etiqueta: "Plato Fuerte", icono: <Utensils className="w-3.5 h-3.5" /> },
  { valor: "bebida", etiqueta: "Bebida", icono: <Coffee className="w-3.5 h-3.5" /> },
  { valor: "combo", etiqueta: "Combo", icono: <Sandwich className="w-3.5 h-3.5" /> },
];

interface TablaPlatosProps {
  platosIniciales: Plato[];
  categorias: Categoria[];
}

export function TablaPlatos({ platosIniciales, categorias }: TablaPlatosProps) {
  const [platos, setPlatos] = useState(platosIniciales);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleCrear = async (datos: {
    nombre: string;
    descripcion?: string;
    precio: number;
    tipoPlato: string;
    categoriaId?: string;
    ingredientes?: string[];
  }) => {
    try {
      const nuevo = await crearPlato(datos);
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {mensaje && (
        <div className="mx-4 mt-2 px-3 py-2 bg-exito/10 text-exito text-sm rounded-lg flex justify-between items-center">
          {mensaje}
          <button onClick={() => setMensaje("")} className="text-exito/60 hover:text-exito">✕</button>
        </div>
      )}

      <div className="p-4">
        <Dialog open={mostrandoFormulario} onOpenChange={setMostrandoFormulario}>
          <DialogTrigger className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-primario text-primario-texto text-sm font-medium hover:bg-primario-hover transition-all shadow-sm active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            Nuevo Plato
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <FormularioPlato
              alGuardar={handleCrear}
              alCancelar={() => setMostrandoFormulario(false)}
              categorias={categorias}
            />
          </DialogContent>
        </Dialog>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {platos.map((plato) => (
              <div
                key={plato.id}
                className={`bg-fondo-card rounded-xl border border-borde/60 p-4 shadow-[0_1px_3px_rgba(45,42,38,0.04)] transition-all ${
                  !plato.disponible ? "opacity-50" : "hover:shadow-[0_4px_12px_rgba(45,42,38,0.08)]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-fondo-oscuro flex items-center justify-center text-texto-terciario shrink-0">
                      {TIPOS_PLATO.find((t) => t.valor === plato.tipo_plato)?.icono || <Utensils className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-playfair text-sm font-semibold text-texto leading-tight">
                        {plato.nombre}
                      </p>
                      {plato.descripcion && (
                        <p className="text-[11px] text-texto-terciario line-clamp-1 mt-0.5">
                          {plato.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminar(plato.id)}
                    className="text-texto-terciario hover:text-error transition-colors p-1"
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
            ))}
          </div>
        )}
      </div>
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

  const agregarIngrediente = () => {
    if (ingrediente.trim()) {
      setIngredientes([...ingredientes, ingrediente.trim()]);
      setIngrediente("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alGuardar({
      nombre,
      descripcion: descripcion || undefined,
      precio: Number(precio),
      tipoPlato,
      categoriaId: categoriaId || undefined,
      ingredientes: ingredientes.length > 0 ? ingredientes : undefined,
    });
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
        <Button type="button" onClick={alCancelar} variant="outline" className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-primario hover:bg-primario-hover text-primario-texto">
          Guardar Plato
        </Button>
      </div>
    </form>
  );
}

export function SkeletonTablaPlatos() {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-fondo-card rounded-xl border border-borde/60 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-32 h-3" />
              </div>
            </div>
            <Skeleton className="w-full h-px" />
            <div className="flex justify-between">
              <Skeleton className="w-20 h-5" />
              <Skeleton className="w-16 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
