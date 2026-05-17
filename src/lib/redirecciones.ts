import type { Rol } from "@/types";

export const RUTA_POR_ROL: Record<Rol, string> = {
  admin: "/admin",
  cocinero: "/cocina",
  mesero: "/logistica",
};
