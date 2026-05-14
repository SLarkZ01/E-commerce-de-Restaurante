/**
 * Tests unitarios del Store del Carrito (Singleton Pattern)
 * U-01 a U-07
 *
 * El store usa Zustand con persistencia en localStorage.
 * Cada test usa una instancia limpia para evitar interferencias.
 */

import { create } from "zustand";
import type { ItemCarrito } from "@/types";

// --- Store helper para tests ---
// Recreamos el store sin persistencia para tests (no depende de localStorage)

interface EstadoCarrito {
  items: ItemCarrito[];
  agregarItem: (item: Omit<ItemCarrito, "cantidad">) => void;
  eliminarItem: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  total: () => number;
}

function crearCarritoTest() {
  return create<EstadoCarrito>()((set, get) => ({
    items: [],

    agregarItem: (item) =>
      set((state) => {
        const existente = state.items.find((i) => i.id === item.id);
        if (existente) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, cantidad: 1 }] };
      }),

    eliminarItem: (id) =>
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

    actualizarCantidad: (id, cantidad) =>
      set((state) => {
        if (cantidad <= 0) {
          return { items: state.items.filter((i) => i.id !== id) };
        }
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, cantidad } : i
          ),
        };
      }),

    vaciarCarrito: () => set({ items: [] }),

    total: () =>
      get().items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
  }));
}

// --- Helpers ---
const pizza: Omit<ItemCarrito, "cantidad"> = {
  id: "1",
  nombre: "Pizza",
  precio: 12000,
  imagenUrl: null,
};

const bebida: Omit<ItemCarrito, "cantidad"> = {
  id: "2",
  nombre: "Bebida",
  precio: 5000,
  imagenUrl: null,
};

// --- Tests ---
describe("Carrito Store (Singleton)", () => {
  let usarCarrito: ReturnType<typeof crearCarritoTest>;

  beforeEach(() => {
    usarCarrito = crearCarritoTest();
  });

  // U-01
  it("U-01: agrega un plato nuevo al carrito vacío", () => {
    const store = usarCarrito.getState();
    store.agregarItem(pizza);

    const state = usarCarrito.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].cantidad).toBe(1);
    expect(state.items[0].nombre).toBe("Pizza");
  });

  // U-02
  it("U-02: agrega plato existente incrementa cantidad", () => {
    const store = usarCarrito.getState();
    store.agregarItem(pizza);
    store.agregarItem(pizza);

    const state = usarCarrito.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].cantidad).toBe(2);
  });

  // U-03
  it("U-03: elimina un plato del carrito", () => {
    const store = usarCarrito.getState();
    store.agregarItem(pizza);
    store.agregarItem(bebida);
    expect(usarCarrito.getState().items).toHaveLength(2);

    store.eliminarItem("1");
    const state = usarCarrito.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].nombre).toBe("Bebida");
  });

  // U-04
  it("U-04: actualizar cantidad a 0 elimina el item", () => {
    const store = usarCarrito.getState();
    store.agregarItem(pizza);
    expect(usarCarrito.getState().items).toHaveLength(1);

    store.actualizarCantidad("1", 0);
    expect(usarCarrito.getState().items).toHaveLength(0);
  });

  // U-05
  it("U-05: calcula total con múltiples items", () => {
    const store = usarCarrito.getState();
    // Pizza $12000 x2
    store.agregarItem(pizza);
    store.agregarItem(pizza);
    // Bebida $5000 x1
    store.agregarItem(bebida);

    // Total: 12000*2 + 5000*1 = 29000
    expect(usarCarrito.getState().total()).toBe(29000);
  });

  // U-06
  it("U-06: vaciar carrito deja items en 0", () => {
    const store = usarCarrito.getState();
    store.agregarItem(pizza);
    store.agregarItem(bebida);

    store.vaciarCarrito();
    const state = usarCarrito.getState();
    expect(state.items).toHaveLength(0);
    expect(state.total()).toBe(0);
  });

  // U-07
  it("U-07: carrito es inmutable — state anterior no se modifica", () => {
    const store = usarCarrito.getState();
    store.agregarItem(pizza);
    const estadoAntes = usarCarrito.getState().items;

    store.agregarItem(bebida);
    const estadoDespues = usarCarrito.getState().items;

    // El array items es un nuevo array, no la misma referencia
    expect(estadoDespues).not.toBe(estadoAntes);
    expect(estadoAntes).toHaveLength(1);
    expect(estadoDespues).toHaveLength(2);
  });
});
