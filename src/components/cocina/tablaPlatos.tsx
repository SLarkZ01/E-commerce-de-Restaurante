"use client";

import { useState, useMemo, useDeferredValue, useEffect, useRef } from "react";
import { Plus, Tags, Utensils, Search } from "lucide-react";
import type { Plato, Categoria } from "@/types";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";
import { TarjetaPlatoCocina } from "./TarjetaPlatoCocina";
import { FormularioPlato, type DatosFormularioPlato, type ResultadoGuardado } from "./FormularioPlato";
import { GestorCategorias } from "./GestorCategorias";
import { useGestionPlatos } from "@/hooks/useGestionPlatos";
import { useGestionCategorias } from "@/hooks/useGestionCategorias";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export { SkeletonTablaPlatos } from "./SkeletonTablaPlatos";

interface TablaPlatosProps {
  platosIniciales: Plato[];
  categorias: Categoria[];
}

type TabActiva = "todos" | "disponibles" | "agotados";

function ContadorAnimado({ valor }: { valor: number }) {
  const [displayValue, setDisplayValue] = useState(valor);
  const prevValue = useRef(valor);

  useEffect(() => {
    if (prevValue.current !== valor) {
      prevValue.current = valor;
      setDisplayValue(valor);
    }
  }, [valor]);

  return (
    <span key={displayValue} className="animate-count-up inline-block">
      {displayValue}
    </span>
  );
}

