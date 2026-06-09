/**
 * Tests unitarios de la Server Action obtenerEstadoPedidoPublico
 *
 * Mockea el cliente Supabase para probar búsqueda por prefijo,
 * case-insensitive y manejo de errores.
 */
import { obtenerEstadoPedidoPublico } from "@/lib/acciones/pedidoPublico";

const mockRpc = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  crearCliente: async () => ({
    rpc: mockRpc,
  }),
}));

const pedidoMock = {
  id: "956ab2a5-1944-4f66-82f1-7e45a86afdb8",
  mesa_id: "mesa-1",
  tipo_despacho: "mesa",
  estado: "pendiente",
  correo_cliente: "cliente@test.com",
  total: 11000,
  wompi_transaccion_id: null,
  cocinero_id: null,
  creado_en: "2026-05-18T22:52:29.822915",
  actualizado_en: "2026-05-18T22:52:29.822915",
};

describe("obtenerEstadoPedidoPublico", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna null si el prefijo está vacío", async () => {
    const result = await obtenerEstadoPedidoPublico("");
    expect(result).toBeNull();
  });

  it("retorna null si el prefijo es solo espacios", async () => {
    const result = await obtenerEstadoPedidoPublico("   ");
    expect(result).toBeNull();
  });

  it("busca por prefijo usando la función RPC", async () => {
    mockRpc.mockResolvedValue({ data: [pedidoMock], error: null });

    const result = await obtenerEstadoPedidoPublico("956AB2A5");

    expect(mockRpc).toHaveBeenCalledWith("buscar_pedido_por_prefijo", {
      prefijo: "956AB2A5",
    });
    expect(result).toEqual(pedidoMock);
  });

  it("retorna el primer elemento si RPC devuelve array", async () => {
    mockRpc.mockResolvedValue({ data: [pedidoMock], error: null });

    const result = await obtenerEstadoPedidoPublico("956AB2A5");

    expect(result).toEqual(pedidoMock);
  });

  it("retorna el elemento directo si RPC devuelve objeto", async () => {
    mockRpc.mockResolvedValue({ data: pedidoMock, error: null });

    const result = await obtenerEstadoPedidoPublico("956AB2A5");

    expect(result).toEqual(pedidoMock);
  });

  it("retorna null si no hay resultados", async () => {
    mockRpc.mockResolvedValue({ data: [], error: null });

    const result = await obtenerEstadoPedidoPublico("NOEXISTE");

    expect(result).toBeNull();
  });

  it("retorna null si data es null", async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    const result = await obtenerEstadoPedidoPublico("956AB2A5");

    expect(result).toBeNull();
  });

  it("retorna null y loguea si hay error de Supabase", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockRpc.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const result = await obtenerEstadoPedidoPublico("956AB2A5");

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("elimina el prefijo # del ID", async () => {
    mockRpc.mockResolvedValue({ data: [pedidoMock], error: null });

    const result = await obtenerEstadoPedidoPublico("#956AB2A5");

    expect(mockRpc).toHaveBeenCalledWith("buscar_pedido_por_prefijo", {
      prefijo: "956AB2A5",
    });
    expect(result).toEqual(pedidoMock);
  });

  it("elimina solo el primer # del ID", async () => {
    mockRpc.mockResolvedValue({ data: [pedidoMock], error: null });

    await obtenerEstadoPedidoPublico("##956AB2A5");

    expect(mockRpc).toHaveBeenCalledWith("buscar_pedido_por_prefijo", {
      prefijo: "#956AB2A5",
    });
  });
});
