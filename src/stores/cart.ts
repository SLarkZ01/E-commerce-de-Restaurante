import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number;
  imagenUrl: string | null;
  cantidad: number;
}

interface EstadoCarrito {
  items: ItemCarrito[];
  agregarItem: (item: Omit<ItemCarrito, "cantidad">) => void;
  eliminarItem: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  total: () => number;
}

export const usarCarrito = create<EstadoCarrito>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "e-kitchen-carrito",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
