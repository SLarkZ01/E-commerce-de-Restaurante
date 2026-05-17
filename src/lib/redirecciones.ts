import type { Rol } from "@/types";

export const RUTA_POR_ROL: Record<Rol, string> = {
  admin: "/admin",
  cocinero: "/cocina",
  mesero: "/logistica",
};

export const RUTAS_POR_ROL: Record<Rol, string[]> = {
  admin: ["/cocina", "/logistica", "/admin"],
  cocinero: ["/cocina"],
  mesero: ["/logistica"],
};
