import type { Pedido } from "@/types";

export interface EstrategiaDespacho {
  alEntregar(pedido: Pedido): Promise<void>;
  getTipo(): string;
}

export class DespachoMesa implements EstrategiaDespacho {
  getTipo(): string {
    return "mesa";
  }

  async alEntregar(pedido: Pedido): Promise<void> {
    // Liberar mesa — en el futuro se puede reiniciar contador de mesa
    console.log(`Pedido Mesa ${pedido.mesa_id} entregado. Mesa liberada.`);
  }
}

export class DespachoParaLlevar implements EstrategiaDespacho {
  getTipo(): string {
    return "para_llevar";
  }

  async alEntregar(pedido: Pedido): Promise<void> {
    // Enviar notificación por email al cliente
    console.log(
      `Pedido Para Llevar entregado. Notificar a ${pedido.correo_cliente}.`
    );
  }
}

export function crearEstrategiaDespacho(
  tipoDespacho: string
): EstrategiaDespacho {
  return tipoDespacho === "para_llevar"
    ? new DespachoParaLlevar()
    : new DespachoMesa();
}
