/**
 * Tests unitarios: usePedidosRealtime
 *
 * Verifica que el hook de negocio suscribe correctamente
 * a INSERT y UPDATE en pedidos usando IServicioRealtime.
 */

import { renderHook } from "@testing-library/react";
import { usePedidosRealtime } from "@/hooks/usePedidosRealtime";
import type { IServicioRealtime } from "@/lib/servicios/realtimeService";
import type { Pedido } from "@/types";

vi.mock("@/lib/acciones/cocina", () => ({
  obtenerPedidoConDetalles: vi.fn().mockResolvedValue({
    id: "ped-1",
    mesa_id: "mesa-1",
    mesa_numero: 5,
    tipo_despacho: "mesa",
    estado: "pendiente",
    correo_cliente: "cliente@test.com",
    total: 45000,
    paypal_pedido_id: null,
    cocinero_id: null,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString(),
    items: [
      { plato_nombre: "Pizza", plato_imagen_url: null, plato_tipo: "plato_fuerte", cantidad: 2, precio_unitario: 20000 },
      { plato_nombre: "Bebida", plato_imagen_url: null, plato_tipo: "bebida", cantidad: 1, precio_unitario: 5000 },
    ],
  }),
}));

import { obtenerPedidoConDetalles } from "@/lib/acciones/cocina";

type MockSuscribir = ReturnType<typeof vi.fn>;

function crearMockServicio() {
  return {
    suscribir: vi.fn().mockResolvedValue({ cancelar: vi.fn() }) as MockSuscribir,
    desconectarTodo: vi.fn().mockResolvedValue(undefined),
  } as IServicioRealtime & { suscribir: MockSuscribir };
}

const pedidoBase: Pedido = {
  id: "ped-1",
  mesa_id: "mesa-1",
  tipo_despacho: "mesa",
  estado: "pendiente",
  correo_cliente: "cliente@test.com",
  total: 45000,
  paypal_pedido_id: null,
  cocinero_id: null,
  creado_en: new Date().toISOString(),
  actualizado_en: new Date().toISOString(),
};

describe("usePedidosRealtime", () => {
  let servicio: ReturnType<typeof crearMockServicio>;
  const callbacks = {
    onNuevoPedido: vi.fn(),
    onCambioEstado: vi.fn(),
    onPedidoEntregado: vi.fn(),
  };

  beforeEach(() => {
    servicio = crearMockServicio();
    vi.clearAllMocks();
    vi.mocked(obtenerPedidoConDetalles).mockResolvedValue({
      id: "ped-1",
      mesa_id: "mesa-1",
      mesa_numero: 5,
      tipo_despacho: "mesa",
      estado: "pendiente",
      correo_cliente: "cliente@test.com",
      total: 45000,
      paypal_pedido_id: null,
      cocinero_id: null,
      creado_en: new Date().toISOString(),
      actualizado_en: new Date().toISOString(),
      items: [
        { plato_nombre: "Pizza", plato_imagen_url: null, plato_tipo: "plato_fuerte", cantidad: 2, precio_unitario: 20000 },
      ],
    });
  });

  it("suscribe a INSERT y UPDATE en pedidos", () => {
    renderHook(() => usePedidosRealtime(callbacks, servicio));

    expect(servicio.suscribir).toHaveBeenCalledTimes(2);

    const llamadas = servicio.suscribir.mock.calls as Array<[Record<string, string>]>;
    const eventos = llamadas.map((c) => c[0].evento);

    expect(eventos).toContain("INSERT");
    expect(eventos).toContain("UPDATE");
  });

  it("llama onNuevoPedido cuando llega un INSERT con estado pendiente", async () => {
    let callbackInsert: ((p: unknown) => void) | null = null;

    servicio.suscribir.mockImplementation(
      (opciones: Record<string, string>, cb: (p: unknown) => void) => {
        if (opciones.evento === "INSERT") {
          callbackInsert = cb;
        }
        return Promise.resolve({ cancelar: vi.fn() });
      }
    );

    renderHook(() => usePedidosRealtime(callbacks, servicio));

    await vi.waitFor(() => {
      expect(callbackInsert).not.toBeNull();
    });

    callbackInsert!({
      eventType: "INSERT",
      new: pedidoBase,
      old: {} as Record<string, unknown>,
    });

    await vi.waitFor(
      () => {
        expect(callbacks.onNuevoPedido).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });

  it("ignora INSERT si el estado no es pendiente", async () => {
    let callbackInsert: ((p: unknown) => void) | null = null;

    servicio.suscribir.mockImplementation(
      (opciones: Record<string, string>, cb: (p: unknown) => void) => {
        if (opciones.evento === "INSERT") {
          callbackInsert = cb;
        }
        return Promise.resolve({ cancelar: vi.fn() });
      }
    );

    renderHook(() => usePedidosRealtime(callbacks, servicio));

    await vi.waitFor(() => {
      expect(callbackInsert).not.toBeNull();
    });

    callbackInsert!({
      eventType: "INSERT",
      new: { ...pedidoBase, estado: "preparando" },
      old: {} as Record<string, unknown>,
    });

    await new Promise((r) => setTimeout(r, 100));
    expect(callbacks.onNuevoPedido).not.toHaveBeenCalled();
  });

  it("llama onCambioEstado cuando llega un UPDATE con estado no entregado", async () => {
    let callbackUpdate: ((p: unknown) => void) | null = null;

    servicio.suscribir.mockImplementation(
      (opciones: Record<string, string>, cb: (p: unknown) => void) => {
        if (opciones.evento === "UPDATE") {
          callbackUpdate = cb;
        }
        return Promise.resolve({ cancelar: vi.fn() });
      }
    );

    renderHook(() => usePedidosRealtime(callbacks, servicio));

    await vi.waitFor(() => {
      expect(callbackUpdate).not.toBeNull();
    });

    callbackUpdate!({
      eventType: "UPDATE",
      new: { ...pedidoBase, estado: "preparando" },
      old: {} as Record<string, unknown>,
    });

    expect(callbacks.onCambioEstado).toHaveBeenCalledWith("ped-1", "preparando");
    expect(callbacks.onPedidoEntregado).not.toHaveBeenCalled();
  });

  it("llama onPedidoEntregado cuando llega un UPDATE con estado entregado", async () => {
    let callbackUpdate: ((p: unknown) => void) | null = null;

    servicio.suscribir.mockImplementation(
      (opciones: Record<string, string>, cb: (p: unknown) => void) => {
        if (opciones.evento === "UPDATE") {
          callbackUpdate = cb;
        }
        return Promise.resolve({ cancelar: vi.fn() });
      }
    );

    renderHook(() => usePedidosRealtime(callbacks, servicio));

    await vi.waitFor(() => {
      expect(callbackUpdate).not.toBeNull();
    });

    callbackUpdate!({
      eventType: "UPDATE",
      new: { ...pedidoBase, estado: "entregado" },
      old: {} as Record<string, unknown>,
    });

    expect(callbacks.onPedidoEntregado).toHaveBeenCalledWith("ped-1");
    expect(callbacks.onCambioEstado).not.toHaveBeenCalled();
  });
});
