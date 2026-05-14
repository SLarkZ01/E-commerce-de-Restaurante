/**
 * Tests unitarios del hook useTiempoTranscurrido
 *
 * Valida el formateo de tiempo relativo y detección de urgencia.
 */

import { renderHook } from "@testing-library/react";
import { useTiempoTranscurrido } from "@/hooks/useTiempoTranscurrido";

const AHORA_FIJO = new Date("2026-05-14T12:00:00Z").getTime();

describe("useTiempoTranscurrido", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(AHORA_FIJO);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formatea 'Ahora' para tiempo < 1 minuto", () => {
    const { result } = renderHook(() => useTiempoTranscurrido(30000));
    const hace30Seg = new Date(AHORA_FIJO - 30 * 1000);
    const formateado = result.current.formatear(hace30Seg.toISOString());
    expect(formateado).toBe("Ahora");
  });

  it("formatea '1 min' para exactamente 1 minuto", () => {
    const { result } = renderHook(() => useTiempoTranscurrido(30000));
    const haceUnMinuto = new Date(AHORA_FIJO - 60 * 1000);
    const formateado = result.current.formatear(haceUnMinuto.toISOString());
    expect(formateado).toBe("1 min");
  });

  it("formatea '5 min' para 5 minutos", () => {
    const { result } = renderHook(() => useTiempoTranscurrido(30000));
    const hace5Min = new Date(AHORA_FIJO - 5 * 60 * 1000);
    const formateado = result.current.formatear(hace5Min.toISOString());
    expect(formateado).toBe("5 min");
  });

  it("detecta urgencia cuando supera el umbral", () => {
    const { result } = renderHook(() => useTiempoTranscurrido(30000));
    const hace15Min = new Date(AHORA_FIJO - 15 * 60 * 1000);
    const urgente = result.current.esUrgente(hace15Min.toISOString(), 10);
    expect(urgente).toBe(true);
  });

  it("no detecta urgencia cuando no supera el umbral", () => {
    const { result } = renderHook(() => useTiempoTranscurrido(30000));
    const hace5Min = new Date(AHORA_FIJO - 5 * 60 * 1000);
    const urgente = result.current.esUrgente(hace5Min.toISOString(), 10);
    expect(urgente).toBe(false);
  });

  it("soporta Date como parámetro", () => {
    const { result } = renderHook(() => useTiempoTranscurrido(30000));
    const hace2Min = new Date(AHORA_FIJO - 2 * 60 * 1000);
    const formateado = result.current.formatear(hace2Min);
    expect(formateado).toBe("2 min");
  });
});
