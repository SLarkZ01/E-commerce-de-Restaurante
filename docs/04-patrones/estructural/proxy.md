# 04 — Proxy

## Concepto

El patrón Proxy proporciona un sustituto o placeholder de otro objeto para controlar el acceso a él. Actúa como intermediario que añade lógica de control (autenticación, autorización, logging, caché) antes de permitir el acceso al objeto real.

---

## Aplicación en E-Kitchen

El archivo `src/proxy.ts` actúa como **Proxy de protección** a nivel HTTP. Intercepta todas las peticiones entrantes y decide si permitir el acceso a las rutas protegidas del staff (`/cocina`, `/logistica`, `/admin`).

### Implementación

**Archivo:** `src/proxy.ts`

```typescript
export async function proxy(request: NextRequest) {
  // 1. Verificar sesión del usuario
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Si está autenticado y está en la landing page, redirigir a su panel
  if (user && pathname === "/") {
    return NextResponse.redirect(RUTA_POR_ROL.cocinero);
  }

  // 3. Si NO está autenticado y la ruta es protegida, bloquear acceso
  const rutasProtegidas = ["/cocina", "/logistica", "/admin"];
  if (!user && esProtegida) {
    return NextResponse.redirect("/");
  }

  // 4. Si está autenticado pero su rol no tiene acceso a esa ruta, redirigir
  if (user && esProtegida) {
    const rolUsuario = await obtenerRol(user);
    const rutasPermitidas = RUTAS_POR_ROL[rolUsuario];
    if (!tieneAcceso) {
      return NextResponse.redirect(RUTA_POR_ROL[rolUsuario]);
    }
  }

  // 5. Acceso permitido → continuar
  return respuestaSupabase;
}
```

### Reglas de acceso por rol

**Archivo:** `src/lib/redirecciones.ts`

```typescript
export const RUTAS_POR_ROL: Record<Rol, string[]> = {
  admin:    ["/cocina", "/logistica", "/admin"],  // acceso total
  cocinero: ["/cocina"],                           // solo cocina
  mesero:   ["/logistica"],                         // solo logística
};

export const RUTA_POR_ROL: Record<Rol, string> = {
  admin: "/admin",
  cocinero: "/cocina",
  mesero: "/logistica",
};
```

### Flujo de decisión del Proxy

```
Request ──▶ ¿Usuario autenticado?
              │            │
              NO           SÍ
              │            │
              ▼            ▼
         ¿Ruta protegida?  ¿Está en "/"?
           │         │       │         │
           SÍ        NO      SÍ        NO
           │         │       │         │
           ▼         ▼       ▼         ▼
        Redirigir  Pasar  Redirigir  ¿Tiene acceso
        a "/"      (OK)   a panel   a esta ruta?
                                    │         │
                                    SÍ        NO
                                    │         │
                                    ▼         ▼
                                  Pasar    Redirigir a
                                  (OK)     panel del rol
```

---

## Referencia completa en el código

| Componente | Archivo | Rol |
|---|---|---|
| **Proxy** | `src/proxy.ts:6-73` | Interceptor HTTP principal |
| **Reglas de acceso** | `src/lib/redirecciones.ts:3-13` | `RUTA_POR_ROL`, `RUTAS_POR_ROL` |
| **Tipos de rol** | `src/types/index.ts:4` | `Rol` |

---

## Beneficio clave

Centraliza TODA la lógica de control de acceso en un solo archivo. Si se agrega un nuevo rol (ej: "gerente") o una nueva ruta protegida, solo se modifica `redirecciones.ts`. Los layouts y páginas individuales no necesitan verificar autenticación — el Proxy ya lo hizo.
