export function obtenerIniciales(texto: string): string {
  return texto
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
