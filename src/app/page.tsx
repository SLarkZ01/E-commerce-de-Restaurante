import { obtenerPlatosDisponibles } from "@/lib/acciones/platos";
import { CatalogoPlatos } from "@/components/cliente/catalogoPlatos";
import { BarraSuperior } from "@/components/cliente/barraSuperior";
import { CarritoSheet } from "@/components/cliente/carritoSheet";

export default async function PaginaInicio() {
  const { platos, categorias } = await obtenerPlatosDisponibles();

  return (
    <div className="flex flex-col min-h-dvh bg-[#FEFAF6]">
      <BarraSuperior />
      <CatalogoPlatos
        platos={platos}
        categorias={categorias}
        mesaUuid={null}
      />
      <CarritoSheet mesaUuid={null} />
    </div>
  );
}
