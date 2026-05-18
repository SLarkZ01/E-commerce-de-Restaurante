/**
 * Tests unitarios: NotificacionFacade (Brevo)
 *
 * Usa import dinámico porque la API key se lee a nivel de módulo.
 */

describe("NotificacionFacade — Brevo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("BREVO_API_KEY", "xkeysib-test-key");
    vi.stubEnv("BREVO_FROM_EMAIL", "no-reply@ekitchen.com");
    vi.stubEnv("BREVO_FROM_NAME", "E-Kitchen");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  async function getFacade() {
    const mod = await import("@/lib/servicios/NotificacionFacade");
    return mod.NotificacionFacade;
  }

  describe("enviarComprobante", () => {
    const items = [
      { nombre: "Pizza Margarita", cantidad: 2, precio: 28000, imagenUrl: "https://res.cloudinary.com/e-kitchen/image/upload/pizza.jpg" },
      { nombre: "Limonada", cantidad: 1, precio: 9000, imagenUrl: null },
    ];

    it("envía email con factura HTML correctamente", async () => {
      const mockFetch = vi.spyOn(global, "fetch").mockResolvedValueOnce(
        new Response(JSON.stringify({ messageId: "msg-001" }), { status: 201 })
      );

      const Facade = await getFacade();
      const result = await Facade.enviarComprobante(
        "cliente@test.com", "ped-abc-123", 65000, items, 3
      );

      expect(result.exito).toBe(true);

      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[0]).toBe("https://api.brevo.com/v3/smtp/email");

      const body = JSON.parse(fetchCall[1]!.body as string);
      expect(body.sender.name).toBe("E-Kitchen");
      expect(body.to[0].email).toBe("cliente@test.com");
      expect(body.htmlContent).toContain("E-Kitchen");
      expect(body.htmlContent).toContain("Pizza Margarita");
      expect(body.htmlContent).toContain("$ 65.000");
      expect(body.htmlContent).toContain("Mesa 3");
      expect(body.htmlContent).toContain("cloudinary.com"); // imagen del plato
      expect(body.htmlContent).toContain('alt="Pizza Margarita"'); // alt text de imagen
      expect(body.htmlContent).toContain("L"); // fallback inicial de "Limonada"

      mockFetch.mockRestore();
    });

    it("envía factura con datos de items correctos", async () => {
      const mockFetch = vi.spyOn(global, "fetch").mockResolvedValueOnce(
        new Response("{}", { status: 201 })
      );

      const Facade = await getFacade();
      await Facade.enviarComprobante("test@test.com", "ped-001", 61000, [
        { nombre: "Pizza", cantidad: 2, precio: 28000, imagenUrl: "https://img.example.com/pizza.jpg" },
        { nombre: "Agua", cantidad: 1, precio: 5000, imagenUrl: null },
      ]);

      const body = JSON.parse(mockFetch.mock.calls[0][1]!.body as string);
      expect(body.htmlContent).toContain("Pizza");
      expect(body.htmlContent).toContain("x2");
      expect(body.htmlContent).toContain("Agua");
      expect(body.htmlContent).toContain("$ 61.000");
      expect(body.htmlContent).toContain("img.example.com");

      mockFetch.mockRestore();
    });

    it("retorna error si la API de Brevo falla", async () => {
      const mockFetch = vi.spyOn(global, "fetch").mockResolvedValueOnce(
        new Response("Rate limited", { status: 429 })
      );

      const Facade = await getFacade();
      const result = await Facade.enviarComprobante(
        "test@test.com", "ped-abc", 10000, items
      );

      expect(result.exito).toBe(false);
      expect(result.error).toContain("429");

      mockFetch.mockRestore();
    });
  });
});
