"use server";

import { MediaFacade } from "@/lib/servicios/mediaFacade";

export async function subirImagenPlato(formData: FormData): Promise<string> {
  const archivo = formData.get("imagen") as File;

  if (!archivo || archivo.size === 0) {
    throw new Error("No se seleccionó ningún archivo");
  }

  if (archivo.size > 5 * 1024 * 1024) {
    throw new Error("La imagen no puede superar los 5MB");
  }

  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!tiposPermitidos.includes(archivo.type)) {
    throw new Error("Solo se permiten imágenes JPG, PNG, WebP o GIF");
  }

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const resultado = await MediaFacade.subirImagen(buffer, {
    folder: "e-kitchen/platos",
  });

  return resultado.secureUrl;
}
