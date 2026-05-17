import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { RUTA_POR_ROL, RUTAS_POR_ROL } from "@/lib/redirecciones";
import type { Rol } from "@/types";

export async function proxy(request: NextRequest) {
  let respuestaSupabase = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesAEstablecer) {
          cookiesAEstablecer.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          respuestaSupabase = NextResponse.next({ request });
          cookiesAEstablecer.forEach(({ name, value, options }) =>
            respuestaSupabase.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (user && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = RUTA_POR_ROL.cocinero;
    return NextResponse.redirect(url);
  }

  const rutasProtegidas = ["/cocina", "/logistica", "/admin"];
  const esProtegida = rutasProtegidas.some((r) => pathname.startsWith(r));

  if (!user && esProtegida) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user && esProtegida) {
    let rolUsuario = user.user_metadata?.rol as Rol | undefined;

    if (!rolUsuario) {
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", user.id)
        .single();
      rolUsuario = (perfil as { rol: Rol } | null)?.rol ?? "cocinero";
    }

    const rutasPermitidas = RUTAS_POR_ROL[rolUsuario] ?? RUTAS_POR_ROL.cocinero;
    const tieneAcceso = rutasPermitidas.some((r) => pathname.startsWith(r));

    if (!tieneAcceso) {
      const url = request.nextUrl.clone();
      url.pathname = RUTA_POR_ROL[rolUsuario];
      return NextResponse.redirect(url);
    }
  }

  return respuestaSupabase;
}
