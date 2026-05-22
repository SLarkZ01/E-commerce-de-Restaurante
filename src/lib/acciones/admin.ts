"use server";

import { crearCliente } from "@/lib/supabase/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type {
  Perfil,
  Mesa,
  StatsAdmin,
  EstadisticaDashboard,
  IngresoPorHora,
  IngresoPorDia,
  DistribucionEstado,
  PlatoPopular,
  PedidoConDetalles,
  ItemPedidoConImagen,
  TipoPlato,
  EstadoPedido,
} from "@/types";

export async function obtenerPerfiles(): Promise<Perfil[]> {
  const supabase = await crearCliente();
  const { data } = await supabase.from("perfiles").select("*");
  return (data ?? []) as Perfil[];
}

export async function obtenerMesas(): Promise<Mesa[]> {
  const supabase = await crearCliente();
  const { data } = await supabase
    .from("mesas")
    .select("*")
    .order("numero", { ascending: true });
  return (data ?? []) as Mesa[];
}

export async function crearPerfil(datos: {
  email: string;
  nombre: string;
  password: string;
  rol: string;
}) {
  if (!datos.nombre?.trim()) throw new Error("El nombre es requerido");
  if (!datos.email?.includes("@")) throw new Error("El email no es válido");
  if (!datos.password || datos.password.length < 6)
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  const rolesValidos = ["cocinero", "mesero", "admin"];
  if (!rolesValidos.includes(datos.rol)) throw new Error("Rol inválido");

  const adminClient = crearClienteAdmin();

  const { data: authUser, error: authError } =
    await adminClient.auth.admin.createUser({
      email: datos.email,
      password: datos.password,
      email_confirm: true,
      user_metadata: { nombre: datos.nombre, rol: datos.rol },
    });

  if (authError) {
    if (authError.message?.includes("already been registered")) {
      throw new Error("Ya existe un usuario con ese correo");
    }
    throw new Error(authError.message);
  }

  if (!authUser?.user?.id) {
    throw new Error("No se pudo crear el usuario de autenticación");
  }

  const supabase = await crearCliente();

  const { data, error } = await supabase
    .from("perfiles")
    .insert({
      id: authUser.user.id,
      email: datos.email,
      nombre: datos.nombre,
      rol: datos.rol,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/personal");
  return data;
}

export async function eliminarPerfil(id: string) {
  const supabase = await crearCliente();

  // Anular FKs en pedidos y platos para evitar FK violation
  await Promise.all([
    supabase.from("pedidos").update({ cocinero_id: null }).eq("cocinero_id", id),
    supabase.from("platos").update({ creado_por: null }).eq("creado_por", id),
  ]);

  const { error } = await supabase
    .from("perfiles")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/personal");
}

export async function crearMesa(numero: number) {
  const supabase = await crearCliente();

  const { data: existente } = await supabase
    .from("mesas")
    .select("id")
    .eq("numero", numero)
    .maybeSingle();

  if (existente) {
    throw new Error(`Ya existe una mesa con el número ${numero}`);
  }

  const { data, error } = await supabase
    .from("mesas")
    .insert({ numero })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/mesas");
  return data;
}

export async function eliminarMesa(id: string) {
  const supabase = await crearCliente();

  // Verificar si hay pedidos activos en esta mesa
  const { data: pedidosActivos } = await supabase
    .from("pedidos")
    .select("id")
    .eq("mesa_id", id)
    .neq("estado", "entregado")
    .limit(1);

  if (pedidosActivos && pedidosActivos.length > 0) {
    throw new Error(
      "No se puede eliminar la mesa porque tiene pedidos activos. Entrégalos primero."
    );
  }

  // Anular mesa_id en pedidos históricos (entregados) para evitar FK violation
  await supabase
    .from("pedidos")
    .update({ mesa_id: null })
    .eq("mesa_id", id);

  const { error } = await supabase.from("mesas").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/mesas");
}

export async function obtenerStatsAdmin(): Promise<StatsAdmin> {
  const supabase = await crearCliente();

  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString();
  const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1).toISOString();

  const [pedidosResult, itemsResult] = await Promise.all([
    supabase
      .from("pedidos")
      .select(`*, mesas(numero), items_pedido(cantidad, precio_unitario, platos(nombre, imagen_url, tipo_plato))`)
      .order("creado_en", { ascending: false }),
    supabase
      .from("items_pedido")
      .select("cantidad, precio_unitario, pedidos(creado_en), platos(nombre)")
      .order("cantidad", { ascending: false }),
  ]);

  const pedidosRaw = (pedidosResult.data ?? []) as Array<Record<string, unknown>>;
  const itemsRaw = (itemsResult.data ?? []) as Array<Record<string, unknown>>;

  const pedidos: PedidoConDetalles[] = pedidosRaw.map((pedido) => {
    const mesaData = pedido.mesas as Record<string, unknown> | null;
    const itemsData = (pedido.items_pedido as Array<Record<string, unknown>>) ?? [];
    const items: ItemPedidoConImagen[] = itemsData.map((item) => {
      const plato = item.platos as Record<string, unknown> ?? {};
      return {
        plato_nombre: (plato.nombre as string) ?? "Plato",
        plato_imagen_url: (plato.imagen_url as string) ?? null,
        plato_tipo: (plato.tipo_plato as TipoPlato) ?? "plato_fuerte",
        cantidad: (item.cantidad as number) ?? 1,
        precio_unitario: Number(item.precio_unitario ?? 0),
      };
    });
    return {
      id: pedido.id as string,
      mesa_id: (pedido.mesa_id as string) ?? null,
      mesa_numero: mesaData ? (mesaData.numero as number) : null,
      tipo_despacho: (pedido.tipo_despacho as "mesa" | "para_llevar") ?? "mesa",
      estado: pedido.estado as EstadoPedido,
      correo_cliente: (pedido.correo_cliente as string) ?? null,
      total: Number(pedido.total ?? 0),
      wompi_transaccion_id: (pedido.wompi_transaccion_id as string) ?? null,
      cocinero_id: (pedido.cocinero_id as string) ?? null,
      creado_en: pedido.creado_en as string,
      actualizado_en: pedido.actualizado_en as string,
      items,
    };
  });

  // --- estadisticas ---
  const ventasTotales = pedidos
    .filter((p) => p.estado !== "pendiente")
    .reduce((sum, p) => sum + p.total, 0);

  const pedidosHoy = pedidos.filter((p) => p.creado_en >= inicioHoy && p.creado_en < finHoy);
  const ventasHoy = pedidosHoy
    .filter((p) => p.estado !== "pendiente")
    .reduce((sum, p) => sum + p.total, 0);
  const completadosHoy = pedidosHoy.filter(
    (p) => p.estado === "entregado" || p.estado === "listo"
  ).length;

  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const preparando = pedidos.filter((p) => p.estado === "preparando").length;
  const listos = pedidos.filter((p) => p.estado === "listo").length;

  const pedidosConTotal = pedidos.filter((p) => p.estado !== "pendiente");
  const promedioPorPedido =
    pedidosConTotal.length > 0
      ? Math.round(pedidosConTotal.reduce((sum, p) => sum + p.total, 0) / pedidosConTotal.length)
      : 0;

  const estadisticas: EstadisticaDashboard = {
    ventasTotales,
    ventasHoy,
    pedidosHoy: pedidosHoy.length,
    completadosHoy,
    pendientes,
    preparando,
    listos,
    promedioPorPedido,
  };

  // --- ingresos por hora (hoy) ---
  const mapaHora = new Map<number, number>();
  for (let h = 0; h < 24; h++) mapaHora.set(h, 0);
  for (const p of pedidosHoy) {
    const hora = new Date(p.creado_en).getHours();
    mapaHora.set(hora, (mapaHora.get(hora) ?? 0) + p.total);
  }
  const ingresosPorHora: IngresoPorHora[] = Array.from(mapaHora.entries()).map(([hora, total]) => ({
    hora,
    total,
  }));

  // --- ingresos por dia (ultimos 7 dias) ---
  const mapaDia = new Map<string, { total: number; cantidad: number }>();
  for (let d = 0; d < 7; d++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - d);
    const clave = fecha.toISOString().slice(0, 10);
    mapaDia.set(clave, { total: 0, cantidad: 0 });
  }
  for (const p of pedidos) {
    const clave = p.creado_en.slice(0, 10);
    const entrada = mapaDia.get(clave);
    if (entrada) {
      entrada.total += p.total;
      entrada.cantidad += 1;
    }
  }
  const ingresosPorDia: IngresoPorDia[] = Array.from(mapaDia.entries())
    .map(([fecha, val]) => ({ fecha, total: val.total, cantidad: val.cantidad }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  // --- distribucion estado ---
  const coloresEstado: Record<string, string> = {
    pendiente: "#3B82F6",
    preparando: "#F59E0B",
    listo: "#65A30D",
    entregado: "#C44536",
  };
  const cuentaEstado = new Map<string, number>();
  for (const p of pedidos) {
    cuentaEstado.set(p.estado, (cuentaEstado.get(p.estado) ?? 0) + 1);
  }
  const distribucionEstado: DistribucionEstado[] = Array.from(cuentaEstado.entries()).map(
    ([estado, cantidad]) => ({
      estado,
      cantidad,
      color: coloresEstado[estado] ?? "#78716C",
    })
  );

  // --- platos populares ---
  const mapaPlato = new Map<string, { cantidad: number; total: number }>();
  for (const item of itemsRaw) {
    const platoData = item.platos as Record<string, unknown> | null;
    const nombre = platoData?.nombre as string;
    if (!nombre) continue;
    const cant = (item.cantidad as number) ?? 0;
    const precio = Number(item.precio_unitario ?? 0);
    const existente = mapaPlato.get(nombre) ?? { cantidad: 0, total: 0 };
    existente.cantidad += cant;
    existente.total += cant * precio;
    mapaPlato.set(nombre, existente);
  }
  const platosPopulares: PlatoPopular[] = Array.from(mapaPlato.entries())
    .map(([nombre, val]) => ({ nombre, cantidad: val.cantidad, total: val.total }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10);

  return {
    estadisticas,
    ingresosPorHora,
    ingresosPorDia,
    distribucionEstado,
    platosPopulares,
    pedidosRecientes: pedidos.slice(0, 50),
  };
}
