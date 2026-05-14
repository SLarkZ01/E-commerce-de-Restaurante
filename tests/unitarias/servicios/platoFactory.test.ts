/**
 * Tests unitarios del Factory Method (platoFactory.ts)
 * U-15 a U-17
 *
 * Valida que cada tipo de plato se cree con las reglas correctas.
 */

import { crearPlatoFactory } from "@/lib/servicios/platoFactory";
import type { DatosFormularioPlato } from "@/components/cocina/FormularioPlato";

const datosBase: DatosFormularioPlato = {
  nombre: "Pizza Margarita",
  precio: 28000,
  tipoPlato: "plato_fuerte",
  ingredientes: ["Tomate", "Queso", "Albahaca"],
};

describe("Factory Method — PlatoFactory", () => {
  // U-15
  describe("Plato Fuerte", () => {
    it("U-15a: crea plato fuerte con ingredientes válidos", () => {
      const factory = crearPlatoFactory("plato_fuerte");
      const error = factory.validar(datosBase);
      expect(error).toBeNull();
    });

    it("U-15b: rechaza plato fuerte sin suficientes ingredientes", () => {
      const factory = crearPlatoFactory("plato_fuerte");
      const error = factory.validar({
        ...datosBase,
        ingredientes: [],
      });
      expect(error).toContain("ingredientes");
    });

    it("U-15c: rechaza plato fuerte con menos de 2 ingredientes", () => {
      const factory = crearPlatoFactory("plato_fuerte");
      const error = factory.validar({
        ...datosBase,
        ingredientes: ["Tomate"],
      });
      expect(error).toContain("ingredientes");
    });

    it("U-15d: transformar incluye ingredientes en los datos DB", () => {
      const factory = crearPlatoFactory("plato_fuerte");
      const datosDB = factory.transformar(datosBase, "url-imagen");
      expect(datosDB.ingredientes).toEqual(["Tomate", "Queso", "Albahaca"]);
      expect(datosDB.imagenUrl).toBe("url-imagen");
    });
  });

  // U-16
  describe("Bebida", () => {
    const datosBebida: DatosFormularioPlato = {
      ...datosBase,
      tipoPlato: "bebida",
      ingredientes: [],
    };

    it("U-16a: crea bebida sin ingredientes", () => {
      const factory = crearPlatoFactory("bebida");
      const error = factory.validar(datosBebida);
      expect(error).toBeNull();
    });

    it("U-16b: rechaza bebida sin nombre", () => {
      const factory = crearPlatoFactory("bebida");
      const error = factory.validar({ ...datosBebida, nombre: "" });
      expect(error).toContain("nombre");
    });

    it("U-16c: rechaza bebida con precio <= 0", () => {
      const factory = crearPlatoFactory("bebida");
      const error = factory.validar({ ...datosBebida, precio: 0 });
      expect(error).toContain("precio");
    });
  });

  // U-17
  describe("Combo", () => {
    const datosCombo: DatosFormularioPlato = {
      ...datosBase,
      tipoPlato: "combo",
      ingredientes: [],
    };

    it("U-17a: crea combo sin ingredientes", () => {
      const factory = crearPlatoFactory("combo");
      const error = factory.validar(datosCombo);
      expect(error).toBeNull();
    });

    it("U-17b: rechaza combo sin nombre", () => {
      const factory = crearPlatoFactory("combo");
      const error = factory.validar({ ...datosCombo, nombre: "" });
      expect(error).toContain("nombre");
    });

    it("U-17c: rechaza combo con precio <= 0", () => {
      const factory = crearPlatoFactory("combo");
      const error = factory.validar({ ...datosCombo, precio: 0 });
      expect(error).toContain("precio");
    });
  });
});
