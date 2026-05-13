"use client";

import { useState } from "react";
import {
  crearPlato,
  actualizarPlato,
  eliminarPlato,
} from "@/lib/acciones/catalogo";
import { formatearPrecio } from "@/lib/formato";
import type { Plato, Categoria } from "@/types";

const TIPOS_PLATO: { valor: "plato_fuerte" | "bebida" | "combo"; etiqueta: string }[] = [
  { valor: "plato_fuerte", etiqueta: "Plato Fuerte" },
  { valor: "bebida", etiqueta: "Bebida" },
  { valor: "combo", etiqueta: "Combo" },
];

interface TablaPlatosProps {
  platosIniciales: Plato[];
  categorias: Categoria[];
}

export function TablaPlatos({ platosIniciales, categorias }: TablaPlatosProps) {
  const [platos, setPlatos] = useState(platosIniciales);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [editando, setEditando] = useState<Plato | null>(null);
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
    } catch (e) {
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
    } catch (e) {
      setMensaje("Error al actualizar el plato");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar este plato?")) return;
    try {
      await eliminarPlato(id);
      setPlatos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setMensaje("Error al eliminar el plato");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {mensaje && (
        <div className="mx-4 mt-2 px-3 py-2 bg-green-50 text-green-700 text-sm rounded-lg">
          {mensaje}
          <button
            onClick={() => setMensaje("")}
            className="ml-2 text-green-400"
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-4">
        <button
          onClick={() => {
            setEditando(null);
            setMostrandoFormulario(true);
          }}
          className="px-4 py-2 bg-[#C44536] text-white rounded-lg text-sm font-medium hover:bg-[#A8382C] transition-colors"
        >
          + Nuevo Plato
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="bg-white rounded-xl border border-[#E7E0D8] overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F0EB] text-[#78716C] text-xs font-medium">
              <tr>
                <th className="px-3 py-2 text-left">Plato</th>
                <th className="px-3 py-2 text-left hidden md:table-cell">
                  Tipo
                </th>
                <th className="px-3 py-2 text-right">Precio</th>
                <th className="px-3 py-2 text-center">Estado</th>
                <th className="px-3 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platos.map((plato) => (
                <tr
                  key={plato.id}
                  className={`border-t border-[#E7E0D8] ${
                    !plato.disponible ? "opacity-40" : ""
                  }`}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-[#F5F0EB] flex items-center justify-center text-xs shrink-0">
                        🍽️
                      </div>
                      <div>
                        <p className="font-medium text-[#2D2A26] text-xs">
                          {plato.nombre}
                        </p>
                        {plato.descripcion && (
                          <p className="text-[10px] text-[#A8A29E] line-clamp-1">
                            {plato.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F0EB] text-[#78716C]">
                      {
                        TIPOS_PLATO.find((t) => t.valor === plato.tipo_plato)
                          ?.etiqueta
                      }
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-[#2D2A26] text-xs">
                    {formatearPrecio(plato.precio)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() =>
                        handleActualizar(plato.id, {
                          disponible: !plato.disponible,
                        })
                      }
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${
                        plato.disponible
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {plato.disponible ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleEliminar(plato.id)}
                      className="text-xs text-[#A8A29E] hover:text-[#DC2626] transition-colors px-1"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {platos.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-[#A8A29E] text-sm"
                  >
                    No hay platos en el catálogo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mostrandoFormulario && (
        <FormularioPlato
          alGuardar={handleCrear}
          alCancelar={() => setMostrandoFormulario(false)}
          categorias={categorias}
        />
      )}
    </div>
  );
}

function FormularioPlato({
  alGuardar,
  alCancelar,
  categorias,
  datosIniciales,
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
  datosIniciales?: Plato;
}) {
  const [nombre, setNombre] = useState(datosIniciales?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(
    datosIniciales?.descripcion ?? ""
  );
  const [precio, setPrecio] = useState(
    datosIniciales ? Number(datosIniciales.precio).toString() : ""
  );
  const [tipoPlato, setTipoPlato] = useState<"plato_fuerte" | "bebida" | "combo">(
    (datosIniciales?.tipo_plato as "plato_fuerte" | "bebida" | "combo") ?? "plato_fuerte"
  );
  const [categoriaId, setCategoriaId] = useState(
    datosIniciales?.categoria_id ?? ""
  );
  const [ingrediente, setIngrediente] = useState("");
  const [ingredientes, setIngredientes] = useState<string[]>(
    datosIniciales?.ingredientes ?? []
  );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={alCancelar}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-[Playfair_Display] text-lg font-semibold text-[#2D2A26]">
              {datosIniciales ? "Editar Plato" : "Nuevo Plato"}
            </h3>
            <button
              type="button"
              onClick={alCancelar}
              className="text-[#A8A29E] hover:text-[#2D2A26]"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            {TIPOS_PLATO.map((t) => (
              <button
                key={t.valor}
                type="button"
                onClick={() => setTipoPlato(t.valor)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  tipoPlato === t.valor
                    ? "bg-[#C44536] text-white"
                    : "bg-[#F5F0EB] text-[#78716C] hover:bg-[#E7E0D8]"
                }`}
              >
                {t.etiqueta}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2A26] mb-1">
              Nombre del plato
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E7E0D8] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30 focus:border-[#C44536]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2A26] mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#E7E0D8] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30 focus:border-[#C44536] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2A26] mb-1">
              Categoría
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E7E0D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#C44536]/30 focus:border-[#C44536]"
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
            <label className="block text-xs font-medium text-[#2D2A26] mb-1">
              Precio (COP)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#78716C]">
                $
              </span>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                min={0}
                className="w-full h-10 pl-7 pr-3 text-sm rounded-lg border border-[#E7E0D8] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30 focus:border-[#C44536]"
              />
            </div>
          </div>

          {tipoPlato === "plato_fuerte" && (
            <div>
              <label className="block text-xs font-medium text-[#2D2A26] mb-1">
                Ingredientes
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  value={ingrediente}
                  onChange={(e) => setIngrediente(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      agregarIngrediente();
                    }
                  }}
                  placeholder="Ej: Tomate"
                  className="flex-1 h-10 px-3 text-sm rounded-lg border border-[#E7E0D8] focus:outline-none focus:ring-2 focus:ring-[#C44536]/30 focus:border-[#C44536]"
                />
                <button
                  type="button"
                  onClick={agregarIngrediente}
                  className="px-3 h-10 bg-[#F5F0EB] text-[#2D2A26] rounded-lg text-sm hover:bg-[#E7E0D8] transition-colors"
                >
                  +
                </button>
              </div>
              {ingredientes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {ingredientes.map((ing, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5F0EB] text-[#2D2A26] rounded-full text-xs"
                    >
                      {ing}
                      <button
                        type="button"
                        onClick={() =>
                          setIngredientes(ingredientes.filter((_, j) => j !== i))
                        }
                        className="text-[#A8A29E] hover:text-[#DC2626] text-[10px]"
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
            <button
              type="button"
              onClick={alCancelar}
              className="flex-1 py-2.5 border border-[#E7E0D8] text-[#78716C] rounded-xl text-sm font-medium hover:bg-[#F5F0EB] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#C44536] text-white rounded-xl text-sm font-medium hover:bg-[#A8382C] transition-colors active:scale-[0.98]"
            >
              Guardar Plato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
