/**
 * Tests unitarios: SupabaseRealtimeService
 *
 * Verifica que el servicio concreto maneja correctamente
 * la creación de canales, suscripción y cancelación.
 */

import { SupabaseRealtimeService } from "@/lib/servicios/realtimeService";

// Mock del módulo de Supabase browser
const mockSubscribe = vi.fn();
const mockOn = vi.fn().mockReturnValue({ subscribe: mockSubscribe });
const mockChannelFn = vi.fn().mockReturnValue({ on: mockOn });
const mockRemoveChannel = vi.fn().mockResolvedValue(undefined);
const mockGetSession = vi.fn().mockResolvedValue({ data: { session: null } });
const mockSetAuth = vi.fn();

vi.mock("@/lib/supabase/browser", () => ({
  crearCliente: () => ({
    channel: mockChannelFn,
    removeChannel: mockRemoveChannel,
    auth: {
      getSession: mockGetSession,
    },
    realtime: {
      setAuth: mockSetAuth,
    },
  }),
}));

describe("SupabaseRealtimeService", () => {
  let servicio: SupabaseRealtimeService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOn.mockReturnValue({ subscribe: mockSubscribe });
    mockChannelFn.mockReturnValue({ on: mockOn });
    servicio = new SupabaseRealtimeService();
  });

  it("crea un canal y se suscribe al llamar a suscribir", async () => {
    const callback = vi.fn();
    const suscripcion = await servicio.suscribir(
      { tabla: "pedidos", evento: "INSERT", schema: "public" },
      callback
    );

    expect(mockChannelFn).toHaveBeenCalledWith(
      expect.stringContaining("rt-pedidos-INSERT")
    );

    expect(mockOn).toHaveBeenCalledWith(
      "postgres_changes",
      expect.objectContaining({
        event: "INSERT",
        table: "pedidos",
        schema: "public",
      }),
      expect.any(Function)
    );

    expect(mockSubscribe).toHaveBeenCalled();
    expect(suscripcion).toBeDefined();
    expect(suscripcion.cancelar).toBeTypeOf("function");
  });

  it("incluye el filtro en la configuración del canal", async () => {
    await servicio.suscribir(
      { tabla: "pedidos", evento: "UPDATE", filtro: "estado=eq.listo", schema: "public" },
      vi.fn()
    );

    expect(mockOn).toHaveBeenCalledWith(
      "postgres_changes",
      expect.objectContaining({
        filter: "estado=eq.listo",
      }),
      expect.any(Function)
    );
  });

  it("llama a setAuth cuando hay sesión", async () => {
    mockGetSession.mockResolvedValueOnce({
      data: { session: { access_token: "token-falso" } },
    });

    await servicio.suscribir(
      { tabla: "pedidos", evento: "INSERT", schema: "public" },
      vi.fn()
    );

    expect(mockSetAuth).toHaveBeenCalledWith("token-falso");
  });

  it("no llama a setAuth cuando no hay sesión", async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });

    await servicio.suscribir(
      { tabla: "pedidos", evento: "INSERT", schema: "public" },
      vi.fn()
    );

    expect(mockSetAuth).not.toHaveBeenCalled();
  });

  it("cancelar elimina el canal de Supabase", async () => {
    const suscripcion = await servicio.suscribir(
      { tabla: "pedidos", evento: "INSERT", schema: "public" },
      vi.fn()
    );

    await suscripcion.cancelar();

    expect(mockRemoveChannel).toHaveBeenCalled();
  });

  it("desconectarTodo limpia todas las suscripciones", async () => {
    await servicio.suscribir(
      { tabla: "pedidos", evento: "INSERT", schema: "public" },
      vi.fn()
    );
    await servicio.suscribir(
      { tabla: "platos", evento: "UPDATE", schema: "public" },
      vi.fn()
    );

    await servicio.desconectarTodo();

    expect(mockRemoveChannel).toHaveBeenCalledTimes(2);
  });

  it("invoca el callback cuando el canal emite un evento", async () => {
    let callbackRegistrado: ((p: unknown) => void) | null = null;

    mockOn.mockImplementation((_evento: string, _cfg: unknown, cb: (p: unknown) => void) => {
      callbackRegistrado = cb;
      return { subscribe: mockSubscribe };
    });

    const callback = vi.fn();

    await servicio.suscribir(
      { tabla: "pedidos", evento: "INSERT", schema: "public" },
      callback
    );

    const payload = {
      eventType: "INSERT",
      new: { id: "1", estado: "pendiente" },
      old: {},
    };

    callbackRegistrado!(payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });

  it("los canales tienen nombres únicos", async () => {
    await servicio.suscribir(
      { tabla: "pedidos", evento: "INSERT", schema: "public" },
      vi.fn()
    );
    await servicio.suscribir(
      { tabla: "pedidos", evento: "UPDATE", schema: "public" },
      vi.fn()
    );

    const nombres = mockChannelFn.mock.calls.map((c: string[]) => c[0]);
    expect(nombres[0]).not.toBe(nombres[1]);
  });
});
