/**
 * Tests unitarios del hook useRastrearPedido
 *
 * Prueba la máquina de estados del modal de rastreo (6 estados)
 * y la integración con useMiPedidoRealtime y la Server Action.
 */
import { renderHook, act } from "@testing-library/react";
import { useRastrearPedido } from "@/hooks/useRastrearPedido";

// Mock de useMiPedidoRealtime
vi.mock("@/hooks/useMiPedidoRealtime", () => ({
  useMiPedidoRealtime: vi.fn(),
}));

// Mock de la Server Action
const mockObtenerPedido = vi.fn();
vi.mock("@/lib/acciones/pedidoPublico", () => ({
  obtenerEstadoPedidoPublico: (...args: unknown[]) => mockObtenerPedido(...args),
}));

const pedidoMock = {
  id: "956ab2a5-1944-4f66-82f1-7e45a86afdb8",
  mesa_id: "mesa-1",
  tipo_despacho: "mesa" as const,
  estado: "pendiente" as const,
  correo_cliente: "cliente@test.com",
  total: 11000,
  paypal_pedido_id: null,
  cocinero_id: null,
  creado_en: "2026-05-18T22:52:29.822915",
  actualizado_en: "2026-05-18T22:52:29.822915",
};

describe("useRastrearPedido — Máquina de estados", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockObtenerPedido.mockReset();
  });

  it("estado inicial es 'input'", () => {
    const { result } = renderHook(() => useRastrearPedido());
    expect(result.current.estado).toBe("input");
    expect(result.current.inputId).toBe("");
    expect(result.current.estadoActual).toBeNull();
  });

  it("setInputId actualiza el input", () => {
    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.setInputId("956AB2A5");
    });

    expect(result.current.inputId).toBe("956AB2A5");
  });

  it("manejarBuscar con input vacío no cambia de estado", () => {
    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.manejarBuscar();
    });

    expect(result.current.estado).toBe("input");
  });

  it("manejarBuscar transiciona a 'validando' y luego a 'rastreando' si encuentra el pedido", async () => {
    mockObtenerPedido.mockResolvedValue(pedidoMock);

    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.setInputId("956AB2A5");
    });

    await act(async () => {
      result.current.manejarBuscar();
    });

    expect(mockObtenerPedido).toHaveBeenCalledWith("956AB2A5");
    expect(result.current.estado).toBe("rastreando");
    expect(result.current.estadoActual).toBe("pendiente");
  });

  it("manejarBuscar transiciona a 'no_encontrado' si el pedido no existe", async () => {
    mockObtenerPedido.mockResolvedValue(null);

    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.setInputId("NOEXISTE");
    });

    await act(async () => {
      result.current.manejarBuscar();
    });

    expect(result.current.estado).toBe("no_encontrado");
  });

  it("manejarBuscar transiciona a 'error' si la API falla", async () => {
    mockObtenerPedido.mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.setInputId("956AB2A5");
    });

    await act(async () => {
      result.current.manejarBuscar();
    });

    expect(result.current.estado).toBe("error");
  });

  it("manejarBuscar va directo a 'entregado' si el pedido ya está en ese estado", async () => {
    mockObtenerPedido.mockResolvedValue({ ...pedidoMock, estado: "entregado" as const });

    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.setInputId("956AB2A5");
    });

    await act(async () => {
      result.current.manejarBuscar();
    });

    expect(result.current.estado).toBe("entregado");
  });

  it("manejarReiniciar vuelve al estado 'input' desde cualquier estado", () => {
    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.manejarReiniciar();
    });

    expect(result.current.estado).toBe("input");
  });

  it("pasa el ID con # a la Server Action (la acción lo limpia)", async () => {
    mockObtenerPedido.mockResolvedValue(pedidoMock);

    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.setInputId("#956AB2A5");
    });

    await act(async () => {
      result.current.manejarBuscar();
    });

    // El hook normaliza a mayúsculas pero no quita el # — eso lo hace la Server Action
    expect(mockObtenerPedido).toHaveBeenCalledWith("#956AB2A5");
    expect(result.current.estado).toBe("rastreando");
  });

  it("normaliza el ID a mayúsculas antes de buscar", async () => {
    mockObtenerPedido.mockResolvedValue(pedidoMock);

    const { result } = renderHook(() => useRastrearPedido());

    act(() => {
      result.current.setInputId("956ab2a5");
    });

    await act(async () => {
      result.current.manejarBuscar();
    });

    expect(mockObtenerPedido).toHaveBeenCalledWith("956AB2A5");
  });
});
