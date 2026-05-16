"use client";

import { useState } from "react";
import { Plus, Tags } from "lucide-react";
import dynamic from "next/dynamic";
import type { Plato, Categoria } from "@/types";
import { MensajeToast } from "@/components/compartidos/MensajeToast";
import { useFiltrosPlatos } from "@/hooks/useFiltrosPlatos";
import { useAccionesPlatos } from "@/hooks/useAccionesPlatos";
import { useGestionPlatos } from "@/hooks/useGestionPlatos";
import { useGestionCategorias } from "@/hooks/useGestionCategorias";
import { CabeceraPlatos } from "./CabeceraPlatos";
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

const FormularioPlato = dynamic(() => import("./FormularioPlato").then((m) => ({ default: m.FormularioPlato })), { ssr: false });
const GestorCategorias = dynamic(() => import("./GestorCategorias").then((m) => ({ default: m.GestorCategorias })), { ssr: false });

export { SkeletonTablaPlatos } from "./SkeletonTablaPlatos";

interface TablaPlatosProps {
  platosIniciales: Plato[];
  categorias: Categoria[];
}

export function TablaPlatos({ platosIniciales, categorias: categoriasIniciales }: TablaPlatosProps) {
  const [platos, setPlatos] = useState(platosIniciales);
  const [categorias, setCategorias] = useState(categoriasIniciales);

  const { crear, actualizar, eliminar } = useGestionPlatos();
  const { crear: crearCat, eliminar: eliminarCat } = useGestionCategorias();

  const {
    busqueda,
    setBusqueda,
    tabActiva,
    setTabActiva,
    categoriaActiva,
    setCategoriaActiva,
    platosFiltrados,
    platosDisponibles,
  } = useFiltrosPlatos(platos);

  const {
    mensaje,
    tipoMensaje,
    setMensaje,
    mostrandoFormulario,
    setMostrandoFormulario,
    handleCrear,
    handleActualizar,
    handleEliminarPlato,
    handleCrearCategoria,
    handleEliminarCategoria,
  } = useAccionesPlatos(
    platos,
    setPlatos,
    categorias,
    setCategorias,
    crear,
    actualizar,
    eliminar,
    crearCat,
    eliminarCat
  );

  const tabs = [
    { key: "todos" as const, label: "Todos", count: platos.length },
    { key: "disponibles" as const, label: "Disponibles", count: platos.filter((p) => p.disponible).length },
    { key: "agotados" as const, label: "Agotados", count: platos.filter((p) => !p.disponible).length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F8FC]">
      {mensaje && (
        <div className="mx-6 mt-4">
          <MensajeToast mensaje={mensaje} variante={tipoMensaje} onClose={() => setMensaje("")} />
        </div>
      )}

      <div className="px-6 pt-6 pb-0 space-y-5">
        <CabeceraPlatos platosDisponibles={platosDisponibles} />

        <div className="flex items-center gap-3">
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

        <BarraBusqueda busqueda={busqueda} onCambio={setBusqueda} />

        <TabsPlatos tabs={tabs} activa={tabActiva} onCambio={setTabActiva} />

        <PillsCategorias categorias={categorias} activa={categoriaActiva} onCambio={setCategoriaActiva} />
      </div>

      <GridPlatos
        platos={platosFiltrados}
        onEliminar={handleEliminarPlato}
        onToggleDisponible={handleActualizar}
      />
    </div>
  );
}
