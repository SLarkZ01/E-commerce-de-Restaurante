/**
 * Tests de integración: Observer Pattern (useRealtime)
 *
 * Mockea el cliente Supabase para verificar la suscripción.
 */

import { renderHook } from "@testing-library/react";
import { useEffect } from "react";
import { useRealtime } from "@/hooks/useRealtime";

// Mock del módulo completo de Supabase
const mockSubscribe = vi.fn((cb: (s: string) => void) => {
  if (cb) cb("SUBSCRIBED");
});
const mockOn = vi.fn().mockReturnValue({ subscribe: mockSubscribe });
const mockChannelFn = vi.fn().mockReturnValue({ on: mockOn });
const mockRemoveChannel = vi.fn().mockResolvedValue(undefined);
const mockAuthGetSession = vi.fn().mockResolvedValue({ data: { session: null } });

vi.mock("@/lib/supabase/browser", () => ({
  crearCliente: () => ({
    channel: mockChannelFn,
    removeChannel: mockRemoveChannel,
    auth: { getSession: mockAuthGetSession },
  }),
}));

describe("Observer — useRealtime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOn.mockReturnValue({ subscribe: mockSubscribe });
    mockChannelFn.mockReturnValue({ on: mockOn });
  });

  it("se suscribe correctamente al montar", () => {
    const { unmount } = renderHook(() =>
      useRealtime("pedidos", "INSERT", vi.fn())
    );

    // Verificar que se creó el canal
    expect(mockChannelFn).toHaveBeenCalledWith(
      expect.stringContaining("realtime-pedidos-INSERT")
    );

    // Verificar que se configuró el handler
    expect(mockOn).toHaveBeenCalledWith(
      "postgres_changes",
      expect.objectContaining({
        event: "INSERT",
        table: "pedidos",
      }),
      expect.any(Function)
    );

    // Verificar que se suscribió
    expect(mockSubscribe).toHaveBeenCalled();

    unmount();
    expect(mockRemoveChannel).toHaveBeenCalled();
  });

  it("soporta filtro en la suscripción", () => {
    renderHook(() =>
      useRealtime("pedidos", "UPDATE", vi.fn(), "estado=eq.listo")
    );

    expect(mockOn).toHaveBeenCalledWith(
      "postgres_changes",
      expect.objectContaining({
        event: "UPDATE",
        table: "pedidos",
        filter: "estado=eq.listo",
      }),
      expect.any(Function)
    );
  });

  it("llama al callback cuando llega un evento", () => {
    let capturedCb: ((p: unknown) => void) | null = null;

    mockOn.mockImplementation((_evt, _cfg, cb: (p: unknown) => void) => {
      capturedCb = cb;
      return { subscribe: mockSubscribe };
    });

    const callback = vi.fn();

    renderHook(() => useRealtime("pedidos", "INSERT", callback));

    // Simular evento
    capturedCb!({
      eventType: "INSERT",
      new: { id: "ped-1", estado: "pendiente" },
      old: {},
    });

    expect(callback).toHaveBeenCalled();
  });
});
