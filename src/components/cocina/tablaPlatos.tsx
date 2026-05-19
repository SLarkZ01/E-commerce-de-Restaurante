"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Tags } from "lucide-react";
import dynamic from "next/dynamic";
import type { Plato, Categoria } from "@/types";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { useFiltrosPlatos } from "@/hooks/useFiltrosPlatos";
import { useAccionesPlatos } from "@/hooks/useAccionesPlatos";
import { useGestionPlatos } from "@/hooks/useGestionPlatos";
import { useGestionCategorias } from "@/hooks/useGestionCategorias";
import { BarraBusqueda } from "./BarraBusqueda";
import { TabsPlatos } from "./TabsPlatos";
import { PillsCategorias } from "./PillsCategorias";
import { GridPlatos } from "./GridPlatos";
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

const FormularioPlato = dynamic(
  () =>
    import("./FormularioPlato").then((m) => ({ default: m.FormularioPlato })),
  { ssr: false }
);
const GestorCategorias = dynamic(
  () =>
    import("./GestorCategorias").then((m) => ({ default: m.GestorCategorias })),
  { ssr: false }
);

export { SkeletonTablaPlatos } from "./SkeletonTablaPlatos";

interface TablaPlatosProps {
  platosIniciales: Plato[];
  categorias: Categoria[];
}

export function TablaPlatos({
  platosIniciales,
  categorias: categoriasIniciales,
}: TablaPlatosProps) {
  const [platos, setPlatos] = useState(platosIniciales);
  const [categorias, setCategorias] = useState(categoriasIniciales);

  // Sincronizar cuando el Server Component revalida los datos
  useEffect(() => {
    setPlatos(platosIniciales);
  }, [platosIniciales]);

  useEffect(() => {
    setCategorias(categoriasIniciales);
  }, [categoriasIniciales]);

  const { crear, actualizar, toggleDisponible, eliminar } = useGestionPlatos();
  const { crear: crearCat, eliminar: eliminarCat } = useGestionCategorias();

  const {
    busqueda,
    setBusqueda,
    tabActiva,
    setTabActiva,
    categoriaActiva,
    setCategoriaActiva,
    platosFiltrados,
  } = useFiltrosPlatos(platos);

  const {
    mensaje,
    tipoMensaje,
    setMensaje,
    mostrandoFormulario,
    setMostrandoFormulario,
    platoEditando,
    handleCrear,
    handleGuardarEdicion,
    handleToggleDisponible,
    handleEliminarPlato,
    handleEditar,
    handleCancelarFormulario,
    handleCrearCategoria,
    handleEliminarCategoria,
  } = useAccionesPlatos(
    setPlatos,
    setCategorias,
    crear,
    actualizar,
    toggleDisponible,
    eliminar,
    crearCat,
    eliminarCat
  );

  const tabs = useMemo(
    () => [
      { key: "todos" as const, label: "Todos", count: platos.length },
      {
        key: "disponibles" as const,
        label: "Disponibles",
        count: platos.filter((p) => p.disponible).length,
      },
      {
        key: "agotados" as const,
        label: "Agotados",
        count: platos.filter((p) => !p.disponible).length,
      },
    ],
    [platos]
  );

  const alCerrarDialog = () => {
    handleCancelarFormulario();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-fondo">
      {mensaje && (
        <MensajeToast
          mensaje={mensaje}
          variante={tipoMensaje}
          onClose={() => setMensaje("")}
        />
      )}

      <div className="px-6 pt-6 pb-0 space-y-4">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-fondo-card text-texto-secundario text-sm font-semibold hover:text-primario hover:border-primario/30 transition-all duration-200 border border-borde shadow-sm">
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

          <Dialog open={mostrandoFormulario} onOpenChange={(abierto) => {
            if (!abierto) alCerrarDialog();
            else setMostrandoFormulario(true);
          }}>
            <DialogTrigger
              onClick={() => {
                /* platoEditando ya es null por defecto — modo crear */
              }}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primario text-primario-texto text-sm font-semibold hover:bg-primario-hover transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.97]"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Plato</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <FormularioPlato
                alGuardar={
                  platoEditando ? handleGuardarEdicion : handleCrear
                }
                alCancelar={alCerrarDialog}
                categorias={categorias}
                platoInicial={platoEditando}
              />
            </DialogContent>
          </Dialog>
        </div>

        <BarraBusqueda busqueda={busqueda} onCambio={setBusqueda} />

        <TabsPlatos tabs={tabs} activa={tabActiva} onCambio={setTabActiva} />

        <PillsCategorias
          categorias={categorias}
          activa={categoriaActiva}
          onCambio={setCategoriaActiva}
        />
      </div>

      <GridPlatos
        platos={platosFiltrados}
        onEliminar={handleEliminarPlato}
        onToggleDisponible={handleToggleDisponible}
        onEditar={handleEditar}
      />
    </div>
  );
}
