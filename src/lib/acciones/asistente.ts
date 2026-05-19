"use server";

import { crearCliente } from "@/lib/supabase/server";

export async function obtenerAdminActual(): Promise<string | null> {
  const supabase = await crearCliente();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Obtiene el historial de conversaciones del admin actual desde n8n.
 * n8n consulta su PostgreSQL y devuelve las conversaciones.
 */
export async function obtenerHistorial(): Promise<{
  conversaciones: Array<{
    id: string;
    titulo: string;
    mensajes: Array<{
      id: string;
      rol: "usuario" | "asistente";
      texto: string;
      creado_en: string;
    }>;
    creado_en: string;
  }>;
  error?: string;
}> {
  const adminId = await obtenerAdminActual();
  if (!adminId) {
    return { conversaciones: [], error: "No autenticado" };
  }

  const webhookUrl = process.env.N8N_ASISTENTE_HISTORIAL_URL;
  if (!webhookUrl) {
    return { conversaciones: [] };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId, action: "historial" }),
    });

    if (!res.ok) {
      return { conversaciones: [], error: `n8n: ${res.status}` };
    }

    const data = await res.json();
    return { conversaciones: data.conversaciones ?? [] };
  } catch (err) {
    return {
      conversaciones: [],
      error: err instanceof Error ? err.message : "Error al obtener historial",
    };
  }
}

/**
 * Elimina una conversación en n8n.
 */
export async function eliminarConversacionRemota(
  conversationId: string
): Promise<{ exito: boolean; error?: string }> {
  const adminId = await obtenerAdminActual();
  if (!adminId) return { exito: false, error: "No autenticado" };

  const webhookUrl = process.env.N8N_ASISTENTE_HISTORIAL_URL;
  if (!webhookUrl) return { exito: true };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId, action: "eliminar", conversationId }),
    });

    if (!res.ok) {
      return { exito: false, error: `n8n: ${res.status}` };
    }

    return { exito: true };
  } catch (err) {
    return {
      exito: false,
      error: err instanceof Error ? err.message : "Error al eliminar",
    };
  }
}
