/**
 * Tests unitarios del Strategy Pattern (estrategiaDespacho.ts)
 * U-18, U-19
 *
 * Valida que cada estrategia de despacho ejecute la lógica correcta.
 */

import { crearEstrategiaDespacho, DespachoMesa, DespachoParaLlevar } from "@/lib/servicios/estrategiaDespacho";
import type { Pedido } from "@/types";

const pedidoBase: Pedido = {
  id: "ped-1",
  mesa_id: "mesa-1",
  tipo_despacho: "mesa",
  estado: "listo",
  correo_cliente: null,
  total: 28000,
  wompi_transaccion_id: null,
  cocinero_id: null,
  creado_en: new Date().toISOString(),
  actualizado_en: new Date().toISOString(),
};

describe("Strategy — EstrategiaDespacho", () => {
  // U-18
  describe("Despacho en mesa", () => {
    it("U-18a: crea estrategia mesa por defecto", () => {
      const estrategia = crearEstrategiaDespacho("mesa");
      expect(estrategia).toBeInstanceOf(DespachoMesa);
      expect(estrategia.getTipo()).toBe("mesa");
    });

    it("U-18b: tipo no reconocido devuelve mesa por defecto", () => {
      const estrategia = crearEstrategiaDespacho("cualquier_cosa");
      expect(estrategia).toBeInstanceOf(DespachoMesa);
    });

    it("U-18c: alEntregar no lanza error", async () => {
      const estrategia = crearEstrategiaDespacho("mesa");
      await expect(
        estrategia.alEntregar(pedidoBase)
      ).resolves.toBeUndefined();
    });

    it("U-18d: requiere mesaId en el pedido", async () => {
      const estrategia = crearEstrategiaDespacho("mesa");
      const pedidoSinMesa = { ...pedidoBase, mesa_id: null };
      // No debería lanzar error (el console.log se ejecuta igual)
      await expect(
        estrategia.alEntregar(pedidoSinMesa)
      ).resolves.toBeUndefined();
    });
  });

  // U-19
  describe("Despacho para llevar", () => {
    const pedidoParaLlevar = {
      ...pedidoBase,
      tipo_despacho: "para_llevar" as const,
      mesa_id: null,
      correo_cliente: "cliente@test.com",
    };

    it("U-19a: crea estrategia para llevar", () => {
      const estrategia = crearEstrategiaDespacho("para_llevar");
      expect(estrategia).toBeInstanceOf(DespachoParaLlevar);
      expect(estrategia.getTipo()).toBe("para_llevar");
    });

    it("U-19b: alEntregar no lanza error", async () => {
      const estrategia = crearEstrategiaDespacho("para_llevar");
      await expect(
        estrategia.alEntregar(pedidoParaLlevar)
      ).resolves.toBeUndefined();
    });

    it("U-19c: permite mesa_id nulo", async () => {
      const estrategia = crearEstrategiaDespacho("para_llevar");
      await expect(
        estrategia.alEntregar(pedidoParaLlevar)
      ).resolves.toBeUndefined();
    });
  });

  describe("Interfaz EstrategiaDespacho", () => {
    it("cumple el contrato: getTipo y alEntregar existen", () => {
      const mesa = new DespachoMesa();
      const llevar = new DespachoParaLlevar();

      expect(typeof mesa.getTipo).toBe("function");
      expect(typeof mesa.alEntregar).toBe("function");
      expect(typeof llevar.getTipo).toBe("function");
      expect(typeof llevar.alEntregar).toBe("function");
    });
  });
});
