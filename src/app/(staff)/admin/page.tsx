import { obtenerStatsAdmin } from "@/lib/acciones/admin";
import { DashboardAdmin } from "@/components/admin/dashboardAdmin";

export default async function PaginaAdmin() {
  const stats = await obtenerStatsAdmin();
  return <DashboardAdmin statsIniciales={stats} />;
}
