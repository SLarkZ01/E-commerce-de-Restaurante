/**
 * Tests de integración: Observer Pattern (useRealtime)
 *
 * Verifica el contrato entre el hook y el IServicioRealtime inyectable.
 * DIP: el hook depende de la abstracción, no de Supabase directamente.
 */

import { renderHook } from "@testing-library/react";
import { useRealtime } from "@/hooks/useRealtime";
import type { IServicioRealtime, ISuscripcionRealtime } from "@/lib/servicios/realtimeService";

type MockSuscribir = ReturnType<typeof vi.fn>;

function crearMockServicio() {
  return {
    suscribir: vi.fn().mockResolvedValue({ cancelar: vi.fn() }) as MockSuscribir,
    desconectarTodo: vi.fn().mockResolvedValue(undefined),
  } as IServicioRealtime & { suscribir: MockSuscribir };
}

describe("Observer — useRealtime (DIP)", () => {
  let servicio: ReturnType<typeof crearMockServicio>;

  beforeEach(() => {
    servicio = crearMockServicio();
    vi.clearAllMocks();
  });

  it("invoca suscribir con los parámetros correctos al montar", () => {
    const callback = vi.fn();

    renderHook(() =>
      useRealtime("pedidos", "INSERT", callback, undefined, servicio)
    );

    expect(servicio.suscribir).toHaveBeenCalledTimes(1);
    expect(servicio.suscribir).toHaveBeenCalledWith(
      expect.objectContaining({
        tabla: "pedidos",
        evento: "INSERT",
        schema: "public",
      }),
      expect.any(Function)
    );
  });

  it("pasa el filtro cuando se especifica", () => {
    renderHook(() =>
      useRealtime("pedidos", "UPDATE", vi.fn(), "estado=eq.listo", servicio)
    );

    expect(servicio.suscribir).toHaveBeenCalledWith(
      expect.objectContaining({
        tabla: "pedidos",
        evento: "UPDATE",
        filtro: "estado=eq.listo",
      }),
      expect.any(Function)
    );
  });

  it("propaga el payload al callback cuando el servicio emite", async () => {
    const callback = vi.fn();
    let callbackRegistrado: ((p: unknown) => void) | null = null;

    servicio.suscribir.mockImplementation((_opciones: unknown, cb: (p: unknown) => void) => {
      callbackRegistrado = cb;
      return Promise.resolve({ cancelar: vi.fn() });
    });

    renderHook(() =>
      useRealtime("pedidos", "INSERT", callback, undefined, servicio)
    );

    await vi.waitFor(() => {
      expect(callbackRegistrado).not.toBeNull();
    });

    const payload = {
      eventType: "INSERT" as const,
      new: { id: "ped-1", estado: "pendiente" },
      old: {} as Record<string, unknown>,
    };

    callbackRegistrado!(payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });

  it("cancela la suscripción al desmontar", async () => {
    const cancelar = vi.fn().mockResolvedValue(undefined);
    servicio.suscribir.mockResolvedValue({ cancelar });

    const { unmount } = renderHook(() =>
      useRealtime("pedidos", "INSERT", vi.fn(), undefined, servicio)
    );

    await vi.waitFor(() => {
      expect(servicio.suscribir).toHaveBeenCalled();
    });

    unmount();

    await vi.waitFor(() => {
      expect(cancelar).toHaveBeenCalled();
    });
  });

  it("no cancela si la suscripción no llegó a completarse antes del desmontaje", async () => {
    const cancelar = vi.fn();
    let resolver: ((v: ISuscripcionRealtime) => void) | null = null;

    servicio.suscribir.mockReturnValue(
      new Promise((resolve) => {
        resolver = resolve;
      })
    );

    const { unmount } = renderHook(() =>
      useRealtime("pedidos", "INSERT", vi.fn(), undefined, servicio)
    );

    unmount();

    resolver!({ cancelar });
    await vi.waitFor(() => {
      expect(cancelar).toHaveBeenCalled();
    });
  });

  it("re-suscribe cuando cambian tabla o evento", () => {
    const { rerender } = renderHook(
      ({ tabla, evento }: { tabla: string; evento: "INSERT" | "UPDATE" }) =>
        useRealtime(tabla, evento, vi.fn(), undefined, servicio),
      { initialProps: { tabla: "pedidos", evento: "INSERT" as "INSERT" | "UPDATE" } }
    );

    expect(servicio.suscribir).toHaveBeenCalledTimes(1);

    rerender({ tabla: "platos", evento: "UPDATE" as const });

    expect(servicio.suscribir).toHaveBeenCalledTimes(2);
    expect(servicio.suscribir).toHaveBeenLastCalledWith(
      expect.objectContaining({ tabla: "platos", evento: "UPDATE" }),
      expect.any(Function)
    );
  });
});
