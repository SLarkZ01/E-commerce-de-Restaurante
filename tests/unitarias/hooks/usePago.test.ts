/**
 * Tests unitarios del hook usePago
 *
 * Mockea las Server Actions para probar la lógica del hook
 * sin depender de Supabase o Wompi.
 */

import { renderHook, act } from "@testing-library/react";
import { usePago } from "@/hooks/usePago";

// Mock de Server Actions
const mockPrepararPagoWompi = vi.fn();
const mockCrearPedidoWompi = vi.fn();

vi.mock("@/lib/acciones/pago", () => ({
  prepararPagoWompi: (...args: unknown[]) => mockPrepararPagoWompi(...args),
  crearPedidoWompi: (...args: unknown[]) => mockCrearPedidoWompi(...args),
}));

describe("usePago", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("prepararWompi", () => {
    it("retorna DatosWompi cuando la Server Action tiene éxito", async () => {
      mockPrepararPagoWompi.mockResolvedValue({
        publicKey: "pub_test_key",
        firma: "abc123hash",
      });

      const { result } = renderHook(() => usePago());

      const datos = await act(() =>
        result.current.prepararWompi("ref-001", 1000000)
      );

      expect(datos).toEqual({
        publicKey: "pub_test_key",
        referencia: "ref-001",
        montoEnCentavos: 1000000,
        firma: "abc123hash",
        moneda: "COP",
      });
      expect(mockPrepararPagoWompi).toHaveBeenCalledWith("ref-001", 1000000);
    });

    it("retorna null cuando la Server Action falla", async () => {
      mockPrepararPagoWompi.mockResolvedValue({
        publicKey: "",
        firma: "",
        error: "Wompi no configurado",
      });

      const { result } = renderHook(() => usePago());

      const datos = await act(() =>
        result.current.prepararWompi("ref-002", 500000)
      );

      expect(datos).toBeNull();
    });
  });

  describe("confirmarPedido", () => {
    const itemsPrueba = [
      { id: "1", nombre: "Pizza", precio: 12000, imagenUrl: null, cantidad: 2 },
    ];

    it("confirma pedido con éxito", async () => {
      mockCrearPedidoWompi.mockResolvedValue({
        pedidoId: "ped-123-abc",
      });

      const { result } = renderHook(() => usePago());

      const r = await act(() =>
        result.current.confirmarPedido("mesa-uuid", itemsPrueba, 24000, "txn-001")
      );

      expect(r.exito).toBe(true);
      expect(r.pedidoId).toBe("ped-123-abc");
      expect(mockCrearPedidoWompi).toHaveBeenCalledTimes(1);
      expect(mockCrearPedidoWompi.mock.calls[0].slice(0, 4)).toEqual([
        "mesa-uuid", itemsPrueba, 24000, "txn-001",
      ]);
    });

    it("maneja error al confirmar pedido", async () => {
      mockCrearPedidoWompi.mockResolvedValue({
        pedidoId: "",
        error: "Mesa no encontrada",
      });

      const { result } = renderHook(() => usePago());

      const r = await act(() =>
        result.current.confirmarPedido("bad-mesa", itemsPrueba, 24000, "txn-002")
      );

      expect(r.exito).toBe(false);
      expect(r.error).toBe("Mesa no encontrada");
    });

    it("maneja excepción inesperada", async () => {
      mockCrearPedidoWompi.mockRejectedValue(new Error("Red caída"));

      const { result } = renderHook(() => usePago());

      const r = await act(() =>
        result.current.confirmarPedido("mesa-uuid", itemsPrueba, 24000, "txn-003")
      );

      expect(r.exito).toBe(false);
      expect(r.error).toBe("Red caída");
    });
  });
});
