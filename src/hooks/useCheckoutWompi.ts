"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { usarCarrito } from "@/stores/cart";
import { usePago, type DatosWompi } from "@/hooks/usePago";

export type EstadoCheckout = "idle" | "preparando" | "listo" | "pagando" | "exito" | "error";

export function useCheckoutWompi(mesaUuid: string | null, abierto: boolean) {
  const tieneMesa = mesaUuid !== null;

  const storeItems = usarCarrito((s) => s.items);
  const actualizarCantidad = usarCarrito((s) => s.actualizarCantidad);
  const eliminarItem = usarCarrito((s) => s.eliminarItem);
  const totalFn = usarCarrito((s) => s.total);
  const vaciarCarrito = usarCarrito((s) => s.vaciarCarrito);

  const [estado, setEstado] = useState<EstadoCheckout>("idle");
  const [datosWompi, setDatosWompi] = useState<DatosWompi | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [esExito, setEsExito] = useState(false);

  const referenciaRef = useRef("");
  const { prepararWompi, confirmarPedido } = usePago();

  const items = storeItems;
  const total = totalFn();
  const itemsLength = items.length;

  // Efecto principal: preparar pago cuando se abre el sheet/sidebar con items
  useEffect(() => {
    // Solo limpiar datos si el carrito está vacío
    if (itemsLength === 0) {
      setDatosWompi(null);
      return;
    }

    // No preparar si no hay mesa o no está abierto
    if (!abierto || !tieneMesa) return;

    // No re-preparar si ya estamos en un estado activo
    if (estado === "pagando" || estado === "exito") return;

    // Generar referencia fresca cada vez que cambia el total o se abre
    referenciaRef.current = `ekitchen-${Date.now()}`;
    const monto = total * 100;

    setEstado("preparando");
    setMensaje("");

    prepararWompi(referenciaRef.current, monto).then((datos) => {
      if (!datos) {
        setEstado("error");
        setMensaje("No se pudo conectar con el sistema de pago");
        setEsExito(false);
        return;
      }
      setDatosWompi(datos);
      setEstado("listo");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, itemsLength, total, tieneMesa]);

  const manejarExito = useCallback(async (transactionId: string, customerEmail?: string) => {
    if (!tieneMesa) return;
    setEstado("pagando");
    const resultado = await confirmarPedido(mesaUuid!, items, total, transactionId, customerEmail);
    vaciarCarrito();

    if (!resultado.exito) {
      setEstado("error");
      setMensaje(resultado.error ?? "Error al procesar el pago");
      setEsExito(false);
      return;
    }
    setEstado("exito");
    setMensaje(`Pedido #${resultado.pedidoId?.slice(0, 8).toUpperCase()} creado correctamente`);
    setEsExito(true);
  }, [tieneMesa, mesaUuid, items, total, confirmarPedido, vaciarCarrito]);

  const manejarError = useCallback((msg: string) => {
    setEstado("error");
    setMensaje(msg);
    setEsExito(false);
    setTimeout(() => {
      setEstado("idle");
      setMensaje("");
    }, 5000);
  }, []);

  return {
    estado,
    datosWompi,
    mensaje,
    esExito,
    items,
    total,
    actualizarCantidad,
    eliminarItem,
    manejarExito,
    manejarError,
    limpiarMensaje: () => setMensaje(""),
  };
}
