import { ShoppingBag } from "lucide-react";
import { EstadoVacio } from "@/components/compartidos/EstadoVacio";

export function CarritoEstadoVacio() {
  return (
    <EstadoVacio
      icono={ShoppingBag}
      titulo="El carrito está vacío"
      descripcion="Agrega platos del menú"
    />
  );
}
