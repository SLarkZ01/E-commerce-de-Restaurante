import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const N8N_WEBHOOK_URL =
  process.env.N8N_ASISTENTE_WEBHOOK_URL ?? "";
const N8N_WEBHOOK_SECRET =
  process.env.N8N_ASISTENTE_SECRET ?? "";

async function getAdminInfo(req: NextRequest): Promise<{ nombre: string; email: string; rol: string } | null> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => req.cookies.getAll(), setAll: () => {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: perfil } = await supabase.from("perfiles").select("nombre, email, rol").eq("id", user.id).single();
    if (!perfil) return null;
    return { nombre: perfil.nombre as string, email: perfil.email as string, rol: perfil.rol as string };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!N8N_WEBHOOK_URL) {
    return new Response(
      JSON.stringify({ error: "n8n no configurado" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { mensaje: string; conversationId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Cuerpo inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!body.mensaje?.trim()) {
    return new Response(
      JSON.stringify({ error: "Mensaje vacío" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const adminInfo = await getAdminInfo(req);

  // Incluir info del admin en el mensaje para que Arianna sepa quién habla
  const mensajeConAdmin = adminInfo
    ? `[Usuario: ${adminInfo.nombre}, ${adminInfo.email}, rol: ${adminInfo.rol}]\n\n${body.mensaje}`
    : body.mensaje;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(N8N_WEBHOOK_SECRET
          ? { "X-N8N-Secret": N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        mensaje: mensajeConAdmin,
        conversationId: body.conversationId ?? "",
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!n8nResponse.ok) {
      return new Response(
        JSON.stringify({
          error: `n8n respondió con ${n8nResponse.status}`,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const contentType = n8nResponse.headers.get("content-type") ?? "";

    // Leer primer chunk para detectar errores de rate limit de Groq
    const reader = n8nResponse.body?.getReader();
    if (!reader) {
      return new Response(
        JSON.stringify({ error: "Sin respuesta de n8n" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const firstChunk = await reader.read();
    const firstText = firstChunk.value
      ? new TextDecoder().decode(firstChunk.value, { stream: true })
      : "";
    const isRateLimit = firstText.includes("Rate limit") || firstText.includes("rate_limit");

    if (isRateLimit) {
      reader.cancel();
      return new Response(
        JSON.stringify({
          error: "Arianna está saturada. La IA alcanzó su límite de tokens diario. Espera unos minutos y vuelve a intentarlo."
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream: juntar primer chunk con el resto del body
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(firstChunk.value);
        const pump = () => {
          reader.read().then(({ done, value }) => {
            if (done) { controller.close(); return; }
            controller.enqueue(value);
            pump();
          });
        };
        pump();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": contentType.includes("text/event-stream")
          ? "text/event-stream"
          : contentType || "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      return new Response(
        JSON.stringify({ error: "Timeout esperando respuesta de n8n" }),
        { status: 504, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Error de conexión con n8n",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
