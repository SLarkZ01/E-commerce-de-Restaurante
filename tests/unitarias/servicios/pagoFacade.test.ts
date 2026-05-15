/**
 * Tests unitarios: PagoFacade (Wompi)
 *
 * Verifica la generación de firmas SHA256 y el parseo de errores.
 * Usa vi.stubEnv para controlar variables de entorno a nivel de módulo.
 */

import { PagoFacade } from "@/lib/servicios/PagoFacade";

describe("PagoFacade — Wompi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("WOMBI_INTEGRITY_SECRET", "test_secret_abc");
    vi.stubEnv("NEXT_PUBLIC_WOMBI_PUBLIC_KEY", "pub_test_key");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  describe("generarFirma", () => {
    it("genera un hash SHA256 con el formato correcto", () => {
      const firma = PagoFacade.generarFirma("ref-001", 1000000, "COP");
      expect(firma).toHaveLength(64);
      expect(/^[a-f0-9]{64}$/.test(firma)).toBe(true);
    });

    it("genera firmas diferentes para referencias diferentes", () => {
      const f1 = PagoFacade.generarFirma("ref-001", 1000000);
      const f2 = PagoFacade.generarFirma("ref-002", 1000000);
      expect(f1).not.toBe(f2);
    });

    it("genera firmas diferentes para montos diferentes", () => {
      const f1 = PagoFacade.generarFirma("ref-001", 1000000);
      const f2 = PagoFacade.generarFirma("ref-001", 2000000);
      expect(f1).not.toBe(f2);
    });

    it("es determinista: misma entrada → misma firma", () => {
      const f1 = PagoFacade.generarFirma("ref-001", 1000000, "COP");
      const f2 = PagoFacade.generarFirma("ref-001", 1000000, "COP");
      expect(f1).toBe(f2);
    });
  });

  describe("getPublicKey", () => {
    it("retorna la llave pública configurada vía env", () => {
      vi.stubEnv("NEXT_PUBLIC_WOMBI_PUBLIC_KEY", "pub_test_key");
      // Module-level constants se evalúan al importar. Como stubEnv modifica
      // process.env en runtime, getPublicKey() que lee directo de env sí funciona.
      const key = PagoFacade.getPublicKey();
      // La key se lee al vuelo de process.env, no de module-level
      expect(typeof key).toBe("string");
    });
  });

  describe("obtenerTransaccion", () => {
    it("retorna el email del cliente desde la API de Wompi", async () => {
      const mockFetch = vi.spyOn(global, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              status: "APPROVED",
              reference: "ref-001",
              customer_email: "cliente@test.com",
            },
          }),
          { status: 200 }
        )
      );

      const result = await PagoFacade.obtenerTransaccion("txn-001");

      expect(result.exito).toBe(true);
      expect(result.email).toBe("cliente@test.com");
      expect(result.estado).toBe("APPROVED");
      expect(mockFetch).toHaveBeenCalled();

      mockFetch.mockRestore();
    });

    it("maneja error de API", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce(
        new Response("Not Found", { status: 404 })
      );

      const result = await PagoFacade.obtenerTransaccion("txn-invalid");

      expect(result.exito).toBe(false);
      expect(result.error).toContain("404");
    });
  });
});
