import { Suspense } from "react";
import { obtenerStatsAdmin } from "@/lib/acciones/admin";
import { DashboardAdmin } from "@/components/admin/dashboardAdmin";
import { SkeletonDashboard } from "@/components/admin/skeletonDashboard";

export default async function PaginaAdmin() {
  const stats = await obtenerStatsAdmin();
  return (
    <Suspense fallback={<SkeletonDashboard />}>
      <DashboardAdmin statsIniciales={stats} />
    </Suspense>
  );
}
