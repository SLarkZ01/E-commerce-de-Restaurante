/**
 * Tests de componente del PagoExitoModal
 *
 * Prueba la visualización del modal de confirmación de pago exitoso:
 * checkmark, ID del pedido, mensaje de correo, botón cerrar.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { PagoExitoModal } from "@/components/cliente/PagoExitoModal";

let mockPedidoId: string | null = null;
const mockCerrar = vi.fn();

vi.mock("@/components/cliente/PagoExitoProvider", () => ({
  usePagoExito: () => ({
    pedidoId: mockPedidoId,
    mostrar: vi.fn(),
    cerrar: mockCerrar,
  }),
}));

describe("PagoExitoModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPedidoId = null;
  });

  it("el modal está oculto cuando no hay pedidoId", () => {
    mockPedidoId = null;

    const { container } = render(<PagoExitoModal />);

    expect(container.textContent).toBe("");
  });

  it("muestra el modal cuando hay un pedidoId", () => {
    mockPedidoId = "956ab2a5-1944-4f66-82f1-7e45a86afdb8";

    render(<PagoExitoModal />);

    expect(screen.getByText("Hemos recibido tu pedido")).toBeDefined();
  });

  it("muestra el ID del pedido en formato corto mayúsculas", () => {
    mockPedidoId = "956ab2a5-1944-4f66-82f1-7e45a86afdb8";

    render(<PagoExitoModal />);

    expect(screen.getByText("956AB2A5")).toBeDefined();
  });

  it("muestra el mensaje de que se envió el recibo por correo", () => {
    mockPedidoId = "956ab2a5-1944-4f66-82f1-7e45a86afdb8";

    render(<PagoExitoModal />);

    expect(
      screen.getByText(/recibo a tu correo electrónico/i)
    ).toBeDefined();
  });

  it("muestra instrucciones para usar Rastrear Pedido", () => {
    mockPedidoId = "956ab2a5-1944-4f66-82f1-7e45a86afdb8";

    render(<PagoExitoModal />);

    expect(screen.getByText(/Rastrear Pedido/)).toBeDefined();
  });

  it("muestra el botón 'Entendido'", () => {
    mockPedidoId = "956ab2a5-1944-4f66-82f1-7e45a86afdb8";

    render(<PagoExitoModal />);

    expect(screen.getByText("Entendido")).toBeDefined();
  });

  it("llama a cerrar al hacer clic en 'Entendido'", () => {
    mockPedidoId = "956ab2a5-1944-4f66-82f1-7e45a86afdb8";

    render(<PagoExitoModal />);

    fireEvent.click(screen.getByText("Entendido"));
    expect(mockCerrar).toHaveBeenCalled();
  });

  it("muestra mensaje de tranquilidad sobre el pedido", () => {
    mockPedidoId = "956ab2a5-1944-4f66-82f1-7e45a86afdb8";

    render(<PagoExitoModal />);

    expect(
      screen.getByText(/Tu orden ya está en manos de nuestra cocina/i)
    ).toBeDefined();
  });
});
