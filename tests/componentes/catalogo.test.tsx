/**
 * Tests de componente: Catálogo de Platos
 *
 * Verifica filtros, búsqueda y renderizado de tarjetas.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CatalogoPlatos } from "@/components/cliente/catalogoPlatos";

// Mock del store Zustand
const mockAgregarItem = vi.fn();

vi.mock("@/stores/cart", () => ({
  usarCarrito: () => mockAgregarItem,
}));

// Datos de prueba
const platosPrueba = [
  {
    id: "1", nombre: "Pizza Margarita", descripcion: "Con queso", precio: 28000,
    imagen_url: null, tipo_plato: "plato_fuerte" as const, categoria_id: "cat-1",
    disponible: true, ingredientes: ["Tomate", "Queso"], creado_por: null,
    creado_en: "", actualizado_en: "",
  },
  {
    id: "2", nombre: "Limonada", descripcion: "Natural", precio: 9000,
    imagen_url: null, tipo_plato: "bebida" as const, categoria_id: "cat-2",
    disponible: true, ingredientes: null, creado_por: null,
    creado_en: "", actualizado_en: "",
  },
  {
    id: "3", nombre: "Combo Familiar", descripcion: "2 platos + 2 bebidas", precio: 62000,
    imagen_url: null, tipo_plato: "combo" as const, categoria_id: "cat-3",
    disponible: false, ingredientes: null, creado_por: null,
    creado_en: "", actualizado_en: "",
  },
];

const categoriasPrueba = [
  { id: "cat-1", nombre: "Platos Fuertes", slug: "platos_fuertes", creado_en: "" },
  { id: "cat-2", nombre: "Bebidas", slug: "bebidas", creado_en: "" },
  { id: "cat-3", nombre: "Combos", slug: "combos", creado_en: "" },
];

describe("CatalogoPlatos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza todos los platos disponibles", () => {
    render(
      <CatalogoPlatos platos={platosPrueba} categorias={categoriasPrueba} />
    );

    expect(screen.getByText("Pizza Margarita")).toBeInTheDocument();
    expect(screen.getByText("Limonada")).toBeInTheDocument();
    // Combo no disponible — igual se renderiza
    expect(screen.getByText("Combo Familiar")).toBeInTheDocument();
  });

  it("filtra por categoría al hacer clic", async () => {
    const user = userEvent.setup();
    render(
      <CatalogoPlatos platos={platosPrueba} categorias={categoriasPrueba} />
    );

    // Click en "Bebidas"
    await user.click(screen.getByText("Bebidas"));

    // Solo debe verse la bebida
    expect(screen.getByText("Limonada")).toBeInTheDocument();
    expect(screen.queryByText("Pizza Margarita")).not.toBeInTheDocument();
  });

  it("filtra por texto en el buscador", async () => {
    const user = userEvent.setup();
    render(
      <CatalogoPlatos platos={platosPrueba} categorias={categoriasPrueba} />
    );

    const searchInput = screen.getByPlaceholderText("Buscar plato...");
    await user.type(searchInput, "pizza");

    expect(screen.getByText("Pizza Margarita")).toBeInTheDocument();
    expect(screen.queryByText("Limonada")).not.toBeInTheDocument();
  });

  it("muestra estado vacío cuando no hay resultados", async () => {
    const user = userEvent.setup();
    render(
      <CatalogoPlatos platos={platosPrueba} categorias={categoriasPrueba} />
    );

    const searchInput = screen.getByPlaceholderText("Buscar plato...");
    await user.type(searchInput, "xyz_no_existe");

    expect(screen.getByText("No se encontraron platos")).toBeInTheDocument();
  });

  it("llama a agregarItem al hacer clic en Agregar", async () => {
    const user = userEvent.setup();
    render(
      <CatalogoPlatos platos={platosPrueba} categorias={categoriasPrueba} />
    );

    const botones = screen.getAllByText("Agregar");
    await user.click(botones[0]); // Pizza

    expect(mockAgregarItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", nombre: "Pizza Margarita", precio: 28000 })
    );
  });

  it("el botón 'Todos' muestra todos los platos", async () => {
    const user = userEvent.setup();
    render(
      <CatalogoPlatos platos={platosPrueba} categorias={categoriasPrueba} />
    );

    // Filtrar primero
    await user.click(screen.getByText("Bebidas"));
    expect(screen.queryByText("Pizza Margarita")).not.toBeInTheDocument();

    // Volver a "Todos"
    await user.click(screen.getByText("Todos"));
    expect(screen.getByText("Pizza Margarita")).toBeInTheDocument();
    expect(screen.getByText("Limonada")).toBeInTheDocument();
  });
});
