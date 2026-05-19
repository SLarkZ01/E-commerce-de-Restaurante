/**
 * Tests unitarios del hook useCheckoutWompi
 *
 * Mockea Zustand y usePago para probar la máquina de estados del checkout.
 */

import { renderHook, act } from "@testing-library/react";
import { useCheckoutWompi } from "@/hooks/useCheckoutWompi";

// Mock del store Zustand
const mockStore = {
  items: [] as Array<{ id: string; nombre: string; precio: number; imagenUrl: string | null; cantidad: number }>,
  actualizarCantidad: vi.fn(),
  eliminarItem: vi.fn(),
  total: vi.fn(() => 10000),
  vaciarCarrito: vi.fn(),
};

vi.mock("@/stores/cart", () => ({
  usarCarrito: (selector: (s: unknown) => unknown) => {
    // Zustand selector — llamamos con el mock
    return selector(mockStore);
  },
}));

// Mock de usePago
const mockPrepararWompi = vi.fn();
const mockConfirmarPedido = vi.fn();

vi.mock("@/hooks/usePago", () => ({
  usePago: () => ({
    prepararWompi: mockPrepararWompi,
    confirmarPedido: mockConfirmarPedido,
  }),
}));

describe("useCheckoutWompi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.items = [
      { id: "1", nombre: "Pizza", precio: 12000, imagenUrl: null, cantidad: 1 },
    ];
    mockStore.total.mockReturnValue(12000);
    mockPrepararWompi.mockResolvedValue({
      publicKey: "pub_test",
      referencia: "ref-001",
      montoEnCentavos: 1200000,
      firma: "hash123",
      moneda: "COP",
    });
    mockConfirmarPedido.mockResolvedValue({ exito: true, pedidoId: "ped-abc" });
  });

  it("estado inicial es idle", () => {
    const { result } = renderHook(() =>
      useCheckoutWompi("mesa-uuid", false)
    );

    expect(result.current.estado).toBe("idle");
    expect(result.current.datosWompi).toBeNull();
  });

  it("transición idle → preparando → listo al abrir", async () => {
    const { result, rerender } = renderHook(
      ({ abierto }) => useCheckoutWompi("mesa-uuid", abierto),
      { initialProps: { abierto: false } }
    );

    expect(result.current.estado).toBe("idle");

    // Abrir el sheet
    act(() => {
      rerender({ abierto: true });
    });

    // Esperar a que se resuelva la promesa del useEffect
    await vi.waitFor(() => {
      expect(result.current.estado).toBe("listo");
    }, { timeout: 5000 });

    expect(mockPrepararWompi).toHaveBeenCalled();
    expect(result.current.datosWompi).not.toBeNull();
  });

  it("manejarExito crea pedido y vacía carrito", async () => {
    mockConfirmarPedido.mockResolvedValue({ exito: true, pedidoId: "ped-xyz" });

    const { result } = renderHook(() =>
      useCheckoutWompi("mesa-uuid", false)
    );

    await act(async () => {
      await result.current.manejarExito("txn-001");
    });

    expect(mockConfirmarPedido).toHaveBeenCalledWith(
      "mesa-uuid",
      mockStore.items,
      mockStore.total(),
      "txn-001",
      undefined
    );
    expect(mockStore.vaciarCarrito).toHaveBeenCalled();
    expect(result.current.estado).toBe("exito");
    expect(result.current.mensaje).toContain("PED-XYZ");
    expect(result.current.esExito).toBe(true);
  });

  it("manejarExito pasa email del cliente al confirmarPedido", async () => {
    mockConfirmarPedido.mockResolvedValue({ exito: true, pedidoId: "ped-email" });

    const { result } = renderHook(() =>
      useCheckoutWompi("mesa-uuid", false)
    );

    await act(async () => {
      await result.current.manejarExito("txn-email", "cliente@wompi.com");
    });

    expect(mockConfirmarPedido).toHaveBeenCalledWith(
      "mesa-uuid",
      mockStore.items,
      mockStore.total(),
      "txn-email",
      "cliente@wompi.com"
    );
    expect(result.current.estado).toBe("exito");
  });

  it("manejarExito muestra error si el pago falla", async () => {
    mockConfirmarPedido.mockResolvedValue({ exito: false, error: "Mesa no encontrada" });

    const { result } = renderHook(() =>
      useCheckoutWompi("mesa-uuid", false)
    );

    await act(async () => {
      await result.current.manejarExito("txn-002");
    });

    expect(result.current.estado).toBe("error");
    expect(result.current.mensaje).toBe("Mesa no encontrada");
    expect(result.current.esExito).toBe(false);
  });

  it("manejarError pone estado error con mensaje", () => {
    const { result } = renderHook(() =>
      useCheckoutWompi("mesa-uuid", false)
    );

    act(() => {
      result.current.manejarError("El pago fue rechazado");
    });

    expect(result.current.estado).toBe("error");
    expect(result.current.mensaje).toBe("El pago fue rechazado");
  });

  it("retorna null para mesaUuid null", async () => {
    const { result, rerender } = renderHook(
      ({ abierto }) => useCheckoutWompi(null, abierto),
      { initialProps: { abierto: false } }
    );

    rerender({ abierto: true });

    // No debería llamar a prepararWompi porque no hay mesa
    expect(mockPrepararWompi).not.toHaveBeenCalled();
    expect(result.current.estado).toBe("idle");
  });
});
