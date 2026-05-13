"use server";

import { db } from "@/lib/db";
import { platos, categorias } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { Plato, Categoria } from "@/types";

export async function obtenerPlatosDisponibles(): Promise<{
  platos: Plato[];
  categorias: Categoria[];
}> {
  const [platosData, categoriasData] = await Promise.all([
    db.select().from(platos).where(eq(platos.disponible, true)),
    db.select().from(categorias),
  ]);

  return {
    platos: platosData as Plato[],
    categorias: categoriasData as Categoria[],
  };
}

export async function obtenerPlatoPorId(id: string): Promise<Plato | null> {
  const result = await db
    .select()
    .from(platos)
    .where(and(eq(platos.id, id), eq(platos.disponible, true)))
    .limit(1);

  return (result[0] as Plato) ?? null;
}