export function TablaPlatos({ platosIniciales, categorias: categoriasIniciales }: TablaPlatosProps) {
  const [platos, setPlatos] = useState(platosIniciales);
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");
  const [tabActiva, setTabActiva] = useState<TabActiva>("todos");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");
  const [busqueda, setBusqueda] = useState("");

  // Debounce para búsqueda
  const busquedaDiferida = useDeferredValue(busqueda);

  const { crear, actualizar, eliminar } = useGestionPlatos();
  const { crear: crearCat, eliminar: eliminarCat } = useGestionCategorias();

  const platosDisponibles = useMemo(() => platos.filter((p) => p.disponible).length, [platos]);

  const platosFiltrados = useMemo(() => {
    let resultado = [...platos];

    if (tabActiva === "disponibles") {
      resultado = resultado.filter((p) => p.disponible);
    } else if (tabActiva === "agotados") {
      resultado = resultado.filter((p) => !p.disponible);
    }

    if (categoriaActiva !== "todas") {
      resultado = resultado.filter((p) => p.categoria_id === categoriaActiva);
    }

    if (busquedaDiferida.trim()) {
      const termino = busquedaDiferida.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.descripcion?.toLowerCase().includes(termino)
      );
    }

    return resultado;
  }, [platos, tabActiva, categoriaActiva, busquedaDiferida]);

  const handleCrear = async (datos: DatosFormularioPlato): Promise<ResultadoGuardado> => {
    const resultado = await crear(datos);
    const platoCreado = resultado.plato;

    if (!resultado.exito || !platoCreado) {
      return { exito: false, error: resultado.error };
    }

    setPlatos((prev) => [platoCreado, ...prev]);
    setMostrandoFormulario(false);
    setMensaje("Plato creado correctamente");
    setTipoMensaje("exito");
    return { exito: true };
  };

  const handleActualizar = async (id: string, datos: { disponible: boolean }) => {
    try {
      await actualizar(id, datos);
      setPlatos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...datos } : p))
      );
      setMensaje("Plato actualizado correctamente");
      setTipoMensaje("exito");
    } catch {
      setMensaje("Error al actualizar el plato");
      setTipoMensaje("error");
    }
  };

  const handleEliminarPlato = async (id: string) => {
    if (!confirm("¿Eliminar este plato?")) return;
    try {
      await eliminar(id);
      setPlatos((prev) => prev.filter((p) => p.id !== id));
      setMensaje("Plato eliminado correctamente");
      setTipoMensaje("exito");
    } catch {
      setMensaje("Error al eliminar el plato");
      setTipoMensaje("error");
    }
  };

  const handleCrearCategoria = async (nombre: string, slug: string) => {
    const resultadoCat = await crearCat(nombre, slug);
    const catCreada = resultadoCat.categoria;
    if (resultadoCat.exito && catCreada) {
      setCategorias((prev) => [...prev, catCreada]);
      setMensaje("Categoría creada correctamente");
      setTipoMensaje("exito");
    } else {
      setMensaje("Error al crear la categoría");
      setTipoMensaje("error");
    }
  };

  const handleEliminarCategoria = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? Los platos asociados quedarán sin categoría."))
      return;
    try {
      await eliminarCat(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      setMensaje("Categoría eliminada correctamente");
      setTipoMensaje("exito");
    } catch {
      setMensaje("Error al eliminar la categoría");
      setTipoMensaje("error");
    }
  };

  const tabs: { key: TabActiva; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: platos.length },
    { key: "disponibles", label: "Disponibles", count: platos.filter((p) => p.disponible).length },
    { key: "agotados", label: "Agotados", count: platos.filter((p) => !p.disponible).length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F8FC]">
      {mensaje && (
        <div className="mx-6 mt-4">
          <MensajeToast mensaje={mensaje} variante={tipoMensaje} onClose={() => setMensaje("")} />
        </div>
      )}

      <div className="px-6 pt-6 pb-0">
        {/* Header con título e ícono */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8472A] to-[#FF6B35] shadow-md shadow-[#E8472A]/20">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E] tracking-tight leading-none">
              Platos Disponibles
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="h-0.5 w-8 bg-gradient-to-r from-[#E8472A] to-[#FF6B35] rounded-full" />
              <p className="text-sm text-[#6B7280] font-medium">
                <ContadorAnimado valor={platosDisponibles} /> {platosDisponibles === 1 ? "plato" : "platos"} en tu carta
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3 mb-5">
          <Sheet>
            <SheetTrigger className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white text-[#6B7280] text-sm font-semibold hover:text-[#E8472A] hover:border-[#E8472A]/30 transition-all duration-200 border border-[#E2E8F0] shadow-sm">
              <Tags className="w-4 h-4" />
              <span>Categorías</span>
            </SheetTrigger>
            <SheetContent
              className="sm:max-w-sm p-0 flex flex-col h-[calc(100dvh-2rem)]"
              showCloseButton={false}
            >
              <GestorCategorias
                categorias={categorias}
                alCrear={handleCrearCategoria}
                alEliminar={handleEliminarCategoria}
              />
            </SheetContent>
          </Sheet>

          <Dialog open={mostrandoFormulario} onOpenChange={setMostrandoFormulario}>
            <DialogTrigger className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-gradient-to-r from-[#E8472A] to-[#FF6B35] text-white text-sm font-semibold hover:from-[#D43D22] hover:to-[#E8472A] transition-all duration-300 shadow-md shadow-[#E8472A]/25 hover:shadow-lg hover:shadow-[#E8472A]/30 active:scale-[0.97]">
              <Plus className="w-4 h-4" />
              <span>Nuevo Plato</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <FormularioPlato
                alGuardar={handleCrear}
                alCancelar={() => setMostrandoFormulario(false)}
                categorias={categorias}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8472A]" />
            <Input
              type="text"
              placeholder="Buscar en tu carta..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-11 h-11 rounded-xl bg-white border-[#E2E8F0] text-sm placeholder:text-[#9CA3AF] focus-visible:ring-[#E8472A]/25 focus-visible:border-[#E8472A]/50 shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Tabs con underline */}
        <div className="flex items-center gap-8 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTabActiva(tab.key)}
              className="relative pb-3 text-sm font-semibold transition-colors group"
            >
              <span className={tabActiva === tab.key ? "text-[#1A1A2E]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"}>
                {tab.label}
              </span>
              <span className={`ml-1.5 text-xs ${tabActiva === tab.key ? "text-[#6B7280]" : "text-[#D1D5DB]"}`}>
                {tab.count}
              </span>
              {tabActiva === tab.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#E8472A] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Categorías chips */}
        <div className="flex items-center gap-2.5 mb-6 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setCategoriaActiva("todas")}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              categoriaActiva === "todas"
                ? "bg-gradient-to-r from-[#E8472A] to-[#FF6B35] text-white shadow-md shadow-[#E8472A]/20"
                : "bg-white text-[#6B7280] hover:text-[#E8472A] hover:border-[#E8472A]/40 border border-[#E2E8F0] shadow-sm"
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Todas</span>
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                categoriaActiva === cat.id
                  ? "bg-gradient-to-r from-[#E8472A] to-[#FF6B35] text-white shadow-md shadow-[#E8472A]/20"
                  : "bg-white text-[#6B7280] hover:text-[#E8472A] hover:border-[#E8472A]/40 border border-[#E2E8F0] shadow-sm"
              }`}
            >
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de platos */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {platosFiltrados.length === 0 ? (
          <EstadoVacio
            icono={Utensils}
            titulo="No hay platos"
            descripcion="No se encontraron platos con los filtros actuales"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platosFiltrados.map((plato) => (
              <TarjetaPlatoCocina
                key={plato.id}
                plato={plato}
                onEliminar={handleEliminarPlato}
                onToggleDisponible={handleActualizar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
