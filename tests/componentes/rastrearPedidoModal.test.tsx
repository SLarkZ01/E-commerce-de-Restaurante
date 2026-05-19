/**
 * Tests de componente del RastrearPedidoModal
 *
 * Prueba el modal shell + subcomponentes de cada estado.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { RastrearPedidoModal } from "@/components/cliente/rastrearPedidoModal";

// Mock del provider
let mockMostrar: (id: string) => void = vi.fn();
let mockCerrar = vi.fn();
let mockAbierto = false;

vi.mock("@/components/cliente/RastrearPedidoProvider", () => ({
  useRastrearPedido: () => ({
    abierto: mockAbierto,
    abrir: vi.fn(),
    cerrar: mockCerrar,
  }),
}));

// Mock del hook useRastrearPedido
let mockEstado = "input" as string;
let mockInputId = "";
let mockEstadoActual: string | null = null;
const mockSetInputId = vi.fn();
const mockManejarBuscar = vi.fn();
const mockManejarReiniciar = vi.fn();

vi.mock("@/hooks/useRastrearPedido", () => ({
  useRastrearPedido: () => ({
    estado: mockEstado,
    inputId: mockInputId,
    estadoActual: mockEstadoActual,
    setInputId: mockSetInputId,
    manejarBuscar: mockManejarBuscar,
    manejarReiniciar: mockManejarReiniciar,
  }),
}));

describe("RastrearPedidoModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAbierto = true;
    mockEstado = "input";
    mockInputId = "";
    mockEstadoActual = null;
  });

  it("renderiza el título 'Rastrear Pedido' cuando está abierto", () => {
    render(<RastrearPedidoModal />);

    expect(screen.getByText("Rastrear Pedido")).toBeDefined();
  });

  it("muestra el input y botón de búsqueda en estado 'input'", () => {
    mockEstado = "input";

    render(<RastrearPedidoModal />);

    expect(screen.getByPlaceholderText("Ej: 66DF8CA2")).toBeDefined();
    expect(screen.getByText("Rastrear")).toBeDefined();
  });

  it("llama a manejarBuscar al hacer clic en el botón", () => {
    mockEstado = "input";
    mockInputId = "956AB2A5";

    render(<RastrearPedidoModal />);

    fireEvent.click(screen.getByText("Rastrear"));
    expect(mockManejarBuscar).toHaveBeenCalled();
  });

  it("deshabilita el botón si el input está vacío", () => {
    mockEstado = "input";
    mockInputId = "";

    render(<RastrearPedidoModal />);

    const boton = screen.getByText("Rastrear");
    expect(boton.closest("button")?.hasAttribute("disabled")).toBe(true);
  });

  it("muestra el loader en estado 'validando'", () => {
    mockEstado = "validando";

    render(<RastrearPedidoModal />);

    expect(screen.getByText("Buscando pedido...")).toBeDefined();
  });

  it("muestra el stepper en estado 'rastreando'", () => {
    mockEstado = "rastreando";
    mockEstadoActual = "pendiente";

    render(<RastrearPedidoModal />);

    expect(screen.getByText("Pendiente")).toBeDefined();
    expect(screen.getByText("Preparando")).toBeDefined();
    expect(screen.getByText("Listo")).toBeDefined();
    expect(screen.getByText("Entregado")).toBeDefined();
  });

  it("muestra 'Pedido Entregado' en estado 'entregado'", () => {
    mockEstado = "entregado";

    render(<RastrearPedidoModal />);

    expect(screen.getByText("Pedido Entregado")).toBeDefined();
    expect(screen.getByText("Cerrar")).toBeDefined();
  });

  it("llama a cerrar al hacer clic en Cerrar en estado entregado", () => {
    mockEstado = "entregado";

    render(<RastrearPedidoModal />);

    fireEvent.click(screen.getByText("Cerrar"));
    expect(mockCerrar).toHaveBeenCalled();
  });

  it("muestra 'Pedido no encontrado' y botón de reintentar", () => {
    mockEstado = "no_encontrado";

    render(<RastrearPedidoModal />);

    expect(screen.getByText("Pedido no encontrado")).toBeDefined();
    expect(screen.getByText("Intentar de nuevo")).toBeDefined();
  });

  it("llama a manejarReiniciar al reintentar desde no_encontrado", () => {
    mockEstado = "no_encontrado";

    render(<RastrearPedidoModal />);

    fireEvent.click(screen.getByText("Intentar de nuevo"));
    expect(mockManejarReiniciar).toHaveBeenCalled();
  });

  it("muestra 'Error al buscar' en estado 'error'", () => {
    mockEstado = "error";

    render(<RastrearPedidoModal />);

    expect(screen.getByText("Error al buscar")).toBeDefined();
  });

  it("el modal está oculto cuando abierto es false", () => {
    mockAbierto = false;

    const { container } = render(<RastrearPedidoModal />);

    expect(container.textContent).toBe("");
  });
});
